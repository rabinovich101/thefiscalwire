import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET placements for a zone
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
            author: true,
          },
        },
        video: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            duration: true,
            category: true,
            url: true,
            embedType: true,
            videoId: true,
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

    return NextResponse.json(placements)
  } catch (error) {
    console.error("Get placements error:", error)
    return NextResponse.json({ error: "Failed to get placements" }, { status: 500 })
  }
}

// POST add placement to zone
export async function POST(
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
    const { contentType, articleId, videoId, customContent, position, isPinned, startDate, endDate } = body

    // Validate content type and reference
    if (contentType === "ARTICLE" && !articleId) {
      return NextResponse.json({ error: "Article ID required for article content type" }, { status: 400 })
    }
    if (contentType === "VIDEO" && !videoId) {
      return NextResponse.json({ error: "Video ID required for video content type" }, { status: 400 })
    }

    // Get highest position if not provided
    let finalPosition = position
    if (finalPosition === undefined) {
      const lastPlacement = await prisma.contentPlacement.findFirst({
        where: { zoneId },
        orderBy: { position: "desc" },
      })
      finalPosition = (lastPlacement?.position ?? -1) + 1
    }

    // Handle unique constraint - shift existing positions if needed
    const existingAtPosition = await prisma.contentPlacement.findFirst({
      where: { zoneId, position: finalPosition },
    })

    if (existingAtPosition) {
      // Shift all positions >= finalPosition up by 1
      await prisma.contentPlacement.updateMany({
        where: {
          zoneId,
          position: { gte: finalPosition },
        },
        data: {
          position: { increment: 1 },
        },
      })
    }

    const placement = await prisma.contentPlacement.create({
      data: {
        zoneId,
        contentType,
        articleId: contentType === "ARTICLE" ? articleId : null,
        videoId: contentType === "VIDEO" ? videoId : null,
        customContent: contentType === "CUSTOM" ? customContent : null,
        position: finalPosition,
        isPinned: isPinned ?? false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdById: session.user.id,
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
            url: true,
            embedType: true,
            videoId: true,
          },
        },
      },
    })

    return NextResponse.json(placement)
  } catch (error) {
    console.error("Create placement error:", error)
    return NextResponse.json({ error: "Failed to create placement" }, { status: 500 })
  }
}
