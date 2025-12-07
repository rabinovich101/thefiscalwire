import { prisma } from "@/lib/prisma"
import { PageType } from "@prisma/client"
import { PAGE_REGISTRY, PageRegistryEntry, findPageBySlug } from "./page-registry"

// Default zone configurations for each page type
const DEFAULT_ZONES_BY_TYPE: Record<PageType, string[]> = {
  HOMEPAGE: ["hero-featured", "article-grid", "trending-sidebar", "video-carousel"],
  CATEGORY: ["article-grid", "trending-sidebar"],
  STOCK: ["article-grid", "trending-sidebar"],
  MARKETS: ["article-grid", "trending-sidebar"],
  STATIC: [], // Static pages typically don't need zones
  CUSTOM: [],
}

export interface SyncResult {
  created: number
  skipped: number
  errors: string[]
  createdPages: string[]
}

/**
 * Get all pages from registry that don't exist in the database
 */
export async function getMissingPages(): Promise<PageRegistryEntry[]> {
  const existingPages = await prisma.pageDefinition.findMany({
    select: { slug: true }
  })

  const existingSlugs = new Set(existingPages.map(p => p.slug))

  return PAGE_REGISTRY.filter(p => !existingSlugs.has(p.slug))
}

/**
 * Get all pages that exist in the database
 */
export async function getExistingPages(): Promise<string[]> {
  const pages = await prisma.pageDefinition.findMany({
    select: { slug: true }
  })
  return pages.map(p => p.slug)
}

/**
 * Create default zones for a page based on its type
 */
async function createDefaultZones(pageId: string, pageType: PageType): Promise<void> {
  const zoneTypes = DEFAULT_ZONES_BY_TYPE[pageType]

  if (zoneTypes.length === 0) return

  // Get zone definitions for the required types
  const zoneDefinitions = await prisma.zoneDefinition.findMany({
    where: {
      slug: { in: zoneTypes }
    }
  })

  // Create PageZone entries for each zone
  for (let i = 0; i < zoneDefinitions.length; i++) {
    const zoneDef = zoneDefinitions[i]
    await prisma.pageZone.create({
      data: {
        pageId,
        zoneDefinitionId: zoneDef.id,
        sortOrder: i,
        isEnabled: true
      }
    })
  }
}

/**
 * Create a single page definition from registry entry
 */
export async function createPageFromRegistry(
  entry: PageRegistryEntry,
  createZones: boolean = true
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find category ID if this is a category page
    let categoryId: string | undefined
    if (entry.pageType === "CATEGORY" && entry.categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: entry.categorySlug }
      })
      if (category) {
        categoryId = category.id
      }
    }

    // Create the page definition
    const page = await prisma.pageDefinition.create({
      data: {
        name: entry.name,
        slug: entry.slug,
        pageType: entry.pageType,
        categoryId,
        isActive: true
      }
    })

    // Create default zones if requested
    if (createZones) {
      await createDefaultZones(page.id, entry.pageType)
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Sync all missing pages from registry to database
 */
export async function syncAllPages(
  pageSlugs?: string[]  // Optional: only sync specific pages
): Promise<SyncResult> {
  const result: SyncResult = {
    created: 0,
    skipped: 0,
    errors: [],
    createdPages: []
  }

  // Get missing pages
  const missingPages = await getMissingPages()

  // Filter to specific slugs if provided
  const pagesToCreate = pageSlugs
    ? missingPages.filter(p => pageSlugs.includes(p.slug))
    : missingPages

  for (const entry of pagesToCreate) {
    const createResult = await createPageFromRegistry(entry)

    if (createResult.success) {
      result.created++
      result.createdPages.push(entry.name)
    } else {
      result.errors.push(`${entry.name}: ${createResult.error}`)
    }
  }

  result.skipped = PAGE_REGISTRY.length - missingPages.length

  return result
}

/**
 * Get or create a page definition by slug
 * Used for on-demand auto-creation when a page is visited
 */
export async function getOrCreatePageDefinition(slug: string) {
  // First try to find existing
  let page = await prisma.pageDefinition.findFirst({
    where: { slug },
    include: {
      zones: {
        include: {
          zoneDefinition: true,
          placements: {
            orderBy: { position: 'asc' }
          }
        },
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  if (page) return page

  // Try to find in registry
  const registryEntry = findPageBySlug(slug)
  if (!registryEntry) return null

  // Create the page
  const createResult = await createPageFromRegistry(registryEntry, true)
  if (!createResult.success) return null

  // Fetch and return the created page
  return prisma.pageDefinition.findFirst({
    where: { slug },
    include: {
      zones: {
        include: {
          zoneDefinition: true,
          placements: {
            orderBy: { position: 'asc' }
          }
        },
        orderBy: { sortOrder: 'asc' }
      }
    }
  })
}
