/**
 * Dynamic Page Builder Auto-Creation
 *
 * Automatically discovers and creates PageDefinitions based on database content.
 * No hardcoded list - purely database-driven.
 *
 * Template-ready: works for any user with any number of categories.
 */

import { prisma } from "./prisma"
import { PageType } from "@prisma/client"

interface DiscoveredPage {
  slug: string
  name: string
  pageType: PageType
  categoryId?: string
}

/**
 * Dynamically discover all pages that should exist based on database content
 */
export async function discoverAllPages(): Promise<DiscoveredPage[]> {
  const pages: DiscoveredPage[] = []

  // 1. Always include homepage
  pages.push({
    slug: "homepage",
    name: "Homepage",
    pageType: "HOMEPAGE"
  })

  // 2. Query all categories from database
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  })

  for (const category of categories) {
    pages.push({
      slug: category.slug,
      name: category.name,
      pageType: "CATEGORY",
      categoryId: category.id
    })
  }

  return pages
}

/**
 * Get pages that exist in DB but don't have PageDefinitions yet
 */
export async function getMissingPages(): Promise<DiscoveredPage[]> {
  const allPages = await discoverAllPages()
  const existingPages = await prisma.pageDefinition.findMany({
    select: { slug: true }
  })

  const existingSlugs = new Set(existingPages.map(p => p.slug))

  return allPages.filter(page => !existingSlugs.has(page.slug))
}

/**
 * Get count of existing PageDefinitions
 */
export async function getExistingPagesCount(): Promise<number> {
  return prisma.pageDefinition.count()
}

/**
 * Ensure a page exists - create if missing
 * Call this when a user visits a page to auto-create the PageDefinition
 */
export async function ensurePageExists(slug: string): Promise<void> {
  // Check if already exists
  const existing = await prisma.pageDefinition.findFirst({
    where: { slug }
  })

  if (existing) return

  // Check if this is a category page
  const category = await prisma.category.findUnique({
    where: { slug }
  })

  if (category) {
    await prisma.pageDefinition.create({
      data: {
        slug: category.slug,
        name: category.name,
        pageType: "CATEGORY",
        categoryId: category.id,
        isActive: true
      }
    })
    console.log(`[PageBuilder] Auto-created page: ${category.name} (/${category.slug})`)
    return
  }

  // Check if this is homepage
  if (slug === "homepage") {
    await prisma.pageDefinition.create({
      data: {
        slug: "homepage",
        name: "Homepage",
        pageType: "HOMEPAGE",
        isActive: true
      }
    })
    console.log(`[PageBuilder] Auto-created page: Homepage`)
  }
}

/**
 * Sync all missing pages - creates PageDefinitions for all discovered pages
 * Returns count of created pages
 */
export async function syncAllPages(): Promise<{ created: number; total: number; errors: string[] }> {
  const missingPages = await getMissingPages()
  const errors: string[] = []
  let created = 0

  for (const page of missingPages) {
    try {
      await prisma.pageDefinition.create({
        data: {
          slug: page.slug,
          name: page.name,
          pageType: page.pageType,
          categoryId: page.categoryId,
          isActive: true
        }
      })
      created++
      console.log(`[PageBuilder] Created: ${page.name} (/${page.slug})`)
    } catch (error) {
      const message = `Failed to create ${page.slug}: ${error}`
      errors.push(message)
      console.error(`[PageBuilder] ${message}`)
    }
  }

  const total = await discoverAllPages()

  return {
    created,
    total: total.length,
    errors
  }
}
