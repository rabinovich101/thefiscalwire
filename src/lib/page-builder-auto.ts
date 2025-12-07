/**
 * Page Builder Auto-Discovery Service
 *
 * Automatically discovers and creates pages from database content.
 * Template-ready - if user adds 20 categories, system auto-creates 20 category pages.
 */

import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export interface DiscoveredPage {
  name: string
  slug: string
  pageType: "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM" | "STATIC" | "MARKETS"
  categoryId?: string
  categorySlug?: string
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
      categorySlug: category.slug,
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
 * Gets default zone definitions for a page type
 */
async function getDefaultZoneDefinitions() {
  // Get the zone definitions we want to use for category pages
  const zoneDefinitions = await prisma.zoneDefinition.findMany({
    where: {
      slug: {
        in: ["hero-featured", "article-grid", "trending-sidebar"],
      },
    },
  })
  return zoneDefinitions
}

/**
 * Creates zones with auto-fill rules for a page
 */
async function createZonesForPage(
  pageId: string,
  pageType: string,
  categoryId?: string,
  categorySlug?: string
) {
  const zoneDefinitions = await getDefaultZoneDefinitions()

  for (let i = 0; i < zoneDefinitions.length; i++) {
    const zoneDef = zoneDefinitions[i]

    // Build auto-fill rules based on page type
    let autoFillRules: Prisma.InputJsonObject | undefined = undefined
    if (pageType === "CATEGORY" && categorySlug) {
      // For category pages, filter by category
      autoFillRules = {
        source: "articles",
        filters: {
          categorySlug: categorySlug,
          categoryId: categoryId || "",
        },
        sort: "publishedAt",
        order: "desc",
        limit: zoneDef.maxItems,
      }
    } else if (pageType === "HOMEPAGE") {
      // For homepage, show latest articles
      autoFillRules = {
        source: "articles",
        sort: "publishedAt",
        order: "desc",
        limit: zoneDef.maxItems,
      }
    }

    await prisma.pageZone.create({
      data: {
        pageId,
        zoneDefinitionId: zoneDef.id,
        isEnabled: true,
        sortOrder: i + 1,
        autoFillRules: autoFillRules || Prisma.JsonNull,
      },
    })
  }
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
    // Create the page definition
    const createdPage = await prisma.pageDefinition.create({
      data: {
        name: page.name,
        slug: page.slug,
        pageType: page.pageType,
        categoryId: page.categoryId || null,
        stockSymbol: page.stockSymbol || null,
        isActive: true,
      },
    })

    // Create zones with auto-fill rules for this page
    await createZonesForPage(
      createdPage.id,
      page.pageType,
      page.categoryId,
      page.categorySlug
    )

    createdPages.push({ name: page.name, slug: page.slug })
  }

  return { created: createdPages.length, pages: createdPages }
}

/**
 * Gets pages without zones
 */
export async function getPagesWithoutZones() {
  return await prisma.pageDefinition.findMany({
    where: {
      zones: {
        none: {},
      },
    },
    include: {
      category: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
  })
}

/**
 * Syncs zones to existing pages that don't have zones
 */
export async function syncZonesToExistingPages(): Promise<{
  synced: number
  pages: { name: string; slug: string }[]
}> {
  const pagesWithoutZones = await getPagesWithoutZones()

  if (pagesWithoutZones.length === 0) {
    return { synced: 0, pages: [] }
  }

  const syncedPages: { name: string; slug: string }[] = []

  for (const page of pagesWithoutZones) {
    // Create zones with auto-fill rules for this page
    await createZonesForPage(
      page.id,
      page.pageType,
      page.categoryId || undefined,
      page.category?.slug
    )
    syncedPages.push({ name: page.name, slug: page.slug })
  }

  return { synced: syncedPages.length, pages: syncedPages }
}

/**
 * Gets sync status - counts of discovered, existing, and missing pages
 */
export async function getSyncStatus() {
  const discovered = await discoverAllPages()
  const existing = await getExistingPages()
  const existingSlugs = new Set(existing.map((p) => p.slug))
  const missing = discovered.filter((page) => !existingSlugs.has(page.slug))

  // Get pages without zones
  const pagesWithoutZones = await getPagesWithoutZones()

  return {
    discovered: discovered.length,
    existing: existing.length,
    missing: missing.length,
    missingPages: missing,
    pagesWithoutZones: pagesWithoutZones.length,
    pagesWithoutZonesList: pagesWithoutZones.map((p) => ({
      name: p.name,
      slug: p.slug,
    })),
  }
}
