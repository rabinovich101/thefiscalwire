import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

interface AutoFillConfig {
  source: "articles" | "videos"
  filters?: {
    categorySlug?: string
    categoryId?: string
    isFeatured?: boolean
    isBreaking?: boolean
    tags?: string[]
    maxAge?: string // "24h" | "7d" | "30d"
  }
  sort?: "publishedAt" | "createdAt" | "title"
  order?: "asc" | "desc"
  limit?: number
  skip?: number
}

// POST preview auto-fill rule results
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const config = body.config as AutoFillConfig

    if (!config || !config.source) {
      return NextResponse.json({ error: "Config with source is required" }, { status: 400 })
    }

    if (config.source === "articles") {
      // Build where clause
      const where: {
        categoryId?: string
        category?: { slug: string }
        isFeatured?: boolean
        isBreaking?: boolean
        tags?: { some: { slug: { in: string[] } } }
        publishedAt?: { gte: Date }
      } = {}

      if (config.filters?.categoryId) {
        where.categoryId = config.filters.categoryId
      }
      if (config.filters?.categorySlug) {
        where.category = { slug: config.filters.categorySlug }
      }
      if (config.filters?.isFeatured !== undefined) {
        where.isFeatured = config.filters.isFeatured
      }
      if (config.filters?.isBreaking !== undefined) {
        where.isBreaking = config.filters.isBreaking
      }
      if (config.filters?.tags && config.filters.tags.length > 0) {
        where.tags = { some: { slug: { in: config.filters.tags } } }
      }
      if (config.filters?.maxAge) {
        const now = new Date()
        let ageMs = 0
        switch (config.filters.maxAge) {
          case "24h":
            ageMs = 24 * 60 * 60 * 1000
            break
          case "7d":
            ageMs = 7 * 24 * 60 * 60 * 1000
            break
          case "30d":
            ageMs = 30 * 24 * 60 * 60 * 1000
            break
        }
        where.publishedAt = { gte: new Date(now.getTime() - ageMs) }
      }

      const articles = await prisma.article.findMany({
        where,
        orderBy: { [config.sort || "publishedAt"]: config.order || "desc" },
        skip: config.skip || 0,
        take: config.limit || 10,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          imageUrl: true,
          publishedAt: true,
          isFeatured: true,
          isBreaking: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      return NextResponse.json({
        source: "articles",
        count: articles.length,
        items: articles,
      })
    } else if (config.source === "videos") {
      const videos = await prisma.video.findMany({
        orderBy: { [config.sort || "createdAt"]: config.order || "desc" },
        skip: config.skip || 0,
        take: config.limit || 10,
        select: {
          id: true,
          title: true,
          thumbnail: true,
          duration: true,
          category: true,
          createdAt: true,
        },
      })

      return NextResponse.json({
        source: "videos",
        count: videos.length,
        items: videos,
      })
    }

    return NextResponse.json({ error: "Invalid source type" }, { status: 400 })
  } catch (error) {
    console.error("Preview auto-fill error:", error)
    return NextResponse.json({ error: "Failed to preview auto-fill rule" }, { status: 500 })
  }
}
