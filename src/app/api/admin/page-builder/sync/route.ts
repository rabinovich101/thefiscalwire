import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import {
  getSyncStatus,
  syncAllPages,
  syncZonesToExistingPages,
  cleanupNonArticlePages,
  cleanupInvalidCategoryPages,
  fixZonesAutoFillRules,
  populateZonesWithArticles,
} from "@/lib/page-builder-auto"

// GET: Returns sync status (discovered/existing/missing counts)
export async function GET() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const status = await getSyncStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Get sync status error:", error)
    return NextResponse.json({ error: "Failed to get sync status" }, { status: 500 })
  }
}

// POST: Syncs page builder - creates missing pages, syncs zones, removes invalid pages
export async function POST() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Step 1: Remove pages that don't support articles (STATIC, MARKETS, STOCK)
    const cleanupResult = await cleanupNonArticlePages()

    // Step 2: Remove CATEGORY pages with invalid slugs (e.g., /technology when only /tech exists)
    const invalidCategoryCleanup = await cleanupInvalidCategoryPages()

    // Step 3: Create missing pages (this will also create zones for new pages)
    const pagesResult = await syncAllPages()

    // Step 4: Sync zones to existing pages that don't have zones
    const zonesResult = await syncZonesToExistingPages()

    // Step 5: Fix zones that have null auto-fill rules
    const fixRulesResult = await fixZonesAutoFillRules()

    // Step 6: Populate zones with initial articles based on auto-fill rules
    const populateResult = await populateZonesWithArticles()

    return NextResponse.json({
      // Non-article page cleanup results
      removed: cleanupResult.removed,
      removedPages: cleanupResult.pages,
      // Invalid category page cleanup results
      invalidCategoryRemoved: invalidCategoryCleanup.removed,
      invalidCategoryPages: invalidCategoryCleanup.pages,
      // Create results
      created: pagesResult.created,
      createdPages: pagesResult.pages,
      // Zone sync results
      zonesSynced: zonesResult.synced,
      pagesWithNewZones: zonesResult.pages,
      // Auto-fill rules fix results
      zonesFixed: fixRulesResult.fixed,
      fixedZones: fixRulesResult.zones,
      // Article population results
      articlesPopulated: populateResult.populated,
      populatedZones: populateResult.zones,
    })
  } catch (error) {
    console.error("Sync pages error:", error)
    return NextResponse.json({ error: "Failed to sync pages" }, { status: 500 })
  }
}
