/**
 * This script creates a sample Page Builder configuration
 * Run with: npx tsx prisma/seed-page-builder.ts
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Setting up Page Builder...\n')

  // Step 1: Create Zone Definitions (the types of zones available)
  console.log('1. Creating zone definitions...')

  const zoneDefinitions = await Promise.all([
    prisma.zoneDefinition.upsert({
      where: { slug: 'hero-featured' },
      update: {},
      create: {
        slug: 'hero-featured',
        name: 'Hero Featured',
        description: 'Main featured article with secondary articles',
        zoneType: 'HERO_FEATURED',
        maxItems: 5,
      },
    }),
    prisma.zoneDefinition.upsert({
      where: { slug: 'article-grid' },
      update: {},
      create: {
        slug: 'article-grid',
        name: 'Article Grid',
        description: 'Grid of article cards',
        zoneType: 'ARTICLE_GRID',
        maxItems: 6,
      },
    }),
    prisma.zoneDefinition.upsert({
      where: { slug: 'trending-sidebar' },
      update: {},
      create: {
        slug: 'trending-sidebar',
        name: 'Trending Sidebar',
        description: 'Sidebar with trending articles',
        zoneType: 'TRENDING_SIDEBAR',
        maxItems: 8,
      },
    }),
    prisma.zoneDefinition.upsert({
      where: { slug: 'video-carousel' },
      update: {},
      create: {
        slug: 'video-carousel',
        name: 'Video Carousel',
        description: 'Horizontal carousel of videos',
        zoneType: 'VIDEO_CAROUSEL',
        maxItems: 10,
      },
    }),
    prisma.zoneDefinition.upsert({
      where: { slug: 'breaking-banner' },
      update: {},
      create: {
        slug: 'breaking-banner',
        name: 'Breaking News Banner',
        description: 'Top banner for breaking news',
        zoneType: 'BREAKING_BANNER',
        maxItems: 1,
      },
    }),
  ])

  console.log(`   Created ${zoneDefinitions.length} zone definitions`)

  // Step 2: Create Homepage Page Definition
  console.log('2. Creating homepage configuration...')

  const homepage = await prisma.pageDefinition.upsert({
    where: { slug: 'homepage' },
    update: { isActive: true },
    create: {
      slug: 'homepage',
      name: 'Homepage',
      pageType: 'HOMEPAGE',
      isActive: true,
    },
  })

  console.log(`   Created page: ${homepage.name}`)

  // Step 3: Add Zones to Homepage
  console.log('3. Adding zones to homepage...')

  // Delete existing zones first
  await prisma.pageZone.deleteMany({
    where: { pageId: homepage.id },
  })

  const zones = await Promise.all([
    prisma.pageZone.create({
      data: {
        pageId: homepage.id,
        zoneDefinitionId: zoneDefinitions[0].id, // hero-featured
        sortOrder: 1,
        isEnabled: true,
        // Auto-fill with latest 5 articles
        autoFillRules: {
          source: 'articles',
          sort: 'publishedAt',
          order: 'desc',
          limit: 5,
        },
      },
    }),
    prisma.pageZone.create({
      data: {
        pageId: homepage.id,
        zoneDefinitionId: zoneDefinitions[1].id, // article-grid
        sortOrder: 2,
        isEnabled: true,
        // Auto-fill with next 6 articles (skip first 5)
        autoFillRules: {
          source: 'articles',
          sort: 'publishedAt',
          order: 'desc',
          limit: 6,
          skip: 5,
        },
      },
    }),
    prisma.pageZone.create({
      data: {
        pageId: homepage.id,
        zoneDefinitionId: zoneDefinitions[2].id, // trending-sidebar
        sortOrder: 3,
        isEnabled: true,
        // Auto-fill with 8 articles
        autoFillRules: {
          source: 'articles',
          sort: 'publishedAt',
          order: 'desc',
          limit: 8,
        },
      },
    }),
    prisma.pageZone.create({
      data: {
        pageId: homepage.id,
        zoneDefinitionId: zoneDefinitions[3].id, // video-carousel
        sortOrder: 4,
        isEnabled: true,
        // Auto-fill with videos
        autoFillRules: {
          source: 'videos',
          sort: 'createdAt',
          order: 'desc',
          limit: 4,
        },
      },
    }),
  ])

  console.log(`   Added ${zones.length} zones to homepage`)

  // Step 4: Get some articles to manually place
  console.log('4. Adding manually placed articles...')

  const articles = await prisma.article.findMany({
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  if (articles.length > 0) {
    // Pin the first article to the hero zone
    await prisma.contentPlacement.create({
      data: {
        zoneId: zones[0].id,
        contentType: 'ARTICLE',
        articleId: articles[0].id,
        position: 0,
        isPinned: true, // This article will stay at the top!
      },
    })
    console.log(`   Pinned "${articles[0].title.substring(0, 40)}..." to hero zone`)
  }

  console.log('\n✅ Page Builder setup complete!')
  console.log('\nWhat was created:')
  console.log('   - 5 zone types (Hero, Grid, Sidebar, Video, Breaking)')
  console.log('   - 1 Homepage configuration')
  console.log('   - 4 zones with auto-fill rules')
  console.log('   - 1 pinned article in the hero zone')
  console.log('\nNow refresh your homepage to see the Page Builder in action!')
  console.log('Or go to /admin/page-builder to edit the configuration.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
