/**
 * Migration script for dual-category system
 *
 * This script:
 * 1. Assigns CategoryType (MARKETS or BUSINESS) to all existing categories
 * 2. Populates marketsCategoryId and businessCategoryId for all existing articles
 */

import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

// Category slugs by type
const MARKETS_SLUGS = [
  'us-markets',
  'europe-markets',
  'asia-markets',
  'forex',
  'crypto',
  'bonds',
  'etf'
];

const BUSINESS_SLUGS = [
  'economy',
  'finance',
  'health-science',
  'real-estate',
  'media',
  'transportation',
  'industrial',
  'sports',
  'tech',
  'politics',
  'consumption',
  'opinion'
];

// Mapping from AI analysis sectors to business categories
const SECTOR_TO_BUSINESS: Record<string, string> = {
  'technology': 'tech',
  'healthcare': 'health-science',
  'financial': 'finance',
  'financial-services': 'finance',
  'consumer-discretionary': 'consumption',
  'consumer-staples': 'consumption',
  'industrial': 'industrial',
  'industrials': 'industrial',
  'energy': 'industrial',
  'utilities': 'industrial',
  'real-estate': 'real-estate',
  'materials': 'industrial',
  'basic-materials': 'industrial',
  'communication-services': 'media',
  'telecommunications': 'media',
};

// Mapping from AI analysis markets to markets categories
const MARKET_TO_CATEGORY: Record<string, string> = {
  'US': 'us-markets',
  'Europe': 'europe-markets',
  'Asia': 'asia-markets',
  'Crypto': 'crypto',
  'Forex': 'forex',
};

const DEFAULT_MARKETS_CATEGORY = 'us-markets';
const DEFAULT_BUSINESS_CATEGORY = 'economy';

async function main() {
  console.log('Starting dual-category migration...\n');

  // Step 1: Assign category types
  console.log('Step 1: Assigning category types...');

  // Get all categories
  const categories = await prisma.category.findMany();

  for (const category of categories) {
    let type: CategoryType;

    if (MARKETS_SLUGS.includes(category.slug)) {
      type = CategoryType.MARKETS;
    } else if (BUSINESS_SLUGS.includes(category.slug)) {
      type = CategoryType.BUSINESS;
    } else {
      console.log(`  Warning: Unknown category slug "${category.slug}", defaulting to BUSINESS`);
      type = CategoryType.BUSINESS;
    }

    await prisma.category.update({
      where: { id: category.id },
      data: { type }
    });

    console.log(`  ${category.name} (${category.slug}) -> ${type}`);
  }

  console.log(`\nAssigned types to ${categories.length} categories.\n`);

  // Build category lookup maps
  const categoryBySlug = new Map<string, { id: string; type: CategoryType | null }>();
  const updatedCategories = await prisma.category.findMany();
  for (const cat of updatedCategories) {
    categoryBySlug.set(cat.slug, { id: cat.id, type: cat.type });
  }

  // Step 2: Migrate articles
  console.log('Step 2: Migrating articles to dual-category system...');

  const articles = await prisma.article.findMany({
    include: {
      category: true,
      analysis: true,
    }
  });

  let migratedCount = 0;
  let skippedCount = 0;

  for (const article of articles) {
    // Skip if already migrated
    if (article.marketsCategoryId && article.businessCategoryId) {
      skippedCount++;
      continue;
    }

    let marketsCategoryId: string | null = null;
    let businessCategoryId: string | null = null;

    // Determine the type of the current primary category
    const currentCategoryType = article.category?.slug
      ? categoryBySlug.get(article.category.slug)?.type
      : null;

    if (currentCategoryType === CategoryType.MARKETS) {
      // Current category is markets, use it
      marketsCategoryId = article.categoryId;

      // Infer business category from AI analysis or default
      if (article.analysis?.primarySector) {
        const sector = article.analysis.primarySector.toLowerCase().replace(/ /g, '-');
        const businessSlug = SECTOR_TO_BUSINESS[sector] || DEFAULT_BUSINESS_CATEGORY;
        businessCategoryId = categoryBySlug.get(businessSlug)?.id || categoryBySlug.get(DEFAULT_BUSINESS_CATEGORY)?.id || null;
      } else {
        businessCategoryId = categoryBySlug.get(DEFAULT_BUSINESS_CATEGORY)?.id || null;
      }
    } else if (currentCategoryType === CategoryType.BUSINESS) {
      // Current category is business, use it
      businessCategoryId = article.categoryId;

      // Infer markets category from AI analysis or default
      if (article.analysis?.markets && article.analysis.markets.length > 0) {
        const primaryMarket = article.analysis.markets[0];
        const marketsSlug = MARKET_TO_CATEGORY[primaryMarket] || DEFAULT_MARKETS_CATEGORY;
        marketsCategoryId = categoryBySlug.get(marketsSlug)?.id || categoryBySlug.get(DEFAULT_MARKETS_CATEGORY)?.id || null;
      } else {
        marketsCategoryId = categoryBySlug.get(DEFAULT_MARKETS_CATEGORY)?.id || null;
      }
    } else {
      // Unknown or null category type, use defaults
      marketsCategoryId = categoryBySlug.get(DEFAULT_MARKETS_CATEGORY)?.id || null;
      businessCategoryId = categoryBySlug.get(DEFAULT_BUSINESS_CATEGORY)?.id || null;
    }

    // Update the article
    if (marketsCategoryId && businessCategoryId) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          marketsCategoryId,
          businessCategoryId,
          // Also update the categories many-to-many relation
          categories: {
            connect: [
              { id: marketsCategoryId },
              { id: businessCategoryId }
            ]
          }
        }
      });
      migratedCount++;
      console.log(`  Migrated: "${article.title.substring(0, 50)}..."`);
    } else {
      console.log(`  Warning: Could not migrate "${article.title}" - missing category IDs`);
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`  Migrated: ${migratedCount} articles`);
  console.log(`  Skipped (already migrated): ${skippedCount} articles`);

  // Step 3: Verify migration
  console.log('\nStep 3: Verifying migration...');

  const unmigrated = await prisma.article.count({
    where: {
      OR: [
        { marketsCategoryId: null },
        { businessCategoryId: null }
      ]
    }
  });

  if (unmigrated > 0) {
    console.log(`  Warning: ${unmigrated} articles still need migration!`);
  } else {
    console.log(`  All articles have been migrated successfully!`);
  }
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
