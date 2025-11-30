import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
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

    // Check if slug already exists (for a different article)
    const existingArticle = await prisma.article.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    })

    if (existingArticle) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 400 }
      )
    }

    const article = await prisma.article.update({
      where: { id },
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
          set: tagIds?.map((tagId: string) => ({ id: tagId })) || [],
        },
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Update article error:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    await prisma.article.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete article error:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Get article error:", error)
    return NextResponse.json({ error: "Failed to get article" }, { status: 500 })
  }
}
