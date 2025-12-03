/**
 * Railway Cron Job - Import News
 * This script runs, imports news, then exits.
 *
 * Set cron schedule in Railway: 0 11 * * * (11:00 UTC = 13:00 Jerusalem)
 */

import { PrismaClient } from '@prisma/client';
import {
  fetchNewsFromNewsData,
  generateSlug,
  estimateReadTime,
  mapCategory,
  extractTickers,
  NewsDataArticle,
} from '../src/lib/newsdata';
import {
  rewriteArticleWithPerplexity,
  convertRewrittenToBlocks,
  delay,
} from '../src/lib/perplexity';

const prisma = new PrismaClient();

async function getOrCreateNewsDataAuthor() {
  const existingAuthor = await prisma.author.findFirst({
    where: { name: 'NewsData' },
  });
  if (existingAuthor) return existingAuthor;
  return prisma.author.create({
    data: {
      name: 'NewsData',
      bio: 'Automated news import from NewsData.io',
      avatar: '/images/newsdata-avatar.png',
    },
  });
}

async function getCategoryId(categorySlug: string): Promise<string> {
  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        slug: categorySlug,
        color: 'bg-blue-600',
      },
    });
  }
  return category.id;
}

async function getOrCreateTags(keywords: string[] | null): Promise<string[]> {
  if (!keywords?.length) return [];
  const tagIds: string[] = [];
  for (const keyword of keywords.slice(0, 5)) {
    const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    if (!slug) continue;
    let tag = await prisma.tag.findUnique({ where: { slug } });
    if (!tag) {
      tag = await prisma.tag.create({ data: { name: keyword, slug } });
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

async function importArticle(article: NewsDataArticle, authorId: string) {
  try {
    if (await articleExists(article.article_id)) {
      return { success: false, error: 'duplicate' };
    }

    let title = article.title;
    let excerpt = article.description || article.title;
    let contentBlocks: object[];
    let metaDescription: string | null = null;
    let seoKeywords: string[] = [];
    let isAiEnhanced = false;
    let allTagKeywords = article.keywords || [];

    console.log(`Processing: "${article.title.substring(0, 50)}..."`);

    const rewritten = await rewriteArticleWithPerplexity(article.title, article.content);
    if (rewritten) {
      title = rewritten.rewrittenTitle;
      excerpt = rewritten.excerpt;
      contentBlocks = convertRewrittenToBlocks(rewritten.rewrittenContent);
      metaDescription = rewritten.metaDescription;
      seoKeywords = rewritten.seoKeywords;
      isAiEnhanced = true;
      allTagKeywords = [...new Set([...allTagKeywords, ...rewritten.suggestedTags])];
    } else {
      contentBlocks = article.content
        ? article.content.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0).map(p => ({ type: 'paragraph', content: p }))
        : [{ type: 'paragraph', content: excerpt }];
    }

    const slug = await ensureUniqueSlug(generateSlug(title));
    const categoryId = await getCategoryId(mapCategory(article.category));
    const tagIds = await getOrCreateTags(allTagKeywords);

    await prisma.article.create({
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
        relevantTickers: extractTickers(article.content, title),
        metaDescription,
        seoKeywords,
        isAiEnhanced,
        authorId,
        categoryId,
        tags: { connect: tagIds.map(id => ({ id })) },
      },
    });

    return { success: true, aiEnhanced: isAiEnhanced };
  } catch (error) {
    console.error(`Failed:`, error);
    return { success: false, error: String(error) };
  }
}

async function main() {
  console.log(`[Cron] News import started at ${new Date().toISOString()}`);

  try {
    const author = await getOrCreateNewsDataAuthor();
    const articles = await fetchNewsFromNewsData();
    console.log(`[Cron] Found ${articles.length} articles`);

    let imported = 0, skipped = 0, errors = 0;

    for (let i = 0; i < articles.length; i++) {
      const result = await importArticle(articles[i], author.id);
      if (result.success) {
        imported++;
        console.log(`  ✓ Imported (${result.aiEnhanced ? 'AI' : 'original'})`);
      } else if (result.error === 'duplicate') {
        skipped++;
      } else {
        errors++;
      }
      if (i < articles.length - 1 && result.success) await delay(2000);
    }

    console.log(`[Cron] Done: ${imported} imported, ${skipped} skipped, ${errors} errors`);
  } catch (error) {
    console.error('[Cron] Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
