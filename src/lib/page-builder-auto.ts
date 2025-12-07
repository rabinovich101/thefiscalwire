/**
 * Dynamic Page Builder Auto-Creation
 * Automatically discovers and creates PageDefinitions based on database content.
 * No hardcoded list - purely database-driven.
 */

import { prisma } from "./prisma"
import { PageType } from "@prisma/client"

interface DiscoveredPage {
  slug: string
  name: string
  pageType: PageType
  categoryId?: string
}

export async function discoverAllPages(): Promise<DiscoveredPage[]> {
  const pages: DiscoveredPage[] = []

  // Always include homepage
  pages.push({ slug: "homepage", name: "Homepage", pageType: "HOMEPAGE" })

  // Query all categories from database
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
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

export async function getMissingPages(): Promise<DiscoveredPage[]> {
  const allPages = await discoverAllPages()
  const existingPages = await prisma.pageDefinition.findMany({ select: { slug: true } })
  const existingSlugs = new Set(existingPages.map(p => p.slug))
  return allPages.filter(page => !existingSlugs.has(page.slug))
}

export async function getExistingPagesCount(): Promise<number> {
  return prisma.pageDefinition.count()
}

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
    } catch (error) {
      errors.push(`Failed to create ${page.slug}: ${error}`)
    }
  }

  const total = await discoverAllPages()
  return { created, total: total.length, errors }
}
