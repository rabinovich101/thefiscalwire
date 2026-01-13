import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  fetchNewsFromFiscalWire,
  generateSlug,
  estimateReadTime,
  convertToContentBlocks,
  mapFiscalWireCategory,
  mapSentiment,
  determineMarketsCategory,
  determineBusinessType,
  FiscalWireArticle,
} from '@/lib/fiscalwire';
import { logImport, logError, logFiscalWireApiUsage } from '@/lib/activityLogger';
import { addArticleToPageBuilderZones } from '@/lib/page-builder-placement';

// Force dynamic - no caching for cron jobs
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Vercel Cron requires specific runtime
export const runtime = 'nodejs';

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Get random author from database
 */
async function getRandomAuthor(
  allAuthors: { id: string; name: string }[]
): Promise<string> {
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
    category = await prisma.category.create({
      data: {
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' '),
        slug: categorySlug,
        color: 'bg-blue-600',
      },
    });
  }

  return category.id;
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
 * Refresh homepage zones with new articles only
 * Clears existing placements and adds new articles in order
 */
async function refreshHomepageZones(articleIds: string[]) {
  if (articleIds.length === 0) return;

  const zones = ["hero-featured", "article-grid", "trending-sidebar"];
  const zoneLimits: Record<string, number> = {
    "hero-featured": 4,
    "article-grid": 6,
    "trending-sidebar": 8
  };

  let articleIndex = 0;

  for (const zoneSlug of zones) {
    const zone = await prisma.pageZone.findFirst({
      where: {
        zoneDefinition: { slug: zoneSlug },
        page: { slug: 'homepage' }
      }
    });
    if (!zone) {
      console.log(`[FiscalWire Import] Zone not found: ${zoneSlug}`);
      continue;
    }

    // Clear ALL existing placements for this zone
    await prisma.contentPlacement.deleteMany({
      where: { zoneId: zone.id }
    });

    // Add new articles up to zone limit
    const limit = zoneLimits[zoneSlug] || 4;
    for (let i = 0; i < limit && articleIndex < articleIds.length; i++) {
      await prisma.contentPlacement.create({
        data: {
          zoneId: zone.id,
          contentType: "ARTICLE",
          articleId: articleIds[articleIndex],
          position: i,
          isPinned: false,
        }
      });
      articleIndex++;
    }
    console.log(`[FiscalWire Import] Refreshed zone ${zoneSlug} with ${Math.min(limit, articleIds.length - (articleIndex - limit))} articles`);
  }
}

/**
 * Update breaking news banner with new article
 */
async function updateBreakingNews(slug: string, title: string) {
  // Deactivate all existing breaking news
  await prisma.breakingNews.updateMany({
    where: { isActive: true },
    data: { isActive: false }
  });

  // Create new breaking news entry
  await prisma.breakingNews.create({
    data: {
      isActive: true,
      headline: title,
      url: `/article/${slug}`
    }
  });
  console.log(`[FiscalWire Import] Updated breaking news: ${title.substring(0, 50)}...`);
}

/**
 * Import a single article from Fiscal Wire
 * Note: Fiscal Wire already provides AI summary and sentiment, so we skip Perplexity
 */
