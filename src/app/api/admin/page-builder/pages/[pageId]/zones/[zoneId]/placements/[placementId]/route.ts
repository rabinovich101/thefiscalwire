import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET single placement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string; zoneId: string; placementId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { placementId } = await params

    const placement = await prisma.contentPlacement.findUnique({
      where: { id: placementId },
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
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!placement) {
      return NextResponse.json({ error: "Placement not found" }, { status: 404 })
    }

    return NextResponse.json(placement)
  } catch (error) {
    console.error("Get placement error:", error)
    return NextResponse.json({ error: "Failed to get placement" }, { status: 500 })
  }
}

// PUT update placement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string; zoneId: string; placementId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { placementId } = await params
    const body = await request.json()
    const { isPinned, startDate, endDate, customContent } = body

    const placement = await prisma.contentPlacement.update({
      where: { id: placementId },
      data: {
        isPinned: isPinned !== undefined ? isPinned : undefined,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        customContent: customContent !== undefined ? customContent : undefined,
      },
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
    })

    return NextResponse.json(placement)
  } catch (error) {
    console.error("Update placement error:", error)
    return NextResponse.json({ error: "Failed to update placement" }, { status: 500 })
  }
}

// DELETE placement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string; zoneId: string; placementId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { placementId, zoneId } = await params

    // Get the placement to find its position
    const placement = await prisma.contentPlacement.findUnique({
      where: { id: placementId },
    })

    if (!placement) {
      return NextResponse.json({ error: "Placement not found" }, { status: 404 })
    }

    // Delete the placement
    await prisma.contentPlacement.delete({
      where: { id: placementId },
    })

    // Re-order remaining placements to close the gap
    await prisma.contentPlacement.updateMany({
      where: {
        zoneId,
        position: { gt: placement.position },
      },
      data: {
        position: { decrement: 1 },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete placement error:", error)
    return NextResponse.json({ error: "Failed to delete placement" }, { status: 500 })
  }
}
