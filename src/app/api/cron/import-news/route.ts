import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  fetchNewsFromNewsData,
  generateSlug,
  estimateReadTime,
  mapCategory,
  extractTickers,
  NewsDataArticle,
} from '@/lib/newsdata';
import {
  rewriteArticleWithPerplexity,
  convertRewrittenToBlocks,
  delay,
} from '@/lib/perplexity';
import { logImport, logNewsApiUsage, logPerplexityBatch, logError } from '@/lib/activityLogger';

// Force dynamic - no caching for cron jobs
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Vercel Cron requires specific runtime
export const runtime = 'nodejs';

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Get author for an article - first try to match creator from NewsData,
 * otherwise pick a random author from DB
 */
async function getAuthorForArticle(
  creator: string[] | null,
  allAuthors: { id: string; name: string }[]
): Promise<string> {
  // If creator exists, try to find matching author in DB
  if (creator && creator.length > 0) {
    const creatorName = creator[0];
    const matchedAuthor = allAuthors.find(
      (a) => a.name.toLowerCase() === creatorName.toLowerCase()
    );
    if (matchedAuthor) {
      return matchedAuthor.id;
    }
  }

  // Pick a random author from DB
  const randomIndex = Math.floor(Math.random() * allAuthors.length);
  return allAuthors[randomIndex].id;
}

/**
 * Get category ID by slug, fallback to creating if not exists
 */
async function getCategoryId(categorySlug: string): Promise<string> {
  let category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    // Create the category if it doesn't exist
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

/**
 * Get or create tags from keywords
 */
async function getOrCreateTags(keywords: string[] | null): Promise<string[]> {
  if (!keywords || keywords.length === 0) {
    return [];
  }

  // Limit to first 5 keywords
  const limitedKeywords = keywords.slice(0, 5);
  const tagIds: string[] = [];

  for (const keyword of limitedKeywords) {
    const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    if (!slug) continue;

    let tag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: keyword,
          slug,
        },
      });
    }

    tagIds.push(tag.id);
  }

  return tagIds;
}

/**
 * Check if article already exists by externalId
 */
async function articleExists(externalId: string): Promise<boolean> {
  const existing = await prisma.article.findUnique({
    where: { externalId },
    select: { id: true },
  });
  return !!existing;
}

/**
 * Ensure slug is unique by appending counter if needed
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Import a single article from NewsData with AI enhancement
 */
async function importArticle(
  article: NewsDataArticle,
  authorId: string
): Promise<{ success: boolean; articleId?: string; error?: string; aiEnhanced?: boolean }> {
  try {
    // Check if already imported
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

    console.log(`[Import] Processing article: "${article.title.substring(0, 50)}..."`);

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

      console.log(`[Import] AI-enhanced article: "${title.substring(0, 50)}..."`);
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

    // Generate unique slug from the (possibly rewritten) title
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Map category
    const categorySlug = mapCategory(article.category);
    const categoryId = await getCategoryId(categorySlug);

    // Get or create tags (including AI-suggested tags)
    const tagIds = await getOrCreateTags(allTagKeywords);

    // Extract tickers from both original and rewritten content
    const tickers = extractTickers(article.content, title);

    // Create article with AI-enhanced fields
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

/**
 * Main import handler
 */
export async function GET(request: Request) {
  // Verify cron secret (for Vercel Cron)
  const authHeader = request.headers.get('authorization');
  const vercelCronHeader = request.headers.get('x-vercel-cron');
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');

  // Allow: Vercel Cron header, Authorization header, or secret query param
  const isAuthorized =
    vercelCronHeader === '1' || // Vercel Cron sets this header
    authHeader === `Bearer ${CRON_SECRET}` ||
    secretParam === CRON_SECRET ||
    // For local development without secret
    (process.env.NODE_ENV === 'development' && !CRON_SECRET);

  if (!isAuthorized && CRON_SECRET) {
    console.log('[Cron] Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[Cron] Starting news import...');

  try {
    // Get all authors for random assignment
    const authors = await prisma.author.findMany({
      where: { name: { not: 'NewsData' } },
    });

    if (authors.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No authors found in database' },
        { status: 500 }
      );
    }

    // Fetch news from NewsData.io
    const articles = await fetchNewsFromNewsData();

    // Log NewsData API usage
    await logNewsApiUsage({
      endpoint: 'latest',
      query: 'financial news',
      resultsCount: articles.length,
      filteredCount: articles.length,
    });

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new articles to import',
        imported: 0,
        skipped: 0,
      });
    }

    // Import each article
    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      aiEnhanced: 0,
      details: [] as { title: string; status: string }[],
    };

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      // Get author - try to match creator from NewsData, otherwise random
      const authorId = await getAuthorForArticle(article.creator, authors);
      const result = await importArticle(article, authorId);

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

    console.log(`[Cron] Import complete: ${results.imported} imported (${results.aiEnhanced} AI-enhanced), ${results.skipped} skipped, ${results.errors} errors`);

    // Log import completion
    await logImport({
      source: 'NewsData.io',
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
      message: 'Import completed',
      ...results,
    });
  } catch (error) {
    console.error('[Cron] Import failed:', error);

    // Log error
    await logError(
      { source: 'import-news', operation: 'cron job execution' },
      String(error)
    );

    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
