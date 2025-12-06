import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET single zone
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string; zoneId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { zoneId } = await params

    const zone = await prisma.pageZone.findUnique({
      where: { id: zoneId },
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

    if (!zone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 })
    }

    return NextResponse.json(zone)
  } catch (error) {
    console.error("Get zone error:", error)
    return NextResponse.json({ error: "Failed to get zone" }, { status: 500 })
  }
}

// PUT update zone
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string; zoneId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { zoneId } = await params
    const body = await request.json()
    const { customName, isEnabled, sortOrder, autoFillRules } = body

    const zone = await prisma.pageZone.update({
      where: { id: zoneId },
      data: {
        customName: customName !== undefined ? customName : undefined,
        isEnabled: isEnabled !== undefined ? isEnabled : undefined,
        sortOrder: sortOrder !== undefined ? sortOrder : undefined,
        autoFillRules: autoFillRules !== undefined ? autoFillRules : undefined,
      },
      include: {
        zoneDefinition: true,
        placements: {
          orderBy: { position: "asc" },
        },
      },
    })

    return NextResponse.json(zone)
  } catch (error) {
    console.error("Update zone error:", error)
    return NextResponse.json({ error: "Failed to update zone" }, { status: 500 })
  }
}

// DELETE zone
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string; zoneId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { zoneId } = await params

    await prisma.pageZone.delete({
      where: { id: zoneId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete zone error:", error)
    return NextResponse.json({ error: "Failed to delete zone" }, { status: 500 })
  }
}
