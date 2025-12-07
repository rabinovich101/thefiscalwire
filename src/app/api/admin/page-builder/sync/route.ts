import { NextResponse } from "next/server"
import { getSyncStatus, syncAllPages } from "@/lib/page-builder-auto"

// GET: Preview sync status
export async function GET() {
  try {
    const status = await getSyncStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Failed to get sync status:", error)
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 }
    )
  }
}

// POST: Execute sync - create missing pages
export async function POST() {
  try {
    const result = await syncAllPages()
    return NextResponse.json({
      success: true,
      created: result.created,
      pages: result.pages,
    })
  } catch (error) {
    console.error("Failed to sync pages:", error)
    return NextResponse.json(
      { error: "Failed to sync pages" },
      { status: 500 }
    )
  }
}
