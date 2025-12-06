import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET search content (articles and videos) for placement picker
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "all" // "all" | "articles" | "videos"
    const categoryId = searchParams.get("categoryId")
    const limit = parseInt(searchParams.get("limit") || "20")

    const results: {
      articles?: {
        id: string
        title: string
        slug: string
        excerpt: string
        imageUrl: string
        publishedAt: Date
        category: { id: string; name: string; slug: string; color: string } | null
        author: { id: string; name: string; avatar: string | null } | null
      }[]
      videos?: {
        id: string
        title: string
        thumbnail: string
        duration: string
        category: string
        createdAt: Date
      }[]
    } = {}

    if (type === "all" || type === "articles") {
      const articles = await prisma.article.findMany({
        where: {
          AND: [
            query
              ? {
                  OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { excerpt: { contains: query, mode: "insensitive" } },
                    { slug: { contains: query, mode: "insensitive" } },
                  ],
                }
              : {},
            categoryId ? { categoryId } : {},
          ],
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          imageUrl: true,
          publishedAt: true,
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
      results.articles = articles
    }

    if (type === "all" || type === "videos") {
      const videos = await prisma.video.findMany({
        where: query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { category: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          thumbnail: true,
          duration: true,
          category: true,
          createdAt: true,
        },
      })
      results.videos = videos
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Content search error:", error)
    return NextResponse.json({ error: "Failed to search content" }, { status: 500 })
  }
}
