/**
 * Deployment script: Auto-creates missing PageDefinitions
 * Runs on `npm start` before Next.js starts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface DiscoveredPage {
  name: string
  slug: string
  pageType: "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM"
  categoryId?: string
  stockSymbol?: string
}

async function discoverAllPages(): Promise<DiscoveredPage[]> {
  const pages: DiscoveredPage[] = []

  // Always need a homepage
  pages.push({
    name: "Homepage",
    slug: "homepage",
    pageType: "HOMEPAGE",
  })

  // Discover all categories from database
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  })

  for (const category of categories) {
    pages.push({
      name: `Category: ${category.name}`,
      slug: `category-${category.slug}`,
      pageType: "CATEGORY",
      categoryId: category.id,
    })
  }

  return pages
}

async function getExistingPages() {
  return prisma.pageDefinition.findMany({
    select: {
      id: true,
      slug: true,
      pageType: true,
      categoryId: true,
      stockSymbol: true,
    },
  })
}

async function getMissingPages(): Promise<DiscoveredPage[]> {
  const discovered = await discoverAllPages()
  const existing = await getExistingPages()

  const existingSet = new Set(
    existing.map((p) => {
      if (p.pageType === "HOMEPAGE") return "homepage"
      if (p.pageType === "CATEGORY" && p.categoryId) return `category-${p.categoryId}`
      if (p.pageType === "STOCK" && p.stockSymbol) return `stock-${p.stockSymbol}`
      return p.slug
    })
  )

  return discovered.filter((p) => {
    if (p.pageType === "HOMEPAGE") return !existingSet.has("homepage")
    if (p.pageType === "CATEGORY" && p.categoryId) return !existingSet.has(`category-${p.categoryId}`)
    if (p.pageType === "STOCK" && p.stockSymbol) return !existingSet.has(`stock-${p.stockSymbol}`)
    return !existingSet.has(p.slug)
  })
}

async function main() {
  console.log("[sync-pages] Starting page sync...")

  try {
    const missing = await getMissingPages()

    if (missing.length === 0) {
      console.log("[sync-pages] All pages are synced. No missing pages.")
      return
    }

    console.log(`[sync-pages] Found ${missing.length} missing pages. Creating...`)

    for (const page of missing) {
      await prisma.pageDefinition.create({
        data: {
          name: page.name,
          slug: page.slug,
          pageType: page.pageType,
          categoryId: page.categoryId || null,
          stockSymbol: page.stockSymbol || null,
          isActive: true,
        },
      })
      console.log(`[sync-pages] Created: ${page.name}`)
    }

    console.log(`[sync-pages] Successfully created ${missing.length} pages.`)
  } catch (error) {
    console.error("[sync-pages] Error:", error)
    // Don't exit with error - let the app start anyway
  } finally {
    await prisma.$disconnect()
  }
}

main()
