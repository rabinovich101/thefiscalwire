import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  fetchNewsFromFiscalWire,
  mapFiscalWireCategory,
  determineMarketsCategory,
  generateSlug,
  estimateReadTime,
  convertToContentBlocks,
  determineBusinessType,
  mapSentiment,
  FiscalWireArticle,
} from "@/lib/fiscalwire";
import { selectArticleImage } from "@/lib/article-images";

// POST /api/admin/import-fiscalwire
// Imports breaking news articles from FiscalWire API
export async function POST(request: NextRequest) {
  // Verify authentication - either admin session OR cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  const isAuthorizedByCron = authHeader === `Bearer ${cronSecret}` && cronSecret;

  if (!isAuthorizedByCron) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json().catch(() => ({}));
    const hoursBack = body.hoursBack || 24;
    const articlesToCreate = body.count || 18;
    const categories = body.categories || ["earnings", "fda", "ma"];

    console.log(`[FiscalWire Import] Starting import: ${articlesToCreate} articles from last ${hoursBack} hours`);

    // Step 1: Get or create FiscalWire author
    let author = await prisma.author.findFirst({
      where: { name: "FiscalWire" },
    });

    if (!author) {
      author = await prisma.author.create({
        data: {
          name: "FiscalWire",
          bio: "Financial news from FiscalWire API",
        },
      });
    }

    // Step 2: Get category IDs
    const categoryList = await prisma.category.findMany();
    const categoryMap = new Map(categoryList.map((c) => [c.slug, c]));

    // Step 3: Fetch articles from FiscalWire API
    const now = new Date();
    const startDate = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
    const afterDate = startDate.toISOString();
    const beforeDate = now.toISOString();

    const allArticles: FiscalWireArticle[] = [];

    for (const category of categories) {
      try {
        const articles = await fetchNewsFromFiscalWire({
          category,
          after: afterDate,
          before: beforeDate,
          per_page: 50,
        });
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
      }
    }

    // Fallback: if no articles found with date filter, try without
    if (allArticles.length === 0) {
      for (const category of categories) {
        try {
          const articles = await fetchNewsFromFiscalWire({
            category,
            per_page: 30,
          });
          allArticles.push(...articles);
        } catch (error) {
          console.error(`Error fetching ${category}:`, error);
        }
      }
    }

    if (allArticles.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No articles found from FiscalWire API",
      }, { status: 404 });
    }

    // Sort by sentiment score (most impactful first)
    allArticles.sort(
      (a, b) => Math.abs(b.sentiment_score || 0) - Math.abs(a.sentiment_score || 0)
    );

    // Step 4: Unfeature existing articles
    await prisma.article.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });

    await prisma.article.updateMany({
      where: { isBreaking: true },
      data: { isBreaking: false },
    });

    // Step 5: Deactivate old breaking news
    await prisma.breakingNews.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Step 6: Create new articles
    let createdCount = 0;
    const createdArticles: { id: string; title: string }[] = [];

    for (const fwArticle of allArticles.slice(0, articlesToCreate + 5)) {
      // Check if already exists
      const existing = await prisma.article.findFirst({
        where: { externalId: String(fwArticle.id) },
      });
      if (existing) continue;

      // Generate unique slug
      let slug = generateSlug(fwArticle.title);
      const existingBySlug = await prisma.article.findUnique({ where: { slug } });
      if (existingBySlug) slug = `${slug}-${Date.now()}`;

      // Get categories
      const marketsSlug = determineMarketsCategory(fwArticle.tickers, fwArticle.content);
      const businessSlug = mapFiscalWireCategory(fwArticle.category);
      const marketsCategory = categoryMap.get(marketsSlug);
      const businessCategory = categoryMap.get(businessSlug);

      if (!marketsCategory || !businessCategory) continue;
      if (marketsCategory.type !== "MARKETS" || businessCategory.type !== "BUSINESS") continue;

      const contentBlocks = convertToContentBlocks(
        fwArticle.content,
        fwArticle.ai_summary,
        fwArticle.summary
      );

      const isFeatured = createdCount < 4;
      const isBreaking = createdCount === 0;

      try {
        const article = await prisma.article.create({
          data: {
            title: fwArticle.title,
            slug,
            excerpt: fwArticle.ai_summary || fwArticle.summary || fwArticle.title,
            content: contentBlocks,
            headings: [],
            imageUrl: fwArticle.image_url || selectArticleImage({
              category: fwArticle.category || undefined,
              businessType: determineBusinessType(fwArticle.category),
              marketsCategory: marketsSlug,
              sentiment: mapSentiment(fwArticle.sentiment_label, fwArticle.sentiment_score).sentiment,
              articleId: String(fwArticle.id),
            }),
            readTime: estimateReadTime(fwArticle.content || fwArticle.summary),
            isFeatured,
            isBreaking,
            externalId: String(fwArticle.id),
            sourceUrl: fwArticle.source_url,
            relevantTickers: fwArticle.tickers || [],
            authorId: author.id,
            marketsCategoryId: marketsCategory.id,
            businessCategoryId: businessCategory.id,
            publishedAt: new Date(fwArticle.published_at),
            categories: {
              connect: [{ id: marketsCategory.id }, { id: businessCategory.id }],
            },
          },
        });

        // Create article analysis
        const { sentiment } = mapSentiment(fwArticle.sentiment_label, fwArticle.sentiment_score);
        await prisma.articleAnalysis.create({
          data: {
            articleId: article.id,
            markets: ["US"],
            primarySector: businessSlug,
            businessType: determineBusinessType(fwArticle.category),
            sentiment,
            aiModel: "fiscalwire",
          },
        });

        createdArticles.push({ id: article.id, title: fwArticle.title });
        createdCount++;

        // Create breaking news entry for the first article
        if (isBreaking) {
          await prisma.breakingNews.create({
            data: {
              isActive: true,
              headline: fwArticle.title,
              url: `/article/${slug}`,
            },
          });
        }

        if (createdCount >= articlesToCreate) break;
      } catch (error) {
        console.error("Error creating article:", error);
      }
    }

    // Step 7: Update page builder zones
    await updatePageBuilderZones(createdArticles.map(a => a.id));

    return NextResponse.json({
      success: true,
      message: `Imported ${createdCount} articles from FiscalWire`,
      articlesCreated: createdCount,
      articles: createdArticles.slice(0, 5).map(a => a.title.substring(0, 50) + "..."),
    });
  } catch (error) {
    console.error("[FiscalWire Import] Error:", error);
    return NextResponse.json({
      success: false,
      error: "Import failed: " + (error instanceof Error ? error.message : "Unknown error"),
    }, { status: 500 });
  }
}