async function importArticle(
  article: FiscalWireArticle,
  authorId: string
): Promise<{ success: boolean; articleId?: string; error?: string }> {
  try {
    // Create unique external ID for Fiscal Wire articles
    const externalId = `fiscalwire-${article.id}`;

    // Check if already imported
    if (await articleExists(externalId)) {
      return { success: false, error: 'Already imported' };
    }

    console.log(`[FiscalWire Import] Processing article: "${article.title.substring(0, 50)}..."`);

    // Generate unique slug
    const baseSlug = generateSlug(article.title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Use AI summary as excerpt if available, fallback to summary
    const excerpt = article.ai_summary || article.summary || article.title;

    // Convert content to blocks
    const contentBlocks = convertToContentBlocks(
      article.content,
      article.ai_summary,
      article.summary
    );

    // Get sentiment from API (already analyzed!)
    const { sentiment, confidence } = mapSentiment(
      article.sentiment_label,
      article.sentiment_score
    );

    // Determine categories
    const businessCategorySlug = mapFiscalWireCategory(article.category);
    const marketsCategorySlug = determineMarketsCategory(
      article.tickers,
      article.content
    );

    const marketsCategoryId = await getCategoryId(marketsCategorySlug);
    const businessCategoryId = await getCategoryId(businessCategorySlug);

    // Get business type
    const businessType = determineBusinessType(article.category);

    console.log(`[FiscalWire Import] Categories: Markets=${marketsCategorySlug}, Business=${businessCategorySlug}, Sentiment=${sentiment}`);

    // Create article with analysis data from API
    const newArticle = await prisma.article.create({
      data: {
        title: article.title,
        slug,
        excerpt,
        content: contentBlocks,
        imageUrl: article.image_url || '/images/placeholder-news.jpg',
        publishedAt: new Date(article.published_at),
        readTime: estimateReadTime(article.content),
        isFeatured: false,
        isBreaking: false,
        externalId,
        sourceUrl: article.source_url,
        relevantTickers: article.tickers,
        metaDescription: article.ai_summary?.substring(0, 160) || null,
        seoKeywords: article.tickers,
        isAiEnhanced: !!article.ai_summary, // AI-enhanced if has AI summary
        authorId,
        // Dual category system
        marketsCategoryId,
        businessCategoryId,
        // Connect categories (many-to-many)
        categories: {
          connect: [{ id: marketsCategoryId }, { id: businessCategoryId }],
        },
        // Create analysis record with data from Fiscal Wire API
        analysis: {
          create: {
            markets: [marketsCategorySlug.includes('crypto') ? 'Crypto' : 'US'],
            primarySector: businessCategorySlug === 'health-science' ? 'healthcare' : 'financial',
            secondarySectors: [],
            subSectors: [],
            industries: [],
            primaryStock: article.tickers[0] || null,
            mentionedStocks: article.tickers,
            competitors: {},
            businessType,
            sentiment,
            impactLevel: 'medium',
            aiModel: 'fiscalwire', // Mark as from Fiscal Wire API
            confidence,
            rawResponse: {
              source: 'fiscalwire',
              sentimentScore: article.sentiment_score,
              sentimentLabel: article.sentiment_label,
              category: article.category,
            },
          },
        },
      },
    });

    // Add article to page builder zones (homepage + category pages)
    await addArticleToPageBuilderZones(newArticle.id, marketsCategoryId, businessCategoryId);

    return { success: true, articleId: newArticle.id };
  } catch (error) {
    console.error(`[FiscalWire Import] Failed to import article ${article.id}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Main import handler
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const vercelCronHeader = request.headers.get('x-vercel-cron');

  const isAuthorized =
    vercelCronHeader === '1' ||
    authHeader === `Bearer ${CRON_SECRET}` ||
    (process.env.NODE_ENV === 'development' && !CRON_SECRET);

  if (!isAuthorized && CRON_SECRET) {
    console.log('[FiscalWire Cron] Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[FiscalWire Cron] Starting news import...');

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

    // Fetch news from Fiscal Wire API
    // Get articles from last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const articles = await fetchNewsFromFiscalWire({
      after: yesterday.toISOString(),
      per_page: 50,
    });

    // Log API usage
    await logFiscalWireApiUsage({
      endpoint: '/api/v1/news',
      query: `after=${yesterday.toISOString()}`,
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

    // Import each article and track IDs
    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      aiEnhanced: 0,
      details: [] as { title: string; status: string }[],
    };
    const importedArticleIds: string[] = [];
    let firstImportedArticle: { slug: string; title: string } | null = null;

    for (const article of articles) {
      const authorId = await getRandomAuthor(authors);
      const result = await importArticle(article, authorId);

      if (result.success && result.articleId) {
        results.imported++;
        importedArticleIds.push(result.articleId);

        // Track first article for breaking news
        if (!firstImportedArticle) {
          firstImportedArticle = {
            slug: generateSlug(article.title),
            title: article.title
          };
        }

        if (article.ai_summary) {
          results.aiEnhanced++;
        }
        results.details.push({
          title: article.title,
          status: article.ai_summary ? 'imported (with AI summary)' : 'imported',
        });
      } else if (result.error === 'Already imported') {
        results.skipped++;
        results.details.push({ title: article.title, status: 'skipped (duplicate)' });
      } else {
        results.errors++;
        results.details.push({ title: article.title, status: `error: ${result.error}` });
      }
    }

    console.log(`[FiscalWire Cron] Import complete: ${results.imported} imported (${results.aiEnhanced} with AI summary), ${results.skipped} skipped, ${results.errors} errors`);

    // Refresh homepage zones with newly imported articles
    // If no new articles imported, use recent articles from database
    let articleIdsForZones = importedArticleIds;

    if (articleIdsForZones.length < 18) {
      // Fetch recent articles to fill zones (need 4+6+8=18 total)
      console.log(`[FiscalWire Cron] Fetching recent articles to fill homepage zones...`);
      const recentArticles = await prisma.article.findMany({
        orderBy: { publishedAt: 'desc' },
        take: 18,
        select: { id: true, slug: true, title: true }
      });
      articleIdsForZones = recentArticles.map(a => a.id);

      // Use first recent article for breaking news if no new imports
      if (!firstImportedArticle && recentArticles.length > 0) {
        firstImportedArticle = {
          slug: recentArticles[0].slug,
          title: recentArticles[0].title
        };
      }
    }

    if (articleIdsForZones.length > 0) {
      console.log(`[FiscalWire Cron] Refreshing homepage zones with ${articleIdsForZones.length} articles...`);
      await refreshHomepageZones(articleIdsForZones);

      // Update breaking news banner
      if (firstImportedArticle) {
        await updateBreakingNews(firstImportedArticle.slug, firstImportedArticle.title);
      }
    }

    // Log import completion
    await logImport({
      source: 'FiscalWire',
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors,
      aiEnhanced: results.aiEnhanced,
      articles: results.details,
    });

    return NextResponse.json({
      success: true,
      message: 'Import completed',
      ...results,
    });
  } catch (error) {
    console.error('[FiscalWire Cron] Import failed:', error);

    await logError(
      { source: 'import-fiscalwire', operation: 'cron job execution' },
      String(error)
    );

    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
