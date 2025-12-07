import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSyncStatus, syncAllPages } from "@/lib/page-builder-auto"

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

// POST: Creates all missing pages
export async function POST() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await syncAllPages()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Sync pages error:", error)
    return NextResponse.json({ error: "Failed to sync pages" }, { status: 500 })
  }
}
