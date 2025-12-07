/**
 * Page Builder Auto-Discovery Service
 *
 * Automatically discovers and creates pages from database content.
 * Template-ready - if user adds 20 categories, system auto-creates 20 category pages.
 */

import prisma from "@/lib/prisma"
import { Prisma, PrismaClient } from "@prisma/client"

// Required zone slugs - must exist in database
const REQUIRED_ZONE_SLUGS = ["hero-featured", "article-grid", "trending-sidebar"] as const

// Type for auto-fill rules
interface AutoFillRule {
  source: "articles" | "videos"
  filters?: {
    categorySlug?: string
    categoryId?: string
  }
  sort: "publishedAt" | "createdAt"
  order: "asc" | "desc"
  limit: number
}

export interface DiscoveredPage {
  name: string
  slug: string
  pageType: "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM" | "STATIC" | "MARKETS"
  categoryId?: string
  categorySlug?: string
  stockSymbol?: string
}

// Cache for zone definitions to avoid repeated queries
let cachedZoneDefinitions: Awaited<ReturnType<typeof fetchZoneDefinitions>> | null = null

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
      name: category.name,
      slug: category.slug,
      pageType: "CATEGORY",
      categoryId: category.id,
      categorySlug: category.slug,
    })
  }

  return pages
}

/**
 * Gets existing pages from the database with zone count
 */
async function getExistingPagesWithZoneCount() {
  return await prisma.pageDefinition.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      pageType: true,
      categoryId: true,
      stockSymbol: true,
      _count: { select: { zones: true } },
    },
  })
}

/**
 * Compares discovered pages with existing ones and returns missing pages
 */
export async function getMissingPages(): Promise<DiscoveredPage[]> {
  const discovered = await discoverAllPages()
  const existing = await getExistingPagesWithZoneCount()

  const existingSlugs = new Set(existing.map((p) => p.slug))

  return discovered.filter((page) => !existingSlugs.has(page.slug))
}

/**
 * Fetches zone definitions from database
 */
async function fetchZoneDefinitions() {
  const zoneDefinitions = await prisma.zoneDefinition.findMany({
    where: {
      slug: {
        in: [...REQUIRED_ZONE_SLUGS],
      },
    },
  })

  // Validate all required zones exist
  if (zoneDefinitions.length !== REQUIRED_ZONE_SLUGS.length) {
    const foundSlugs = new Set(zoneDefinitions.map((z) => z.slug))
    const missingSlugs = REQUIRED_ZONE_SLUGS.filter((s) => !foundSlugs.has(s))
    throw new Error(
      `Missing required zone definitions: ${missingSlugs.join(", ")}. Please seed the database.`
    )
  }

  return zoneDefinitions
}

/**
 * Gets zone definitions with caching
 */
async function getDefaultZoneDefinitions() {
  if (!cachedZoneDefinitions) {
    cachedZoneDefinitions = await fetchZoneDefinitions()
  }
  return cachedZoneDefinitions
}

/**
 * Builds auto-fill rules based on page type
 */
function buildAutoFillRules(
  pageType: string,
  categoryId?: string,
  categorySlug?: string,
  maxItems?: number
): AutoFillRule | null {
  if (pageType === "CATEGORY" && categorySlug) {
    return {
      source: "articles",
      filters: {
        categorySlug,
        categoryId: categoryId || "",
      },
      sort: "publishedAt",
      order: "desc",
      limit: maxItems || 10,
    }
  }

  if (pageType === "HOMEPAGE") {
    return {
      source: "articles",
      sort: "publishedAt",
      order: "desc",
      limit: maxItems || 10,
    }
  }

  return null
}

/**
 * Creates zones for a page using transaction client
 */
async function createZonesForPageTx(
  tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
  pageId: string,
  pageType: string,
  categoryId?: string,
  categorySlug?: string,
  zoneDefinitions?: Awaited<ReturnType<typeof getDefaultZoneDefinitions>>
) {
  const zoneDefs = zoneDefinitions || (await getDefaultZoneDefinitions())

  // Check for existing zones to avoid unique constraint violation
  const existingZones = await tx.pageZone.findMany({
    where: { pageId },
    select: { zoneDefinitionId: true },
  })
  const existingZoneDefIds = new Set(existingZones.map((z) => z.zoneDefinitionId))

  // Filter to only create missing zones
  const zonesToCreate = zoneDefs.filter((z) => !existingZoneDefIds.has(z.id))

  if (zonesToCreate.length === 0) {
    return
  }

  // Build zone data for batch insert
  const zoneData = zonesToCreate.map((zoneDef, i) => {
    const autoFillRules = buildAutoFillRules(pageType, categoryId, categorySlug, zoneDef.maxItems)

    return {
      pageId,
      zoneDefinitionId: zoneDef.id,
      isEnabled: true,
      sortOrder: existingZones.length + i + 1,
      autoFillRules: autoFillRules ? (autoFillRules as unknown as Prisma.InputJsonObject) : Prisma.JsonNull,
    }
  })

  // Use createMany for efficiency
  await tx.pageZone.createMany({ data: zoneData })
}

