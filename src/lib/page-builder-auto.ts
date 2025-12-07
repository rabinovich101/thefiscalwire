/**
 * Page Builder Auto-Discovery Service
 *
 * Automatically discovers and creates pages from database content.
 * Template-ready - if user adds 20 categories, system auto-creates 20 category pages.
 *
 * IMPORTANT: Only pages that can display articles are managed by the page builder.
 * The purpose of page builder is to control article display order/priority.
 */

import prisma from "@/lib/prisma"
import { Prisma, PrismaClient } from "@prisma/client"
import { resolveAutoFillRules, AutoFillConfig } from "@/lib/auto-fill"

// Required zone slugs - must exist in database
const REQUIRED_ZONE_SLUGS = ["hero-featured", "article-grid", "trending-sidebar"] as const

// Page types that support article content - only these belong in page builder
// Other page types (STATIC, MARKETS, STOCK) don't display articles
const ARTICLE_PAGE_TYPES = ["HOMEPAGE", "CATEGORY"] as const
type ArticlePageType = (typeof ARTICLE_PAGE_TYPES)[number]

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
  pageType: ArticlePageType
  categoryId?: string
  categorySlug?: string
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

  // Use transaction with extended timeout for remote databases
  const createdPages = await prisma.$transaction(
    async (tx) => {
      const results: { name: string; slug: string }[] = []

      for (const page of missingPages) {
        // Create the page definition
        const createdPage = await tx.pageDefinition.create({
          data: {
            name: page.name,
            slug: page.slug,
            pageType: page.pageType,
            categoryId: page.categoryId || null,
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
    },
    { timeout: 60000 } // 60 second timeout for bulk operations
  )

  return { created: createdPages.length, pages: createdPages }
}

/**
 * Fixes zones that have null auto-fill rules by setting proper rules based on page type
 */
export async function fixZonesAutoFillRules(): Promise<{
  fixed: number
  zones: { pageName: string; zoneName: string }[]
}> {
  // Find all zones on article-capable pages, then filter in JS for null/undefined autoFillRules
  const allZones = await prisma.pageZone.findMany({
    where: {
      page: {
        pageType: { in: [...ARTICLE_PAGE_TYPES] },
      },
    },
    include: {
      page: {
        select: {
          name: true,
          pageType: true,
          categoryId: true,
          category: { select: { slug: true } },
        },
      },
      zoneDefinition: {
        select: { name: true, maxItems: true },
      },
    },
  })

  // Filter in JavaScript for zones with null/undefined autoFillRules
  const zonesWithoutRules = allZones.filter(
    (z) => z.autoFillRules === null || z.autoFillRules === undefined
  )

  if (zonesWithoutRules.length === 0) {
    return { fixed: 0, zones: [] }
  }

  const results: { pageName: string; zoneName: string }[] = []

  // Update each zone with proper auto-fill rules
  await prisma.$transaction(
    async (tx) => {
      for (const zone of zonesWithoutRules) {
        const autoFillRules = buildAutoFillRules(
          zone.page.pageType,
          zone.page.categoryId || undefined,
          zone.page.category?.slug,
          zone.zoneDefinition?.maxItems
        )

        if (autoFillRules) {
          await tx.pageZone.update({
            where: { id: zone.id },
            data: {
              autoFillRules: autoFillRules as unknown as Prisma.InputJsonObject,
            },
          })

          results.push({
            pageName: zone.page.name,
            zoneName: zone.zoneDefinition?.name || "Unknown",
          })
        }
      }
    },
    { timeout: 60000 }
  )

  return { fixed: results.length, zones: results }
}

/**
 * Syncs zones to existing pages that don't have all required zones
 */
export async function syncZonesToExistingPages(): Promise<{
  synced: number
  pages: { name: string; slug: string }[]
}> {
  // Find pages without all zones (only article-capable pages)
  const pagesWithIncompleteZones = await prisma.pageDefinition.findMany({
    where: {
      pageType: { in: [...ARTICLE_PAGE_TYPES] },
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

  // Use transaction with extended timeout for remote databases
  const syncedPages = await prisma.$transaction(
    async (tx) => {
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
    },
    { timeout: 60000 }
  )

  return { synced: syncedPages.length, pages: syncedPages }
}

/**
 * Removes pages that don't support article content from page builder
 * These are pages like STATIC, MARKETS, STOCK that don't display articles
 */
export async function cleanupNonArticlePages(): Promise<{
  removed: number
  pages: { name: string; slug: string; pageType: string }[]
}> {
  // Find pages that are NOT article-capable
  const nonArticlePages = await prisma.pageDefinition.findMany({
    where: {
      pageType: { notIn: [...ARTICLE_PAGE_TYPES] },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      pageType: true,
    },
  })

  if (nonArticlePages.length === 0) {
    return { removed: 0, pages: [] }
  }

  // Batch delete - Prisma cascade will handle zones and placements automatically
  const pageIds = nonArticlePages.map((p) => p.id)
  await prisma.pageDefinition.deleteMany({
    where: { id: { in: pageIds } },
  })

  return {
    removed: nonArticlePages.length,
    pages: nonArticlePages.map((p) => ({
      name: p.name,
      slug: p.slug,
      pageType: p.pageType,
    })),
  }
}

/**
 * Removes CATEGORY pages that don't match any valid database category slug
 * This cleans up pages like /technology when only /tech exists as a category
 * Also removes pages like /crypto-markets when only /crypto exists
 */
export async function cleanupInvalidCategoryPages(): Promise<{
  removed: number
  pages: { name: string; slug: string; reason: string }[]
}> {
  // Get all valid category slugs and CATEGORY pages in parallel for better performance
  const [validCategories, categoryPages] = await Promise.all([
    prisma.category.findMany({
      select: { slug: true },
    }),
    prisma.pageDefinition.findMany({
      where: {
        pageType: "CATEGORY",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        category: {
          select: { slug: true },
        },
      },
    }),
  ])

  const validCategorySlugs = new Set(validCategories.map((c) => c.slug))

  // Find invalid pages:
  // 1. Pages where slug doesn't match any valid category slug
  // 2. Pages that have a categoryId but that category no longer exists (orphaned reference)
  const invalidPages = categoryPages.filter((page) => {
    const hasMatchingCategorySlug = validCategorySlugs.has(page.slug)
    const hasOrphanedCategoryReference = page.categoryId !== null && page.category === null

    return !hasMatchingCategorySlug || hasOrphanedCategoryReference
  })

  if (invalidPages.length === 0) {
    return { removed: 0, pages: [] }
  }

  // Log for debugging in production
  console.log(
    `[cleanupInvalidCategoryPages] Removing ${invalidPages.length} invalid pages:`,
    invalidPages.map((p) => ({ slug: p.slug, reason: !validCategorySlugs.has(p.slug) ? "no-matching-category" : "orphaned-reference" }))
  )

  // Delete invalid pages
  const pageIds = invalidPages.map((p) => p.id)
  await prisma.pageDefinition.deleteMany({
    where: { id: { in: pageIds } },
  })

  return {
    removed: invalidPages.length,
    pages: invalidPages.map((p) => ({
      name: p.name,
      slug: p.slug,
      reason: !validCategorySlugs.has(p.slug)
        ? `Slug "${p.slug}" doesn't match any database category`
        : `Linked category no longer exists`,
    })),
  }
}

/**
 * Populates zones with initial ContentPlacement records based on auto-fill rules
 * This creates actual placements so articles appear in the Page Builder admin UI
 */
export async function populateZonesWithArticles(): Promise<{
  populated: number
  zones: { pageName: string; zoneName: string; placementsCreated: number }[]
}> {
  // Find all enabled zones that have auto-fill rules configured on article pages
  const zones = await prisma.pageZone.findMany({
    where: {
      isEnabled: true,
      autoFillRules: { not: Prisma.JsonNull },
      page: {
        pageType: { in: [...ARTICLE_PAGE_TYPES] },
        isActive: true,
      },
    },
    include: {
      page: { select: { name: true, slug: true } },
      zoneDefinition: { select: { name: true, maxItems: true } },
      placements: { select: { articleId: true, position: true } },
    },
  })

  if (zones.length === 0) {
    return { populated: 0, zones: [] }
  }

  const results: { pageName: string; zoneName: string; placementsCreated: number }[] = []
  let totalPopulated = 0

  // Use transaction for data consistency
  await prisma.$transaction(
    async (tx) => {
      for (const zone of zones) {
        const autoFillRules = zone.autoFillRules as unknown as AutoFillConfig

        // Skip if rules are invalid or not for articles
        if (!autoFillRules || autoFillRules.source !== "articles") {
          continue
        }

        // Get IDs of articles already placed in this zone
        const existingArticleIds = new Set(
          zone.placements.filter((p) => p.articleId).map((p) => p.articleId!)
        )

        // Resolve auto-fill rules to get matching articles
        const resolvedArticles = await resolveAutoFillRules(autoFillRules)

        // Filter out articles already placed in this zone
        const newArticles = resolvedArticles.filter((article) => !existingArticleIds.has(article.id))

        if (newArticles.length === 0) {
          continue
        }

        // Calculate max items to add (respect zone maxItems)
        const maxItems = zone.zoneDefinition?.maxItems || 10
        const currentCount = zone.placements.length
        const remainingSlots = Math.max(0, maxItems - currentCount)
        const articlesToAdd = newArticles.slice(0, remainingSlots)

        if (articlesToAdd.length === 0) {
          continue
        }

        // Find the next available position
        const maxPosition = zone.placements.reduce((max, p) => Math.max(max, p.position), -1)

        // Create placement records
        const placementData = articlesToAdd.map((article, index) => ({
          zoneId: zone.id,
          contentType: "ARTICLE" as const,
          articleId: article.id,
          position: maxPosition + 1 + index,
          isPinned: false,
        }))

        await tx.contentPlacement.createMany({ data: placementData })

        results.push({
          pageName: zone.page.name,
          zoneName: zone.zoneDefinition?.name || "Unknown",
          placementsCreated: articlesToAdd.length,
        })
        totalPopulated += articlesToAdd.length
      }
    },
    { timeout: 60000 }
  )

  return { populated: totalPopulated, zones: results }
}

/**
 * Gets sync status - counts of discovered, existing, and missing pages
 * Optimized to use fewer queries
 */
export async function getSyncStatus() {
  // Fetch discovered pages, existing pages, and valid categories in parallel
  const [discovered, existingWithZoneInfo, validCategories] = await Promise.all([
    discoverAllPages(),
    getExistingPagesWithZoneCount(),
    prisma.category.findMany({ select: { slug: true } }),
  ])

  const existingSlugs = new Set(existingWithZoneInfo.map((p) => p.slug))
  const validCategorySlugs = new Set(validCategories.map((c) => c.slug))
  const missing = discovered.filter((page) => !existingSlugs.has(page.slug))

  // Filter to only article-capable pages
  const articlePages = existingWithZoneInfo.filter((p) =>
    ARTICLE_PAGE_TYPES.includes(p.pageType as ArticlePageType)
  )

  // Find non-article pages that will be removed
  const nonArticlePages = existingWithZoneInfo.filter(
    (p) => !ARTICLE_PAGE_TYPES.includes(p.pageType as ArticlePageType)
  )

  // Find CATEGORY pages with invalid slugs (don't match any database category)
  const invalidCategoryPages = articlePages.filter(
    (p) => p.pageType === "CATEGORY" && !validCategorySlugs.has(p.slug)
  )

  // Find pages without zones from article pages only
  const pagesWithoutZones = articlePages.filter((p) => p._count.zones === 0)

  return {
    discovered: discovered.length,
    existing: articlePages.length,
    missing: missing.length,
    missingPages: missing,
    pagesWithoutZones: pagesWithoutZones.length,
    pagesWithoutZonesList: pagesWithoutZones.map((p) => ({
      name: p.name,
      slug: p.slug,
    })),
    // Non-article pages that will be cleaned up
    nonArticlePages: nonArticlePages.length,
    nonArticlePagesList: nonArticlePages.map((p) => ({
      name: p.name,
      slug: p.slug,
      pageType: p.pageType,
    })),
    // Invalid category pages that will be cleaned up
    invalidCategoryPages: invalidCategoryPages.length,
    invalidCategoryPagesList: invalidCategoryPages.map((p) => ({
      name: p.name,
      slug: p.slug,
      reason: `Slug "${p.slug}" doesn't match any database category`,
    })),
  }
}
