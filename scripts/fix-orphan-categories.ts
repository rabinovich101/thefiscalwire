/**
 * Fix Orphan Categories Script
 * Moves articles from orphan categories to appropriate targets, then deletes orphans.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== FIXING ORPHAN CATEGORIES ===')

  // Get target categories
  const usMarkets = await prisma.category.findUnique({ where: { slug: 'us-markets' } })
  const economy = await prisma.category.findUnique({ where: { slug: 'economy' } })
  const industrial = await prisma.category.findUnique({ where: { slug: 'industrial' } })

  if (!usMarkets || !economy || !industrial) {
    console.error('Target categories not found!')
    return
  }

  // 1. Fix 'markets' -> 'us-markets'
  const markets = await prisma.category.findUnique({ where: { slug: 'markets' } })
  if (markets) {
    console.log('\n1. Moving markets -> us-markets')

    // Update articles with legacy categoryId
    const updated1 = await prisma.article.updateMany({
      where: { categoryId: markets.id },
      data: { categoryId: usMarkets.id }
    })
    console.log(`   Updated ${updated1.count} articles (legacy categoryId)`)

    // Move many-to-many articles
    const articlesInMarkets = await prisma.article.findMany({
      where: { categories: { some: { id: markets.id } } },
      select: { id: true }
    })
    for (const article of articlesInMarkets) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          categories: {
            connect: { id: usMarkets.id },
            disconnect: { id: markets.id }
          }
        }
      })
    }
    console.log(`   Moved ${articlesInMarkets.length} articles (many-to-many)`)

    // Delete markets category
    await prisma.category.delete({ where: { id: markets.id } })
    console.log('   Deleted markets category')
  } else {
    console.log('\n1. markets category not found (already removed)')
  }

  // 2. Fix 'commodities' -> 'economy'
  const commodities = await prisma.category.findUnique({ where: { slug: 'commodities' } })
  if (commodities) {
    console.log('\n2. Moving commodities -> economy')

    const updated2 = await prisma.article.updateMany({
      where: { categoryId: commodities.id },
      data: { categoryId: economy.id }
    })
    console.log(`   Updated ${updated2.count} articles (legacy categoryId)`)

    const articlesInCommodities = await prisma.article.findMany({
      where: { categories: { some: { id: commodities.id } } },
      select: { id: true }
    })
    for (const article of articlesInCommodities) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          categories: {
            connect: { id: economy.id },
            disconnect: { id: commodities.id }
          }
        }
      })
    }
    console.log(`   Moved ${articlesInCommodities.length} articles (many-to-many)`)

    await prisma.category.delete({ where: { id: commodities.id } })
    console.log('   Deleted commodities category')
  } else {
    console.log('\n2. commodities category not found (already removed)')
  }

  // 3. Fix 'energy' -> 'industrial'
  const energy = await prisma.category.findUnique({ where: { slug: 'energy' } })
  if (energy) {
    console.log('\n3. Moving energy -> industrial')

    const updated3 = await prisma.article.updateMany({
      where: { categoryId: energy.id },
      data: { categoryId: industrial.id }
    })
    console.log(`   Updated ${updated3.count} articles (legacy categoryId)`)

    const articlesInEnergy = await prisma.article.findMany({
      where: { categories: { some: { id: energy.id } } },
      select: { id: true }
    })
    for (const article of articlesInEnergy) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          categories: {
            connect: { id: industrial.id },
            disconnect: { id: energy.id }
          }
        }
      })
    }
    console.log(`   Moved ${articlesInEnergy.length} articles (many-to-many)`)

    await prisma.category.delete({ where: { id: energy.id } })
    console.log('   Deleted energy category')
  } else {
    console.log('\n3. energy category not found (already removed)')
  }

  // Show final state
  console.log('\n=== FINAL STATE ===')
  const categories = await prisma.category.findMany({
    select: { slug: true, _count: { select: { articles: true } } },
    orderBy: { slug: 'asc' }
  })
  console.log(`Total categories: ${categories.length}`)
  for (const cat of categories) {
    console.log(`  ${cat.slug}: ${cat._count.articles} articles`)
  }

  await prisma.$disconnect()
}

main()
