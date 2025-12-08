/**
 * Fix zone order: Put Article Grid before Trending Sidebar
 * Run with: npx tsx prisma/fix-zone-order.ts
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Fixing zone order: Article Grid will be first, Trending Sidebar second...\n')

  // Get zone definitions
  const articleGridDef = await prisma.zoneDefinition.findUnique({
    where: { slug: 'article-grid' }
  })

  const trendingSidebarDef = await prisma.zoneDefinition.findUnique({
    where: { slug: 'trending-sidebar' }
  })

  if (!articleGridDef || !trendingSidebarDef) {
    console.log('Zone definitions not found. Please run seed first.')
    return
  }

  // Find all page zones for these definitions
  const articleGridZones = await prisma.pageZone.findMany({
    where: { zoneDefinitionId: articleGridDef.id },
    include: { page: true }
  })

  const trendingSidebarZones = await prisma.pageZone.findMany({
    where: { zoneDefinitionId: trendingSidebarDef.id },
    include: { page: true }
  })

  console.log(`Found ${articleGridZones.length} Article Grid zones`)
  console.log(`Found ${trendingSidebarZones.length} Trending Sidebar zones\n`)

  // For each page, ensure article-grid has lower sortOrder than trending-sidebar
  for (const agZone of articleGridZones) {
    const tsZone = trendingSidebarZones.find(z => z.pageId === agZone.pageId)

    if (tsZone) {
      const pageName = agZone.page?.name || agZone.pageId

      // If trending sidebar has lower or equal sortOrder, swap them
      if (tsZone.sortOrder <= agZone.sortOrder) {
        console.log(`Page "${pageName}": Swapping order`)
        console.log(`  Before: Article Grid = ${agZone.sortOrder}, Trending Sidebar = ${tsZone.sortOrder}`)

        const newAgOrder = tsZone.sortOrder
        const newTsOrder = agZone.sortOrder

        await prisma.pageZone.update({
          where: { id: agZone.id },
          data: { sortOrder: newAgOrder }
        })

        await prisma.pageZone.update({
          where: { id: tsZone.id },
          data: { sortOrder: newTsOrder }
        })

        console.log(`  After:  Article Grid = ${newAgOrder}, Trending Sidebar = ${newTsOrder}`)
      } else {
        console.log(`Page "${pageName}": Already correct (Article Grid = ${agZone.sortOrder}, Trending Sidebar = ${tsZone.sortOrder})`)
      }
    }
  }

  console.log('\nDone!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
