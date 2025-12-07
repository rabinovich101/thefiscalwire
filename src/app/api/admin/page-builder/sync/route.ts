import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { discoverAllPages, getMissingPages, getExistingPagesCount, syncAllPages } from "@/lib/page-builder-auto"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [discovered, missing, existingCount] = await Promise.all([
      discoverAllPages(),
      getMissingPages(),
      getExistingPagesCount()
    ])

    return NextResponse.json({
      discovered: discovered.length,
      existing: existingCount,
      missing: missing.length,
      missingPages: missing
    })
  } catch (error) {
    console.error("Sync preview error:", error)
    return NextResponse.json({ error: "Failed to get sync preview" }, { status: 500 })
  }
}

export async function POST() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await syncAllPages()
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Failed to sync pages" }, { status: 500 })
  }
}