// Helper to update page builder zones with new articles
async function updatePageBuilderZones(articleIds: string[]) {
  if (articleIds.length === 0) return;

  const zones = ["hero-featured", "article-grid", "trending-sidebar"];
  const zoneLimits = { "hero-featured": 4, "article-grid": 6, "trending-sidebar": 8 };

  let articleIndex = 0;

  for (const zoneSlug of zones) {
    const zone = await prisma.pageZone.findFirst({
      where: {
        zoneDefinition: { slug: zoneSlug },
        page: { slug: 'homepage' }
      },
    });

    if (!zone) continue;

    // Delete existing placements
    await prisma.contentPlacement.deleteMany({
      where: { zoneId: zone.id },
    });

    // Create new placements
    const limit = zoneLimits[zoneSlug as keyof typeof zoneLimits] || 4;
    for (let i = 0; i < limit && articleIndex < articleIds.length; i++) {
      await prisma.contentPlacement.create({
        data: {
          zoneId: zone.id,
          contentType: "ARTICLE",
          articleId: articleIds[articleIndex],
          position: i,
          isPinned: false,
        },
      });
      articleIndex++;
    }
  }
}

// GET endpoint to check status
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recentImports = await prisma.article.count({
    where: {
      author: { name: "FiscalWire" },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  return NextResponse.json({
    endpoint: "/api/admin/import-fiscalwire",
    method: "POST",
    description: "Import breaking news articles from FiscalWire API",
    recentImportsLast24h: recentImports,
    options: {
      hoursBack: "Number of hours to look back (default: 24)",
      count: "Number of articles to import (default: 18)",
      categories: "Array of categories: earnings, fda, ma, dividend, sec_filing",
    },
  });
}
