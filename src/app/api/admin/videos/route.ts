import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Helper to extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Helper to extract Vimeo video ID
function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

// Detect embed type from URL
function detectEmbedType(url: string): { type: string; videoId: string } | null {
  const youtubeId = extractYouTubeId(url)
  if (youtubeId) {
    return { type: "youtube", videoId: youtubeId }
  }

  const vimeoId = extractVimeoId(url)
  if (vimeoId) {
    return { type: "vimeo", videoId: vimeoId }
  }

  return null
}

// Generate thumbnail URL based on embed type
function getThumbnailUrl(embedType: string, videoId: string): string {
  switch (embedType) {
    case "youtube":
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    case "vimeo":
      // Vimeo thumbnails require an API call, use a placeholder
      return `https://vumbnail.com/${videoId}.jpg`
    default:
      return ""
  }
}

// GET - List all videos
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.video.count()

    return NextResponse.json({ videos, total })
  } catch (error) {
    console.error("Failed to fetch videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

// POST - Create new video from URL
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { url, title, category = "General" } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Detect embed type and extract video ID
    const embedInfo = detectEmbedType(url)
    if (!embedInfo) {
      return NextResponse.json(
        { error: "Unsupported video URL. Please use YouTube or Vimeo." },
        { status: 400 }
      )
    }

    const { type: embedType, videoId } = embedInfo

    // Generate thumbnail
    const thumbnail = getThumbnailUrl(embedType, videoId)

    // Create video in database
    const video = await prisma.video.create({
      data: {
        title: title || `Video ${videoId}`,
        thumbnail,
        duration: "0:00", // Will be updated if we fetch metadata
        category,
        url,
        embedType,
        videoId,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error("Failed to create video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}
