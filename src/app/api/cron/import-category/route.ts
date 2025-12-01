import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  fetchNewsByCategory,
  generateSlug,
  estimateReadTime,
  convertToContentBlocks,
  extractTickers,
  NewsDataArticle,
} from '@/lib/newsdata';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const CRON_SECRET = process.env.CRON_SECRET;

// Search queries for each category
const CATEGORY_QUERIES: Record<string, string> = {
  crypto: 'bitcoin OR ethereum OR cryptocurrency OR crypto OR blockchain',
  economy: 'economy OR inflation OR federal reserve OR GDP OR unemployment OR fiscal policy',
  opinion: 'market analysis OR stock forecast OR investment outlook OR expert opinion OR financial commentary',
};

async function getOrCreateNewsDataAuthor() {
  const existingAuthor = await prisma.author.findFirst({
    where: { name: 'NewsData' },
  });

  if (existingAuthor) {
    return existingAuthor;
  }

  return prisma.author.create({
    data: {
      name: 'NewsData',
      bio: 'Automated news import from NewsData.io',
      avatar: '/images/newsdata-avatar.png',
    },
  });
}

async function getCategoryId(categorySlug: string): Promise<string> {
  let category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    const categoryNames: Record<string, string> = {
      crypto: 'Crypto',
      economy: 'Economy',
      opinion: 'Opinion',
      markets: 'Markets',
      tech: 'Tech',
    };
    category = await prisma.category.create({
      data: {
        name: categoryNames[categorySlug] || categorySlug,
        slug: categorySlug,
        color: 'bg-blue-600',
      },
    });
  }

  return category.id;
}

async function getOrCreateTags(keywords: string[] | null): Promise<string[]> {
  if (!keywords || keywords.length === 0) return [];

  const limitedKeywords = keywords.slice(0, 5);
  const tagIds: string[] = [];

  for (const keyword of limitedKeywords) {
    const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    if (!slug) continue;

    let tag = await prisma.tag.findUnique({ where: { slug } });

    if (!tag) {
      tag = await prisma.tag.create({
        data: { name: keyword, slug },
      });
    }

    tagIds.push(tag.id);
  }

  return tagIds;
}

async function articleExists(externalId: string): Promise<boolean> {
  const existing = await prisma.article.findUnique({
    where: { externalId },
    select: { id: true },
  });
  return !!existing;
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

async function importArticle(
  article: NewsDataArticle,
  authorId: string,
  targetCategory: string
): Promise<{ success: boolean; articleId?: string; error?: string }> {
  try {
    if (await articleExists(article.article_id)) {
      return { success: false, error: 'Already imported' };
    }

    const baseSlug = generateSlug(article.title);
    const slug = await ensureUniqueSlug(baseSlug);
    const categoryId = await getCategoryId(targetCategory);
    const tagIds = await getOrCreateTags(article.keywords);
    const contentBlocks = convertToContentBlocks(article.content, article.description);
    const tickers = extractTickers(article.content, article.title);

    const newArticle = await prisma.article.create({
      data: {
        title: article.title,
        slug,
        excerpt: article.description || article.title,
        content: contentBlocks,
        imageUrl: article.image_url || '/images/placeholder-news.jpg',
        publishedAt: new Date(article.pubDate),
        readTime: estimateReadTime(article.content),
        isFeatured: false,
        isBreaking: false,
        externalId: article.article_id,
        sourceUrl: article.link,
        relevantTickers: tickers,
        authorId,
        categoryId,
        tags: {
          connect: tagIds.map(id => ({ id })),
        },
      },
    });

    return { success: true, articleId: newArticle.id };
  } catch (error) {
    console.error(`[Import] Failed to import article ${article.article_id}:`, error);
    return { success: false, error: String(error) };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');
  const category = url.searchParams.get('category') as 'crypto' | 'economy' | 'opinion' | null;

  const isAuthorized =
    authHeader === `Bearer ${CRON_SECRET}` ||
    secretParam === CRON_SECRET ||
    (process.env.NODE_ENV === 'development' && !CRON_SECRET);

  if (!isAuthorized && CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!category || !CATEGORY_QUERIES[category]) {
    return NextResponse.json(
      { error: 'Invalid category. Use: crypto, economy, or opinion' },
      { status: 400 }
    );
  }

  console.log(`[Cron] Starting ${category} news import...`);

  try {
    const author = await getOrCreateNewsDataAuthor();
    const articles = await fetchNewsByCategory(category, CATEGORY_QUERIES[category]);

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: `No new ${category} articles to import`,
        imported: 0,
        skipped: 0,
      });
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      details: [] as { title: string; status: string }[],
    };

    for (const article of articles) {
      const result = await importArticle(article, author.id, category);

      if (result.success) {
        results.imported++;
        results.details.push({ title: article.title, status: 'imported' });
      } else if (result.error === 'Already imported') {
        results.skipped++;
        results.details.push({ title: article.title, status: 'skipped (duplicate)' });
      } else {
        results.errors++;
        results.details.push({ title: article.title, status: `error: ${result.error}` });
      }
    }

    console.log(`[Cron] ${category} import complete: ${results.imported} imported, ${results.skipped} skipped`);

    return NextResponse.json({
      success: true,
      message: `${category} import completed`,
      category,
      ...results,
    });
  } catch (error) {
    console.error(`[Cron] ${category} import failed:`, error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
