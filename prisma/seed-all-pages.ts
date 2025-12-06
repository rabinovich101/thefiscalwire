/**
 * This script creates Page Builder configurations for ALL existing pages
 * and places content that already exists on those pages.
 *
 * Run with: npx tsx prisma/seed-all-pages.ts
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up ALL Page Builder pages...\n')

  // Step 1: Get zone definitions
  console.log('1. Getting zone definitions...')
  const zoneDefinitions = await prisma.zoneDefinition.findMany()
  const heroZone = zoneDefinitions.find((z: any) => z.slug === 'hero-featured')
  const gridZone = zoneDefinitions.find((z: any) => z.slug === 'article-grid')
  const sidebarZone = zoneDefinitions.find((z: any) => z.slug === 'trending-sidebar')
  const videoZone = zoneDefinitions.find((z: any) => z.slug === 'video-carousel')

  if (!heroZone || !gridZone || !sidebarZone || !videoZone) {
    console.error('Missing zone definitions. Run seed-page-builder.ts first.')
    return
  }
  console.log(`   Found ${zoneDefinitions.length} zone definitions`)

  // Step 2: Get all categories with articles
  console.log('\n2. Getting categories with articles...')
  const categories = await prisma.category.findMany()

  // Get articles for each category directly (more reliable than _count)
  const categoriesWithArticles = []
  for (const category of categories) {
    const articles = await prisma.article.findMany({
      where: { categoryId: category.id },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    })
    if (articles.length > 0) {
      categoriesWithArticles.push({
        ...category,
        articles,
        _count: { articles: articles.length }
      })
    }
  }
  console.log(`   Found ${categoriesWithArticles.length} categories with articles`)

  // Step 3: Update Homepage with all content
  console.log('\n3. Updating Homepage configuration...')
  const homepage = await prisma.pageDefinition.findUnique({
    where: { slug: 'homepage' },
    include: { zones: true }
  })

  if (homepage) {
    // Get homepage zones
    const homepageHeroZone = homepage.zones.find((z: any) => z.zoneDefinitionId === heroZone.id)
    const homepageGridZone = homepage.zones.find((z: any) => z.zoneDefinitionId === gridZone.id)
    const homepageSidebarZone = homepage.zones.find((z: any) => z.zoneDefinitionId === sidebarZone.id)
    const homepageVideoZone = homepage.zones.find((z: any) => z.zoneDefinitionId === videoZone.id)

    // Get all articles sorted by date
    const allArticles = await prisma.article.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 17,
    })

    // Get all videos
    const allVideos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Clear existing placements for homepage zones
    for (const zone of homepage.zones) {
      await prisma.contentPlacement.deleteMany({
        where: { zoneId: zone.id }
      })
    }

    // Add articles to Hero Featured (first 5)
    if (homepageHeroZone && allArticles.length > 0) {
      const heroArticles = allArticles.slice(0, 5)
      for (let i = 0; i < heroArticles.length; i++) {
        await prisma.contentPlacement.create({
          data: {
            zoneId: homepageHeroZone.id,
            contentType: 'ARTICLE',
            articleId: heroArticles[i].id,
            position: i,
            isPinned: i === 0, // Pin the first article
          }
        })
      }
      console.log(`   Added ${heroArticles.length} articles to Hero Featured`)
    }

    // Add articles to Article Grid (next 6)
    if (homepageGridZone && allArticles.length > 5) {
      const gridArticles = allArticles.slice(5, 11)
      for (let i = 0; i < gridArticles.length; i++) {
        await prisma.contentPlacement.create({
          data: {
            zoneId: homepageGridZone.id,
            contentType: 'ARTICLE',
            articleId: gridArticles[i].id,
            position: i,
          }
        })
      }
      console.log(`   Added ${gridArticles.length} articles to Article Grid`)
    }

    // Add articles to Trending Sidebar (first 8)
    if (homepageSidebarZone && allArticles.length > 0) {
      const sidebarArticles = allArticles.slice(0, 8)
      for (let i = 0; i < sidebarArticles.length; i++) {
        await prisma.contentPlacement.create({
          data: {
            zoneId: homepageSidebarZone.id,
            contentType: 'ARTICLE',
            articleId: sidebarArticles[i].id,
            position: i,
          }
        })
      }
      console.log(`   Added ${sidebarArticles.length} articles to Trending Sidebar`)
    }

    // Add videos to Video Carousel
    if (homepageVideoZone && allVideos.length > 0) {
      for (let i = 0; i < allVideos.length; i++) {
        await prisma.contentPlacement.create({
          data: {
            zoneId: homepageVideoZone.id,
            contentType: 'VIDEO',
            videoId: allVideos[i].id,
            position: i,
          }
        })
      }
      console.log(`   Added ${allVideos.length} videos to Video Carousel`)
    }
  }

  // Step 4: Create category pages
  console.log('\n4. Creating category pages...')

  for (const category of categoriesWithArticles) {
    // Create or update page definition for this category
    const pageSlug = `category-${category.slug}`
    const page = await prisma.pageDefinition.upsert({
      where: { slug: pageSlug },
      update: {
        isActive: true,
        categoryId: category.id,
      },
      create: {
        slug: pageSlug,
        name: `Category: ${category.name}`,
        pageType: 'CATEGORY',
        isActive: true,
        categoryId: category.id,
      }
    })

    console.log(`   Created page: ${page.name}`)

    // Delete existing zones and recreate
    await prisma.pageZone.deleteMany({
      where: { pageId: page.id }
    })

    // Create zones for this category page
    const categoryHeroZone = await prisma.pageZone.create({
      data: {
        pageId: page.id,
        zoneDefinitionId: heroZone.id,
        sortOrder: 1,
        isEnabled: true,
      }
    })

    const categoryGridZone = await prisma.pageZone.create({
      data: {
        pageId: page.id,
        zoneDefinitionId: gridZone.id,
        sortOrder: 2,
        isEnabled: true,
      }
    })

    const categorySidebarZone = await prisma.pageZone.create({
      data: {
        pageId: page.id,
        zoneDefinitionId: sidebarZone.id,
        sortOrder: 3,
        isEnabled: true,
      }
    })

    // Add articles to zones
    const articles = category.articles

    // Hero Featured: first article (or up to 5 if available)
    const heroArticles = articles.slice(0, Math.min(5, articles.length))
    for (let i = 0; i < heroArticles.length; i++) {
      await prisma.contentPlacement.create({
        data: {
          zoneId: categoryHeroZone.id,
          contentType: 'ARTICLE',
          articleId: heroArticles[i].id,
          position: i,
          isPinned: i === 0,
        }
      })
    }

    // Article Grid: next 6 articles
    if (articles.length > 5) {
      const gridArticles = articles.slice(5, 11)
      for (let i = 0; i < gridArticles.length; i++) {
        await prisma.contentPlacement.create({
          data: {
            zoneId: categoryGridZone.id,
            contentType: 'ARTICLE',
            articleId: gridArticles[i].id,
            position: i,
          }
        })
      }
    }

    // Trending Sidebar: all articles in this category
    for (let i = 0; i < Math.min(8, articles.length); i++) {
      await prisma.contentPlacement.create({
        data: {
          zoneId: categorySidebarZone.id,
          contentType: 'ARTICLE',
          articleId: articles[i].id,
          position: i,
        }
      })
    }

    console.log(`      → Added ${heroArticles.length} hero, ${Math.max(0, articles.length - 5)} grid, ${Math.min(8, articles.length)} sidebar articles`)
  }

  // Step 5: Create a generic category template
  console.log('\n5. Creating category template (for categories without specific pages)...')
  const categoryTemplate = await prisma.pageDefinition.upsert({
    where: { slug: 'category-template' },
    update: { isActive: true },
    create: {
      slug: 'category-template',
      name: 'Category Template',
      pageType: 'CATEGORY',
      isActive: true,
    }
  })

  // Delete and recreate zones for template
  await prisma.pageZone.deleteMany({
    where: { pageId: categoryTemplate.id }
  })

  await prisma.pageZone.createMany({
    data: [
      {
        pageId: categoryTemplate.id,
        zoneDefinitionId: heroZone.id,
        sortOrder: 1,
        isEnabled: true,
        autoFillRules: {
          source: 'articles',
          sort: 'publishedAt',
          order: 'desc',
          limit: 5,
          filterByPageCategory: true,
        },
      },
      {
        pageId: categoryTemplate.id,
        zoneDefinitionId: gridZone.id,
        sortOrder: 2,
        isEnabled: true,
        autoFillRules: {
          source: 'articles',
          sort: 'publishedAt',
          order: 'desc',
          limit: 6,
          skip: 5,
          filterByPageCategory: true,
        },
      },
      {
        pageId: categoryTemplate.id,
        zoneDefinitionId: sidebarZone.id,
        sortOrder: 3,
        isEnabled: true,
        autoFillRules: {
          source: 'articles',
          sort: 'publishedAt',
          order: 'desc',
          limit: 8,
          filterByPageCategory: true,
        },
      },
    ]
  })

  console.log('   Created category template with auto-fill rules')

  // Summary
  console.log('\n✅ Page Builder setup complete!')
  console.log('\n📊 Summary:')

  const totalPages = await prisma.pageDefinition.count()
  const totalZones = await prisma.pageZone.count()
  const totalPlacements = await prisma.contentPlacement.count()

  console.log(`   - ${totalPages} pages configured`)
  console.log(`   - ${totalZones} zones created`)
  console.log(`   - ${totalPlacements} content placements`)

  console.log('\n📄 Pages created:')
  const allPages = await prisma.pageDefinition.findMany({
    include: { _count: { select: { zones: true } } }
  })
  allPages.forEach((p: any) => {
    console.log(`   - ${p.name} (/${p.slug}) - ${p._count.zones} zones`)
  })

  console.log('\nNow go to /admin/page-builder to see and edit all pages!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
