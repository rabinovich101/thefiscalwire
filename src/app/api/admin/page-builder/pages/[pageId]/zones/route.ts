import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET zones for a page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { pageId } = await params

    const zones = await prisma.pageZone.findMany({
      where: { pageId },
      orderBy: { sortOrder: "asc" },
      include: {
        zoneDefinition: true,
        placements: {
          orderBy: { position: "asc" },
          include: {
            article: {
              select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                imageUrl: true,
                publishedAt: true,
                category: true,
              },
            },
            video: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                duration: true,
                category: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(zones)
  } catch (error) {
    console.error("Get zones error:", error)
    return NextResponse.json({ error: "Failed to get zones" }, { status: 500 })
  }
}

// POST add zone to page
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { pageId } = await params
    const body = await request.json()
    const { zoneDefinitionId, customName, isEnabled, sortOrder, autoFillRules } = body

    // Check if this zone definition is already on this page
    const existingZone = await prisma.pageZone.findFirst({
      where: {
        pageId,
        zoneDefinitionId,
      },
    })

    if (existingZone) {
      return NextResponse.json(
        { error: "This zone is already added to the page" },
        { status: 400 }
      )
    }

    // Get highest sortOrder if not provided
    let finalSortOrder = sortOrder
    if (finalSortOrder === undefined) {
      const lastZone = await prisma.pageZone.findFirst({
        where: { pageId },
        orderBy: { sortOrder: "desc" },
      })
      finalSortOrder = (lastZone?.sortOrder ?? -1) + 1
    }

    const zone = await prisma.pageZone.create({
      data: {
        pageId,
        zoneDefinitionId,
        customName: customName || null,
        isEnabled: isEnabled ?? true,
        sortOrder: finalSortOrder,
        autoFillRules: autoFillRules || null,
      },
      include: {
        zoneDefinition: true,
        placements: true,
      },
    })

    return NextResponse.json(zone)
  } catch (error) {
    console.error("Create zone error:", error)
    return NextResponse.json({ error: "Failed to create zone" }, { status: 500 })
  }
}
