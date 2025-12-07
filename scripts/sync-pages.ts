/**
 * Dynamic Page Sync Script - Run on deployment
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function syncPages() {
  console.log("[PageBuilder] Starting dynamic page sync...")

  const pages: Array<{ slug: string; name: string; pageType: "HOMEPAGE" | "CATEGORY"; categoryId?: string }> = []

  pages.push({ slug: "homepage", name: "Homepage", pageType: "HOMEPAGE" })

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  console.log(`[PageBuilder] Found ${categories.length} categories`)

  for (const cat of categories) {
    pages.push({ slug: cat.slug, name: cat.name, pageType: "CATEGORY", categoryId: cat.id })
  }

  const existing = await prisma.pageDefinition.findMany({ select: { slug: true } })
  const existingSlugs = new Set(existing.map(p => p.slug))

  let created = 0
  for (const page of pages) {
    if (existingSlugs.has(page.slug)) continue
    try {
      await prisma.pageDefinition.create({
        data: { slug: page.slug, name: page.name, pageType: page.pageType, categoryId: page.categoryId, isActive: true }
      })
      created++
      console.log(`  + Created: ${page.name} (/${page.slug})`)
    } catch (error) {
      console.error(`  ! Error: ${page.slug}`, error)
    }
  }

  console.log(`[PageBuilder] Done: ${created} created, ${pages.length - created} skipped`)
}

syncPages().then(() => process.exit(0)).catch(() => process.exit(1)).finally(() => prisma.$disconnect())
