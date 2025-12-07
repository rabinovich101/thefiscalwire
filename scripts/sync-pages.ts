/**
 * Dynamic Page Sync Script
 *
 * Automatically discovers pages from database and creates PageDefinitions.
 * No hardcoded list - purely database-driven.
 *
 * Run on deployment: npx tsx scripts/sync-pages.ts
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function syncPages() {
  console.log("[PageBuilder] Starting dynamic page sync...")

  // 1. Discover all pages from database
  const pages: Array<{
    slug: string
    name: string
    pageType: "HOMEPAGE" | "CATEGORY"
    categoryId?: string
  }> = []

  // Always include homepage
  pages.push({
    slug: "homepage",
    name: "Homepage",
    pageType: "HOMEPAGE"
  })

  // Get all categories from database
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  })

  console.log(`[PageBuilder] Found ${categories.length} categories in database`)

  for (const category of categories) {
    pages.push({
      slug: category.slug,
      name: category.name,
      pageType: "CATEGORY",
      categoryId: category.id
    })
  }

  // 2. Get existing PageDefinitions
  const existingPages = await prisma.pageDefinition.findMany({
    select: { slug: true }
  })
  const existingSlugs = new Set(existingPages.map(p => p.slug))

  // 3. Create missing pages
  let created = 0
  let skipped = 0

  for (const page of pages) {
    if (existingSlugs.has(page.slug)) {
      skipped++
      continue
    }

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
      console.log(`  + Created: ${page.name} (/${page.slug})`)
    } catch (error) {
      console.error(`  ! Error creating ${page.slug}:`, error)
    }
  }

  console.log("")
  console.log("[PageBuilder] Sync complete:")
  console.log(`  Discovered: ${pages.length} pages`)
  console.log(`  Created: ${created}`)
  console.log(`  Skipped: ${skipped} (already exist)`)
}

syncPages()
  .then(() => {
    console.log("[PageBuilder] Sync finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("[PageBuilder] Sync failed:", error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
