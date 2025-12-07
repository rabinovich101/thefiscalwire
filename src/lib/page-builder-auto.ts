import { prisma } from "./prisma"

interface DiscoveredPage {
  name: string
  slug: string
  pageType: "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM"
  categoryId?: string
  stockSymbol?: string
}

/**
 * Discovers all pages that should exist based on database content.
 * This is dynamic - queries the database to find all categories, etc.
 */
export async function discoverAllPages(): Promise<DiscoveredPage[]> {
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

/**
 * Gets existing PageDefinitions from database
 */
export async function getExistingPages() {
  return prisma.pageDefinition.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      pageType: true,
      categoryId: true,
      stockSymbol: true,
    },
  })
}

/**
 * Compares discovered pages with existing pages and returns missing ones
 */
export async function getMissingPages(): Promise<DiscoveredPage[]> {
  const discovered = await discoverAllPages()
  const existing = await getExistingPages()

  // Create a set of existing page identifiers
  const existingSet = new Set(
    existing.map((p) => {
      if (p.pageType === "HOMEPAGE") return "homepage"
      if (p.pageType === "CATEGORY" && p.categoryId) return `category-${p.categoryId}`
      if (p.pageType === "STOCK" && p.stockSymbol) return `stock-${p.stockSymbol}`
      return p.slug
    })
  )

  // Filter discovered pages to only missing ones
  return discovered.filter((p) => {
    if (p.pageType === "HOMEPAGE") return !existingSet.has("homepage")
    if (p.pageType === "CATEGORY" && p.categoryId) return !existingSet.has(`category-${p.categoryId}`)
    if (p.pageType === "STOCK" && p.stockSymbol) return !existingSet.has(`stock-${p.stockSymbol}`)
    return !existingSet.has(p.slug)
  })
}

/**
 * Creates all missing pages in the database
 */
export async function syncAllPages(): Promise<{ created: number; pages: string[] }> {
  const missing = await getMissingPages()

  if (missing.length === 0) {
    return { created: 0, pages: [] }
  }

  const createdPages: string[] = []

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
    createdPages.push(page.name)
  }

  return { created: createdPages.length, pages: createdPages }
}

/**
 * Gets sync status - discovered, existing, missing counts
 */
export async function getSyncStatus() {
  const discovered = await discoverAllPages()
  const existing = await getExistingPages()
  const missing = await getMissingPages()

  return {
    discovered: discovered.length,
    existing: existing.length,
    missing: missing.length,
    missingPages: missing,
  }
}
