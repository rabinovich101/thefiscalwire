/**
 * Sync Pages Script
 *
 * This script automatically creates PageDefinitions for all known site pages.
 * Run this during deployment to ensure all pages exist in the database.
 *
 * Usage: npx tsx scripts/sync-pages.ts
 */

import { PrismaClient, PageType } from '@prisma/client'

const prisma = new PrismaClient()

// Page registry - all known pages in the application
interface PageEntry {
  slug: string
  name: string
  pageType: PageType
  categorySlug?: string
}

const PAGE_REGISTRY: PageEntry[] = [
  // Homepage
  { slug: "homepage", name: "Homepage", pageType: "HOMEPAGE" },

  // Category pages
  { slug: "crypto", name: "Crypto", pageType: "CATEGORY", categorySlug: "crypto" },
  { slug: "economy", name: "Economy", pageType: "CATEGORY", categorySlug: "economy" },
  { slug: "finance", name: "Finance", pageType: "CATEGORY", categorySlug: "finance" },
  { slug: "tech", name: "Tech", pageType: "CATEGORY", categorySlug: "tech" },
  { slug: "politics", name: "Politics", pageType: "CATEGORY", categorySlug: "politics" },
  { slug: "health-science", name: "Health & Science", pageType: "CATEGORY", categorySlug: "healthcare" },
  { slug: "real-estate", name: "Real Estate", pageType: "CATEGORY", categorySlug: "real-estate" },
  { slug: "transportation", name: "Transportation", pageType: "CATEGORY", categorySlug: "transportation" },
  { slug: "industrial", name: "Industrial", pageType: "CATEGORY", categorySlug: "industrial" },
  { slug: "sports", name: "Sports", pageType: "CATEGORY", categorySlug: "sports" },
  { slug: "consumption", name: "Consumption", pageType: "CATEGORY", categorySlug: "consumer" },
  { slug: "opinion", name: "Opinion", pageType: "CATEGORY", categorySlug: "opinion" },

  // Markets pages
  { slug: "markets", name: "Markets", pageType: "MARKETS" },
  { slug: "markets-bonds", name: "Bonds", pageType: "MARKETS" },
  { slug: "markets-forex", name: "Forex", pageType: "MARKETS" },
  { slug: "markets-etf", name: "ETF", pageType: "MARKETS" },
  { slug: "markets-asia", name: "Asia Markets", pageType: "MARKETS" },
  { slug: "markets-europe", name: "Europe Markets", pageType: "MARKETS" },

  // Stocks pages
  { slug: "stocks", name: "Stocks", pageType: "STOCK" },
  { slug: "stocks-gainers", name: "Top Gainers", pageType: "STOCK" },
  { slug: "stocks-losers", name: "Top Losers", pageType: "STOCK" },
  { slug: "stocks-trending", name: "Trending Stocks", pageType: "STOCK" },
  { slug: "stocks-active", name: "Most Active", pageType: "STOCK" },
  { slug: "stocks-heatmap", name: "Market Heatmap", pageType: "STOCK" },
  { slug: "stocks-sectors", name: "Sectors", pageType: "STOCK" },

  // Static pages
  { slug: "about", name: "About", pageType: "STATIC" },
  { slug: "contact", name: "Contact", pageType: "STATIC" },
  { slug: "privacy", name: "Privacy Policy", pageType: "STATIC" },
  { slug: "terms", name: "Terms of Service", pageType: "STATIC" },
]

async function syncPages() {
  console.log('🔄 Starting page sync...')

  let created = 0
  let skipped = 0
  let errors = 0

  for (const entry of PAGE_REGISTRY) {
    try {
      // Check if page already exists
      const existing = await prisma.pageDefinition.findFirst({
        where: { slug: entry.slug }
      })

      if (existing) {
        skipped++
        continue
      }

      // Find category ID if needed
      let categoryId: string | undefined
      if (entry.pageType === "CATEGORY" && entry.categorySlug) {
        const category = await prisma.category.findUnique({
          where: { slug: entry.categorySlug }
        })
        if (category) {
          categoryId = category.id
        }
      }

      // Create the page
      await prisma.pageDefinition.create({
        data: {
          name: entry.name,
          slug: entry.slug,
          pageType: entry.pageType,
          categoryId,
          isActive: true
        }
      })

      created++
      console.log(`  ✅ Created: ${entry.name} (/${entry.slug})`)

    } catch (error) {
      errors++
      console.error(`  ❌ Error creating ${entry.name}:`, error)
    }
  }

  console.log('')
  console.log('📊 Sync complete:')
  console.log(`   Created: ${created}`)
  console.log(`   Skipped: ${skipped} (already exist)`)
  console.log(`   Errors: ${errors}`)

  return { created, skipped, errors }
}

// Run the sync
syncPages()
  .then(() => {
    console.log('')
    console.log('✅ Page sync finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Page sync failed:', error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
