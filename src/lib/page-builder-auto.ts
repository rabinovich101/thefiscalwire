/**
 * Page Builder Auto-Discovery Service
 *
 * Automatically discovers and creates pages from database content.
 * Template-ready - if user adds 20 categories, system auto-creates 20 category pages.
 */

import prisma from "@/lib/prisma"

export interface DiscoveredPage {
  name: string
  slug: string
  pageType: "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM" | "STATIC" | "MARKETS"
  categoryId?: string
  stockSymbol?: string
}

/**
 * Discovers all pages that should exist based on database content
 */
export async function discoverAllPages(): Promise<DiscoveredPage[]> {
  const pages: DiscoveredPage[] = []

  // 1. Homepage - always needed
  pages.push({
    name: "Homepage",
    slug: "homepage",
    pageType: "HOMEPAGE",
  })

  // 2. Discover category pages from all categories in database
  const categories = await prisma.category.findMany({
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
 * Gets existing pages from the database
 */
export async function getExistingPages() {
  return await prisma.pageDefinition.findMany({
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
 * Compares discovered pages with existing ones and returns missing pages
 */
export async function getMissingPages(): Promise<DiscoveredPage[]> {
  const discovered = await discoverAllPages()
  const existing = await getExistingPages()

  const existingSlugs = new Set(existing.map((p) => p.slug))

  return discovered.filter((page) => !existingSlugs.has(page.slug))
}

/**
 * Creates all missing pages in the database
 */
export async function syncAllPages(): Promise<{
  created: number
  pages: { name: string; slug: string }[]
}> {
  const missingPages = await getMissingPages()

  if (missingPages.length === 0) {
    return { created: 0, pages: [] }
  }

  const createdPages: { name: string; slug: string }[] = []

  for (const page of missingPages) {
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
    createdPages.push({ name: page.name, slug: page.slug })
  }

  return { created: createdPages.length, pages: createdPages }
}

/**
 * Gets sync status - counts of discovered, existing, and missing pages
 */
export async function getSyncStatus() {
  const discovered = await discoverAllPages()
  const existing = await getExistingPages()
  const existingSlugs = new Set(existing.map((p) => p.slug))
  const missing = discovered.filter((page) => !existingSlugs.has(page.slug))

  return {
    discovered: discovered.length,
    existing: existing.length,
    missing: missing.length,
    missingPages: missing,
  }
}
