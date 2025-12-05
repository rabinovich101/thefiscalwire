import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  fetchNewsByCategory,
  generateSlug,
  estimateReadTime,
  extractTickers,
  NewsDataArticle,
} from '@/lib/newsdata';
import {
  rewriteArticleWithPerplexity,
  convertRewrittenToBlocks,
  delay,
} from '@/lib/perplexity';
import { logImport, logNewsApiUsage, logPerplexityBatch, logError } from '@/lib/activityLogger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const CRON_SECRET = process.env.CRON_SECRET;

// Search queries for each category (using new category slugs)
const CATEGORY_QUERIES: Record<string, string> = {
  // Markets categories
  'us-markets': 'S&P 500 OR Dow Jones OR NASDAQ OR NYSE OR stock market OR Wall Street',
  'europe-markets': 'FTSE OR DAX OR Euro Stoxx OR European markets OR London Stock Exchange',
  'asia-markets': 'Nikkei OR Hang Seng OR Shanghai OR Asian markets OR Tokyo Stock Exchange',
  'forex': 'forex OR currency OR exchange rate OR USD OR EUR OR dollar OR yen',
  'crypto': 'bitcoin OR ethereum OR cryptocurrency OR crypto OR blockchain',
  'bonds': 'treasury OR bond yield OR fixed income OR government bonds OR corporate bonds',
  'etf': 'ETF OR exchange traded fund OR index fund OR Vanguard OR BlackRock',
  // Business categories
  'economy': 'economy OR inflation OR federal reserve OR GDP OR unemployment OR fiscal policy',
  'finance': 'banking OR financial services OR investment banking OR fintech OR payments',
  'health-science': 'healthcare OR biotech OR pharma OR FDA OR medical research OR clinical trial',
  'real-estate': 'real estate OR housing market OR mortgage rates OR commercial property OR REIT',
  'media': 'streaming OR entertainment OR Netflix OR Disney OR media company OR advertising',
  'transportation': 'airlines OR shipping OR logistics OR supply chain OR freight OR aviation',
  'industrial': 'manufacturing OR industrial production OR factory OR supply chain OR automation',
  'sports': 'sports business OR team valuation OR sports media OR athletic OR ESPN',
  'tech': 'technology OR AI OR semiconductor OR software OR cloud computing OR cybersecurity',
  'politics': 'economic policy OR regulation OR trade policy OR government OR legislation',
  'consumption': 'retail OR consumer spending OR e-commerce OR Amazon OR shopping',
  'opinion': 'market analysis OR stock forecast OR investment outlook OR expert opinion OR financial commentary',
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
      // Markets Section
      'us-markets': 'US Markets',
      'europe-markets': 'Europe Markets',
      'asia-markets': 'Asia Markets',
      'forex': 'Forex',
      'crypto': 'Crypto',
      'bonds': 'Bonds',
      'etf': 'ETF',
      // Business Section
      'economy': 'Economy',
      'finance': 'Finance',
      'health-science': 'Health & Science',
      'real-estate': 'Real Estate',
      'media': 'Media',
      'transportation': 'Transportation',
      'industrial': 'Industrial',
      'sports': 'Sports',
      'tech': 'Tech',
      'politics': 'Politics',
      'consumption': 'Consumption',
      'opinion': 'Opinion',
    };
    const categoryColors: Record<string, string> = {
      'us-markets': 'bg-blue-600',
      'europe-markets': 'bg-blue-500',
      'asia-markets': 'bg-blue-400',
      'forex': 'bg-cyan-600',
      'crypto': 'bg-orange-500',
      'bonds': 'bg-indigo-600',
      'etf': 'bg-teal-600',
      'economy': 'bg-green-600',
      'finance': 'bg-emerald-600',
      'health-science': 'bg-red-500',
      'real-estate': 'bg-amber-600',
      'media': 'bg-pink-600',
      'transportation': 'bg-slate-600',
      'industrial': 'bg-zinc-600',
      'sports': 'bg-lime-600',
      'tech': 'bg-purple-600',
      'politics': 'bg-rose-600',
      'consumption': 'bg-yellow-600',
      'opinion': 'bg-gray-600',
    };
    category = await prisma.category.create({
      data: {
        name: categoryNames[categorySlug] || categorySlug,
        slug: categorySlug,
        color: categoryColors[categorySlug] || 'bg-gray-600',
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
): Promise<{ success: boolean; articleId?: string; error?: string; aiEnhanced?: boolean }> {
  try {
    if (await articleExists(article.article_id)) {
      return { success: false, error: 'Already imported' };
    }

    // Try to rewrite with Perplexity AI
    let title = article.title;
    let excerpt = article.description || article.title;
    let contentBlocks: object[];
    let metaDescription: string | null = null;
    let seoKeywords: string[] = [];
    let isAiEnhanced = false;
    let allTagKeywords = article.keywords || [];

    console.log(`[Import] Processing ${targetCategory} article: "${article.title.substring(0, 50)}..."`);

    const rewritten = await rewriteArticleWithPerplexity(article.title, article.content);

    if (rewritten) {
      // Use AI-enhanced content
      title = rewritten.rewrittenTitle;
      excerpt = rewritten.excerpt;
      contentBlocks = convertRewrittenToBlocks(rewritten.rewrittenContent);
      metaDescription = rewritten.metaDescription;
      seoKeywords = rewritten.seoKeywords;
      isAiEnhanced = true;

      // Merge AI-suggested tags with original keywords
      allTagKeywords = [...new Set([...allTagKeywords, ...rewritten.suggestedTags])];

      console.log(`[Import] AI-enhanced ${targetCategory} article: "${title.substring(0, 50)}..."`);
    } else {
      // Fallback to original content
      console.log(`[Import] Using original content (AI enhancement failed)`);
      contentBlocks = [{ type: 'paragraph', content: article.description || article.title }];

      if (article.content) {
        const paragraphs = article.content.split(/\n\n+/);
        contentBlocks = paragraphs
          .map(p => p.trim())
          .filter(p => p.length > 0 && !p.toUpperCase().includes('ONLY AVAILABLE IN PAID PLANS'))
          .map(p => ({ type: 'paragraph', content: p }));
      }
    }

    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);
    const categoryId = await getCategoryId(targetCategory);
    const tagIds = await getOrCreateTags(allTagKeywords);
    const tickers = extractTickers(article.content, title);

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content: contentBlocks,
        imageUrl: article.image_url || '/images/placeholder-news.jpg',
        publishedAt: new Date(article.pubDate),
        readTime: estimateReadTime(article.content),
        isFeatured: false,
        isBreaking: false,
        externalId: article.article_id,
        sourceUrl: article.link,
        relevantTickers: tickers,
        metaDescription,
        seoKeywords,
        isAiEnhanced,
        authorId,
        categoryId,
        tags: {
          connect: tagIds.map(id => ({ id })),
        },
      },
    });

    return { success: true, articleId: newArticle.id, aiEnhanced: isAiEnhanced };
  } catch (error) {
    console.error(`[Import] Failed to import article ${article.article_id}:`, error);
    return { success: false, error: String(error) };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');
  const category = url.searchParams.get('category');

  const isAuthorized =
    authHeader === `Bearer ${CRON_SECRET}` ||
    secretParam === CRON_SECRET ||
    (process.env.NODE_ENV === 'development' && !CRON_SECRET);

  if (!isAuthorized && CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validCategories = Object.keys(CATEGORY_QUERIES);
  if (!category || !CATEGORY_QUERIES[category]) {
    return NextResponse.json(
      { error: `Invalid category. Valid categories: ${validCategories.join(', ')}` },
      { status: 400 }
    );
  }

  console.log(`[Cron] Starting ${category} news import...`);

  try {
    const author = await getOrCreateNewsDataAuthor();
    const articles = await fetchNewsByCategory(category, CATEGORY_QUERIES[category]);

    // Log NewsData API usage
    await logNewsApiUsage({
      endpoint: 'category',
      query: `${category}: ${CATEGORY_QUERIES[category]}`,
      resultsCount: articles.length,
      filteredCount: articles.length,
    });

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
      aiEnhanced: 0,
      details: [] as { title: string; status: string }[],
    };

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const result = await importArticle(article, author.id, category);

      if (result.success) {
        results.imported++;
        if (result.aiEnhanced) {
          results.aiEnhanced++;
        }
        results.details.push({
          title: article.title,
          status: result.aiEnhanced ? 'imported (AI-enhanced)' : 'imported',
        });
      } else if (result.error === 'Already imported') {
        results.skipped++;
        results.details.push({ title: article.title, status: 'skipped (duplicate)' });
      } else {
        results.errors++;
        results.details.push({ title: article.title, status: `error: ${result.error}` });
      }

      // Add delay between articles to avoid rate limiting (except for last article)
      if (i < articles.length - 1 && result.success) {
        await delay(2000); // 2 second delay between AI calls
      }
    }

    console.log(`[Cron] ${category} import complete: ${results.imported} imported (${results.aiEnhanced} AI-enhanced), ${results.skipped} skipped`);

    // Log import completion
    await logImport({
      source: 'NewsData.io',
      category,
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors,
      aiEnhanced: results.aiEnhanced,
      articles: results.details,
    });

    // Log Perplexity batch usage
    if (results.imported > 0) {
      await logPerplexityBatch({
        totalCalls: results.imported + results.errors,
        successfulCalls: results.aiEnhanced,
        failedCalls: results.imported - results.aiEnhanced + results.errors,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${category} import completed`,
      category,
      ...results,
    });
  } catch (error) {
    console.error(`[Cron] ${category} import failed:`, error);

    // Log error
    await logError(
      { source: 'import-category', operation: `${category} cron job execution` },
      String(error)
    );

    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