/**
 * Creates all missing pages in the database with transactions
 */
export async function syncAllPages(): Promise<{
  created: number
  pages: { name: string; slug: string }[]
}> {
  const missingPages = await getMissingPages()

  if (missingPages.length === 0) {
    return { created: 0, pages: [] }
  }

  // Pre-fetch zone definitions to avoid repeated queries
  const zoneDefinitions = await getDefaultZoneDefinitions()

  // Use transaction to ensure atomicity
  const createdPages = await prisma.$transaction(async (tx) => {
    const results: { name: string; slug: string }[] = []

    for (const page of missingPages) {
      // Create the page definition
      const createdPage = await tx.pageDefinition.create({
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
      await createZonesForPageTx(
        tx,
        createdPage.id,
        page.pageType,
        page.categoryId,
        page.categorySlug,
        zoneDefinitions
      )

      results.push({ name: page.name, slug: page.slug })
    }

    return results
  })

  return { created: createdPages.length, pages: createdPages }
}

/**
 * Syncs zones to existing pages that don't have all required zones
 */
export async function syncZonesToExistingPages(): Promise<{
  synced: number
  pages: { name: string; slug: string }[]
}> {
  // Find pages without all zones
  const pagesWithIncompleteZones = await prisma.pageDefinition.findMany({
    where: {
      OR: [
        { zones: { none: {} } },
        {
          zones: {
            none: {
              zoneDefinition: {
                slug: { in: [...REQUIRED_ZONE_SLUGS] },
              },
            },
          },
        },
      ],
    },
    include: {
      category: {
        select: {
          id: true,
          slug: true,
        },
      },
      zones: {
        select: { zoneDefinitionId: true },
      },
    },
  })

  // Filter to pages that are actually missing zones
  const zoneDefinitions = await getDefaultZoneDefinitions()
  const requiredZoneIds = new Set(zoneDefinitions.map((z) => z.id))

  const pagesNeedingZones = pagesWithIncompleteZones.filter((page) => {
    const pageZoneIds = new Set(page.zones.map((z) => z.zoneDefinitionId))
    return [...requiredZoneIds].some((id) => !pageZoneIds.has(id))
  })

  if (pagesNeedingZones.length === 0) {
    return { synced: 0, pages: [] }
  }

  // Use transaction for consistency
  const syncedPages = await prisma.$transaction(async (tx) => {
    const results: { name: string; slug: string }[] = []

    for (const page of pagesNeedingZones) {
      await createZonesForPageTx(
        tx,
        page.id,
        page.pageType,
        page.categoryId || undefined,
        page.category?.slug,
        zoneDefinitions
      )
      results.push({ name: page.name, slug: page.slug })
    }

    return results
  })

  return { synced: syncedPages.length, pages: syncedPages }
}

/**
 * Gets sync status - counts of discovered, existing, and missing pages
 * Optimized to use fewer queries
 */
export async function getSyncStatus() {
  // Fetch discovered pages and existing pages with zone count in parallel
  const [discovered, existingWithZoneInfo] = await Promise.all([
    discoverAllPages(),
    getExistingPagesWithZoneCount(),
  ])

  const existingSlugs = new Set(existingWithZoneInfo.map((p) => p.slug))
  const missing = discovered.filter((page) => !existingSlugs.has(page.slug))

  // Find pages without zones from existing query results
  const pagesWithoutZones = existingWithZoneInfo.filter((p) => p._count.zones === 0)

  return {
    discovered: discovered.length,
    existing: existingWithZoneInfo.length,
    missing: missing.length,
    missingPages: missing,
    pagesWithoutZones: pagesWithoutZones.length,
    pagesWithoutZonesList: pagesWithoutZones.map((p) => ({
      name: p.name,
      slug: p.slug,
    })),
  }
}
