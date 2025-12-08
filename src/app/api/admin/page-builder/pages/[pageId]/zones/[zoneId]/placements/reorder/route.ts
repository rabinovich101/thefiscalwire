import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// PUT reorder placements within a zone
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
    const { placementIds } = body as { placementIds: string[] }

    if (!Array.isArray(placementIds)) {
      return NextResponse.json(
        { error: "placementIds must be an array" },
        { status: 400 }
      )
    }

    // Update positions in a transaction
    // First set all positions to temporary high values to avoid unique constraint violations
    // Then set to final positions
    await prisma.$transaction(async (tx) => {
      // Step 1: Set all positions to temporary high values (offset by 10000)
      for (let i = 0; i < placementIds.length; i++) {
        await tx.contentPlacement.update({
          where: { id: placementIds[i] },
          data: { position: 10000 + i },
        })
      }
      // Step 2: Set final positions
      for (let i = 0; i < placementIds.length; i++) {
        await tx.contentPlacement.update({
          where: { id: placementIds[i] },
          data: { position: i },
        })
      }
    })

    // Return updated placements
    const placements = await prisma.contentPlacement.findMany({
      where: { zoneId },
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
    })

    return NextResponse.json(placements)
  } catch (error) {
    console.error("Reorder placements error:", error)
    return NextResponse.json({ error: "Failed to reorder placements" }, { status: 500 })
  }
}
