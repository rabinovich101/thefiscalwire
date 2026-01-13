/**
 * Import Breaking News from FiscalWire API
 *
 * This script fetches articles from api.thefiscalwire.com and creates
 * local articles to populate the home page.
 *
 * Usage: npx tsx src/scripts/import-fiscalwire.ts
 */

import { PrismaClient } from "@prisma/client";
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
} from "../lib/fiscalwire";
import { selectArticleImage } from "../lib/article-images";

const prisma = new PrismaClient();

// Number of articles needed for each home page section
const ARTICLES_NEEDED = {
  hero: 4, // 1 featured + 3 secondary
  topStories: 6,
  trending: 8,
};

const TOTAL_ARTICLES_NEEDED =
  ARTICLES_NEEDED.hero + ARTICLES_NEEDED.topStories + ARTICLES_NEEDED.trending;

// Categories to fetch (breaking news style)
const BREAKING_CATEGORIES = ["earnings", "fda", "ma"];

async function main() {
  console.log("=".repeat(60));
  console.log("FiscalWire Article Import Script");
  console.log("=".repeat(60));
  console.log(`\nTarget: ${TOTAL_ARTICLES_NEEDED} articles for home page`);
  console.log(
    `  - Hero section: ${ARTICLES_NEEDED.hero} articles`
  );
  console.log(`  - Top Stories: ${ARTICLES_NEEDED.topStories} articles`);
  console.log(`  - Trending: ${ARTICLES_NEEDED.trending} articles`);
  console.log("");

  try {
    // Step 1: Get or create FiscalWire author
    console.log("[1/6] Setting up author...");
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
      console.log("  Created new author: FiscalWire");
    } else {
      console.log("  Using existing author: FiscalWire");
    }

    // Step 2: Get category IDs
    console.log("\n[2/6] Loading categories...");
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map((c) => [c.slug, c]));

    // Verify required categories exist
    const requiredCategories = [
      "us-markets",
      "finance",
      "health-science",
      "economy",
    ];
    for (const slug of requiredCategories) {
      if (!categoryMap.has(slug)) {
        throw new Error(`Required category "${slug}" not found in database`);
      }
    }
    console.log(`  Loaded ${categories.length} categories`);

    // Step 3: Fetch articles from FiscalWire API
    console.log("\n[3/6] Fetching articles from FiscalWire API...");

    // Date range: last 24 hours (today is 2026-01-12)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const afterDate = yesterday.toISOString();
    const beforeDate = now.toISOString();

    console.log(`  Date range: ${afterDate} to ${beforeDate}`);

    const allArticles: FiscalWireArticle[] = [];

    // Fetch from each breaking news category
    for (const category of BREAKING_CATEGORIES) {
      console.log(`  Fetching ${category} articles...`);
      try {
        const articles = await fetchNewsFromFiscalWire({
          category,
          after: afterDate,
          before: beforeDate,
          per_page: 50,
        });
        console.log(`    Found ${articles.length} ${category} articles`);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`    Error fetching ${category}:`, error);
      }
    }

    if (allArticles.length === 0) {
      console.log("\n  No articles found from API. Trying without date filter...");
      // Try without date filter as fallback
      for (const category of BREAKING_CATEGORIES) {
        try {
          const articles = await fetchNewsFromFiscalWire({
            category,
            per_page: 30,
          });
          console.log(`    Found ${articles.length} ${category} articles (no date filter)`);
          allArticles.push(...articles);
        } catch (error) {
          console.error(`    Error fetching ${category}:`, error);
        }
      }
    }

    console.log(`\n  Total articles fetched: ${allArticles.length}`);

    if (allArticles.length === 0) {
      throw new Error("No articles fetched from FiscalWire API");
    }

    // Sort by sentiment score (most impactful first)
    allArticles.sort(
      (a, b) =>
        Math.abs(b.sentiment_score || 0) - Math.abs(a.sentiment_score || 0)
    );

    // Take top N articles (plus buffer for duplicates)
    const articlesToImport = allArticles.slice(0, TOTAL_ARTICLES_NEEDED + 5);
    console.log(`  Selected top ${articlesToImport.length} articles by sentiment`);

    // Step 4: Unfeature existing articles
    console.log("\n[4/6] Unfeaturing existing articles...");
    const unfeaturedCount = await prisma.article.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });
    console.log(`  Unfeatured ${unfeaturedCount.count} articles`);

    const unbreakingCount = await prisma.article.updateMany({
      where: { isBreaking: true },
      data: { isBreaking: false },
    });
    console.log(`  Removed breaking status from ${unbreakingCount.count} articles`);

    // Step 5: Create new articles
    console.log("\n[5/6] Creating new articles...");
    let createdCount = 0;
    let skippedCount = 0;
    const createdArticles: { id: string; title: string }[] = [];

    for (let i = 0; i < articlesToImport.length; i++) {
      const fwArticle = articlesToImport[i];

      // Check if article already exists (by externalId)
      const existingByExternalId = await prisma.article.findFirst({
        where: { externalId: String(fwArticle.id) },
      });

      if (existingByExternalId) {
        console.log(`  Skipping duplicate: ${fwArticle.title.substring(0, 50)}...`);
        skippedCount++;
        continue;
      }

      // Generate unique slug
      let slug = generateSlug(fwArticle.title);
      const existingBySlug = await prisma.article.findUnique({
        where: { slug },
      });

      if (existingBySlug) {
        // Add timestamp to make unique
        slug = `${slug}-${Date.now()}`;
      }

      // Determine categories
      const marketsSlug = determineMarketsCategory(
        fwArticle.tickers,
        fwArticle.content
      );
      const businessSlug = mapFiscalWireCategory(fwArticle.category);

      const marketsCategory = categoryMap.get(marketsSlug);
      const businessCategory = categoryMap.get(businessSlug);

      if (!marketsCategory || !businessCategory) {
        console.log(
          `  Skipping - missing category: markets=${marketsSlug}, business=${businessSlug}`
        );
        skippedCount++;
        continue;
      }

      // Validate category types
      if (marketsCategory.type !== "MARKETS") {
        console.log(`  Skipping - ${marketsSlug} is not a MARKETS category`);
        skippedCount++;
        continue;
      }

      if (businessCategory.type !== "BUSINESS") {
        console.log(`  Skipping - ${businessSlug} is not a BUSINESS category`);
        skippedCount++;
        continue;
      }

      // Convert content to blocks
      const contentBlocks = convertToContentBlocks(
        fwArticle.content,
        fwArticle.ai_summary,
        fwArticle.summary
      );

      // Calculate read time
      const readTime = estimateReadTime(fwArticle.content || fwArticle.summary);

      // Determine sentiment and business type
      const { sentiment } = mapSentiment(
        fwArticle.sentiment_label,
        fwArticle.sentiment_score
      );
      const businessType = determineBusinessType(fwArticle.category);

      // Create the article
      try {
        // Determine if featured/breaking based on position
        const isFeatured = createdCount < ARTICLES_NEEDED.hero;
        const isBreaking = createdCount === 0; // First article is breaking

        const article = await prisma.article.create({
          data: {
            title: fwArticle.title,
            slug,
            excerpt:
              fwArticle.ai_summary ||
              fwArticle.summary ||
              fwArticle.title,
            content: contentBlocks,
            headings: [],
            imageUrl: fwArticle.image_url || selectArticleImage({
              category: fwArticle.category || undefined,
              businessType,
              marketsCategory: marketsSlug,
              sentiment,
              articleId: String(fwArticle.id),
            }),
            readTime,
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
              connect: [
                { id: marketsCategory.id },
                { id: businessCategory.id },
              ],
            },
          },
        });

        // Create article analysis
        await prisma.articleAnalysis.create({
          data: {
            articleId: article.id,
            markets: ["US"],
            primarySector: businessSlug,
            businessType,
            sentiment,
            aiModel: "fiscalwire",
          },
        });

        createdArticles.push({ id: article.id, title: fwArticle.title });
        createdCount++;

        const status = isBreaking
          ? "[BREAKING]"
          : isFeatured
          ? "[FEATURED]"
          : "";
        console.log(
          `  ${status} Created: ${fwArticle.title.substring(0, 50)}...`
        );

        // Stop if we have enough articles
        if (createdCount >= TOTAL_ARTICLES_NEEDED) {
          console.log(`\n  Reached target of ${TOTAL_ARTICLES_NEEDED} articles`);
          break;
        }
      } catch (error) {
        console.error(`  Error creating article:`, error);
        skippedCount++;
      }
    }

    // Step 6: Summary
    console.log("\n[6/6] Import Complete!");
    console.log("=".repeat(60));
    console.log(`  Articles created: ${createdCount}`);
    console.log(`  Articles skipped: ${skippedCount}`);
    console.log(`  Featured articles: ${Math.min(createdCount, ARTICLES_NEEDED.hero)}`);
    console.log(
      `  Breaking news: ${createdCount > 0 ? 1 : 0}`
    );
    console.log("=".repeat(60));

    if (createdCount < TOTAL_ARTICLES_NEEDED) {
      console.log(
        `\nWarning: Only created ${createdCount}/${TOTAL_ARTICLES_NEEDED} articles.`
      );
      console.log("Some home page sections may not be fully populated.");
    }

    console.log("\nNext steps:");
    console.log("  1. Start dev server: npm run dev");
    console.log("  2. Visit http://localhost:3000 to see the new articles");
    console.log("  3. Use Playwright to verify the home page");
  } catch (error) {
    console.error("\nImport failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
