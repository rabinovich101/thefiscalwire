import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSyncStatus, syncAllPages, syncZonesToExistingPages } from "@/lib/page-builder-auto"

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

// POST: Creates all missing pages AND syncs zones to existing pages
export async function POST() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // First, create missing pages (this will also create zones for new pages)
    const pagesResult = await syncAllPages()

    // Then, sync zones to existing pages that don't have zones
    const zonesResult = await syncZonesToExistingPages()

    return NextResponse.json({
      created: pagesResult.created,
      pages: pagesResult.pages,
      zonesSynced: zonesResult.synced,
      pagesWithNewZones: zonesResult.pages,
    })
  } catch (error) {
    console.error("Sync pages error:", error)
    return NextResponse.json({ error: "Failed to sync pages" }, { status: 500 })
  }
}
