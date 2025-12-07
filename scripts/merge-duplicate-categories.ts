/**
 * Merge Duplicate Categories Script
 *
 * This script merges duplicate categories in the production database:
 * 1. technology (88 articles) -> tech (1 article)
 * 2. crypto-markets (20 articles) -> crypto (0 articles)
 *
 * After merging, the duplicate categories are deleted.
 * Then run page builder sync to clean up orphaned pages.
 *
 * Usage: DATABASE_URL="your-production-url" npx tsx scripts/merge-duplicate-categories.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CategoryMerge {
  fromSlug: string
  toSlug: string
  description: string
}

const MERGES: CategoryMerge[] = [
  { fromSlug: 'technology', toSlug: 'tech', description: 'Technology -> Tech' },
  { fromSlug: 'crypto-markets', toSlug: 'crypto', description: 'Crypto Markets -> Crypto' },
]

async function mergeCategories() {
  console.log('='.repeat(60))
  console.log('MERGE DUPLICATE CATEGORIES')
  console.log('='.repeat(60))
  console.log('')

  for (const merge of MERGES) {
    console.log(`\n--- ${merge.description} ---`)

    // Get both categories
    const [fromCategory, toCategory] = await Promise.all([
      prisma.category.findUnique({ where: { slug: merge.fromSlug } }),
      prisma.category.findUnique({ where: { slug: merge.toSlug } }),
    ])

    if (!fromCategory) {
      console.log(`  Source category "${merge.fromSlug}" not found. Skipping.`)
      continue
    }

    if (!toCategory) {
      console.log(`  Target category "${merge.toSlug}" not found. Skipping.`)
      continue
    }

    console.log(`  From: ${fromCategory.name} (${fromCategory.slug}) - ID: ${fromCategory.id}`)
    console.log(`  To: ${toCategory.name} (${toCategory.slug}) - ID: ${toCategory.id}`)

    // Count articles in source category
    const articlesInSource = await prisma.article.count({
      where: {
        categories: {
          some: { id: fromCategory.id }
        }
      }
    })
    console.log(`  Articles to migrate: ${articlesInSource}`)

    if (articlesInSource === 0) {
      console.log(`  No articles to migrate.`)
    } else {
      // Get all articles from source category
      const articles = await prisma.article.findMany({
        where: {
          categories: {
            some: { id: fromCategory.id }
          }
        },
        select: { id: true, title: true }
      })

      console.log(`  Migrating ${articles.length} articles...`)

      // Use transaction with extended timeout for bulk operations
      await prisma.$transaction(async (tx) => {
        // Process in batches of 20 to avoid timeout
        const batchSize = 20
        for (let i = 0; i < articles.length; i += batchSize) {
          const batch = articles.slice(i, i + batchSize)
          await Promise.all(
            batch.map(article =>
              tx.article.update({
                where: { id: article.id },
                data: {
                  categories: {
                    connect: { id: toCategory.id },
                    disconnect: { id: fromCategory.id }
                  }
                }
              })
            )
          )
          console.log(`    Processed ${Math.min(i + batchSize, articles.length)}/${articles.length}`)
        }
      }, { timeout: 120000 }) // 2 minute timeout

      console.log(`  Migrated ${articles.length} articles successfully.`)
    }

    // Delete the source category
    console.log(`  Deleting source category "${merge.fromSlug}"...`)
    await prisma.category.delete({
      where: { id: fromCategory.id }
    })
    console.log(`  Deleted category "${merge.fromSlug}".`)
  }

  console.log('\n' + '='.repeat(60))
  console.log('CATEGORY MERGE COMPLETE')
  console.log('='.repeat(60))
  console.log('\nNext steps:')
  console.log('1. Go to Admin > Page Builder')
  console.log('2. Click "Sync Pages" to clean up orphaned pages')
  console.log('='.repeat(60))
}

async function main() {
  try {
    // First, show current state
    console.log('Current Categories:')
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        _count: { select: { articles: true } }
      },
      orderBy: { slug: 'asc' }
    })

    for (const cat of categories) {
      console.log(`  ${cat.slug}: ${cat._count.articles} articles`)
    }
    console.log('')

    // Perform the merge
    await mergeCategories()

    // Show final state
    console.log('\nFinal Categories:')
    const finalCategories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        _count: { select: { articles: true } }
      },
      orderBy: { slug: 'asc' }
    })

    for (const cat of finalCategories) {
      console.log(`  ${cat.slug}: ${cat._count.articles} articles`)
    }

  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
