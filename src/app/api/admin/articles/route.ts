import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      headings,
      imageUrl,
      readTime,
      isFeatured,
      isBreaking,
      categoryId,
      authorId,
      tagIds,
      relevantTickers,
    } = body

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })

    if (existingArticle) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        headings,
        imageUrl,
        readTime,
        isFeatured,
        isBreaking,
        categoryId,
        authorId,
        relevantTickers: relevantTickers || [],
        tags: {
          connect: tagIds?.map((id: string) => ({ id })) || [],
        },
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Create article error:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Get articles error:", error)
    return NextResponse.json({ error: "Failed to get articles" }, { status: 500 })
  }
}
