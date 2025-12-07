import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getMissingPages, syncAllPages, getExistingPages } from "@/lib/page-auto-create"
import { PAGE_REGISTRY } from "@/lib/page-registry"

// GET - Preview missing pages
export async function GET() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const missingPages = await getMissingPages()
    const existingSlugs = await getExistingPages()

    // Group by page type for better display
    const grouped = {
      HOMEPAGE: missingPages.filter(p => p.pageType === "HOMEPAGE"),
      CATEGORY: missingPages.filter(p => p.pageType === "CATEGORY"),
      MARKETS: missingPages.filter(p => p.pageType === "MARKETS"),
      STOCK: missingPages.filter(p => p.pageType === "STOCK"),
      STATIC: missingPages.filter(p => p.pageType === "STATIC"),
      CUSTOM: missingPages.filter(p => p.pageType === "CUSTOM"),
    }

    return NextResponse.json({
      totalInRegistry: PAGE_REGISTRY.length,
      existingCount: existingSlugs.length,
      missingCount: missingPages.length,
      missingPages,
      grouped,
    })
  } catch (error) {
    console.error("Sync preview error:", error)
    return NextResponse.json({ error: "Failed to get sync preview" }, { status: 500 })
  }
}

// POST - Create missing pages
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { pageSlugs } = body // Optional: array of specific slugs to sync

    const result = await syncAllPages(pageSlugs)

    return NextResponse.json({
      success: true,
      ...result,
      message: `Created ${result.created} pages${result.errors.length > 0 ? ` with ${result.errors.length} errors` : ""}`
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Failed to sync pages" }, { status: 500 })
  }
}
