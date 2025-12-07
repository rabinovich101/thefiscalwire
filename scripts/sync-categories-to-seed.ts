/**
 * Sync Categories to Seed Script
 *
 * This script syncs production categories to match seed.ts exactly (19 categories).
 *
 * It performs:
 * 1. Merges duplicate categories (articles moved to correct category)
 * 2. Creates missing categories from seed.ts
 * 3. Removes orphan categories that don't exist in seed.ts
 *
 * Usage: DATABASE_URL="your-production-url" npx tsx scripts/sync-categories-to-seed.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// The 19 categories from seed.ts - this is the source of truth
const SEED_CATEGORIES = [
  { name: 'US Markets', slug: 'us-markets', color: 'bg-blue-600' },
  { name: 'Europe Markets', slug: 'europe-markets', color: 'bg-blue-500' },
  { name: 'Asia Markets', slug: 'asia-markets', color: 'bg-blue-400' },
  { name: 'Forex', slug: 'forex', color: 'bg-cyan-600' },
  { name: 'Crypto', slug: 'crypto', color: 'bg-orange-500' },
  { name: 'Bonds', slug: 'bonds', color: 'bg-indigo-600' },
  { name: 'ETF', slug: 'etf', color: 'bg-teal-600' },
  { name: 'Economy', slug: 'economy', color: 'bg-green-600' },
  { name: 'Finance', slug: 'finance', color: 'bg-emerald-600' },
  { name: 'Health & Science', slug: 'health-science', color: 'bg-red-500' },
  { name: 'Real Estate', slug: 'real-estate', color: 'bg-amber-600' },
  { name: 'Media', slug: 'media', color: 'bg-pink-600' },
  { name: 'Transportation', slug: 'transportation', color: 'bg-slate-600' },
  { name: 'Industrial', slug: 'industrial', color: 'bg-zinc-600' },
  { name: 'Sports', slug: 'sports', color: 'bg-lime-600' },
  { name: 'Tech', slug: 'tech', color: 'bg-purple-600' },
  { name: 'Politics', slug: 'politics', color: 'bg-rose-600' },
  { name: 'Consumption', slug: 'consumption', color: 'bg-yellow-600' },
  { name: 'Opinion', slug: 'opinion', color: 'bg-gray-600' },
] as const

// Categories to merge: fromSlug -> toSlug
const CATEGORY_MERGES = [
  { fromSlug: 'technology', toSlug: 'tech', description: 'technology -> tech' },
  { fromSlug: 'healthcare', toSlug: 'health-science', description: 'healthcare -> health-science' },
  { fromSlug: 'consumer', toSlug: 'consumption', description: 'consumer -> consumption' },
  { fromSlug: 'european-markets', toSlug: 'europe-markets', description: 'european-markets -> europe-markets' },
  { fromSlug: 'asian-markets', toSlug: 'asia-markets', description: 'asian-markets -> asia-markets' },
  { fromSlug: 'crypto-markets', toSlug: 'crypto', description: 'crypto-markets -> crypto' },
]

async function showCurrentState() {
  console.log('\n=== CURRENT STATE ===')
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
      _count: { select: { articles: true } }
    },
    orderBy: { slug: 'asc' }
  })

  console.log(`Total categories: ${categories.length}`)
  for (const cat of categories) {
    console.log(`  ${cat.slug}: ${cat._count.articles} articles`)
  }
  return categories
}

async function mergeCategories() {
  console.log('\n=== MERGING CATEGORIES ===')

  for (const merge of CATEGORY_MERGES) {
    console.log(`\n--- ${merge.description} ---`)

    const [fromCategory, toCategory] = await Promise.all([
      prisma.category.findUnique({ where: { slug: merge.fromSlug } }),
      prisma.category.findUnique({ where: { slug: merge.toSlug } }),
    ])

    if (!fromCategory) {
      console.log(`  Source "${merge.fromSlug}" not found. Skipping.`)
      continue
    }

    // Create target category if it doesn't exist
    let targetCat = toCategory
    if (!targetCat) {
      const seedCat = SEED_CATEGORIES.find(c => c.slug === merge.toSlug)
      if (seedCat) {
        console.log(`  Creating target category "${merge.toSlug}"...`)
        targetCat = await prisma.category.create({
          data: { name: seedCat.name, slug: seedCat.slug, color: seedCat.color }
        })
      } else {
        console.log(`  Target "${merge.toSlug}" not in seed. Skipping.`)
        continue
      }
    }

    // Count articles to migrate
    const articlesInSource = await prisma.article.count({
      where: { categories: { some: { id: fromCategory.id } } }
    })
    console.log(`  Articles to migrate: ${articlesInSource}`)

    if (articlesInSource > 0) {
      // Get all articles from source category
      const articles = await prisma.article.findMany({
        where: { categories: { some: { id: fromCategory.id } } },
        select: { id: true }
      })

      // Process in batches
      const batchSize = 20
      for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize)
        await Promise.all(
          batch.map(article =>
            prisma.article.update({
              where: { id: article.id },
              data: {
                categories: {
                  connect: { id: targetCat!.id },
                  disconnect: { id: fromCategory.id }
                },
                // Also update legacy categoryId if it points to source
                categoryId: targetCat!.id
              }
            })
          )
        )
        console.log(`    Processed ${Math.min(i + batchSize, articles.length)}/${articles.length}`)
      }
    }

    // Delete the source category
    console.log(`  Deleting "${merge.fromSlug}"...`)
    await prisma.category.delete({ where: { id: fromCategory.id } })
    console.log(`  Done.`)
  }
}

async function createMissingCategories() {
  console.log('\n=== CREATING MISSING CATEGORIES ===')

  const existingSlugs = new Set(
    (await prisma.category.findMany({ select: { slug: true } })).map(c => c.slug)
  )

  for (const seedCat of SEED_CATEGORIES) {
    if (!existingSlugs.has(seedCat.slug)) {
      console.log(`  Creating "${seedCat.slug}"...`)
      await prisma.category.create({
        data: { name: seedCat.name, slug: seedCat.slug, color: seedCat.color }
      })
    }
  }

  console.log('  Done.')
}

async function removeOrphanCategories() {
  console.log('\n=== REMOVING ORPHAN CATEGORIES ===')

  const seedSlugs = new Set(SEED_CATEGORIES.map(c => c.slug))

  const allCategories = await prisma.category.findMany({
    select: {
      id: true,
      slug: true,
      _count: { select: { articles: true } }
    }
  })

  for (const cat of allCategories) {
    if (!seedSlugs.has(cat.slug)) {
      if (cat._count.articles === 0) {
        console.log(`  Deleting orphan "${cat.slug}" (0 articles)...`)
        await prisma.category.delete({ where: { id: cat.id } })
      } else {
        console.log(`  WARNING: "${cat.slug}" has ${cat._count.articles} articles but is not in seed.ts!`)
        console.log(`    Consider adding to CATEGORY_MERGES or SEED_CATEGORIES`)
      }
    }
  }

  console.log('  Done.')
}

async function syncPageBuilder() {
  console.log('\n=== SYNCING PAGE BUILDER ===')
  console.log('  Run "Sync Pages" in Admin > Page Builder to update pages.')
}

async function main() {
  console.log('='.repeat(60))
  console.log('SYNC CATEGORIES TO SEED.TS')
  console.log('='.repeat(60))
  console.log(`Expected: ${SEED_CATEGORIES.length} categories`)

  try {
    await showCurrentState()
    await mergeCategories()
    await createMissingCategories()
    await removeOrphanCategories()
    await showCurrentState()
    await syncPageBuilder()

    console.log('\n' + '='.repeat(60))
    console.log('SYNC COMPLETE')
    console.log('='.repeat(60))
  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
