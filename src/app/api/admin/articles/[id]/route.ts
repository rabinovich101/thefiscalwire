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
      marketsCategoryId,
      businessCategoryId,
      authorId,
      tagIds,
      relevantTickers,
    } = body

    // Validate both categories are provided
    if (!marketsCategoryId || !businessCategoryId) {
      return NextResponse.json(
        { error: "Both markets and business categories are required" },
        { status: 400 }
      )
    }

    // Validate category types
    const [marketsCategory, businessCategory] = await Promise.all([
      prisma.category.findUnique({ where: { id: marketsCategoryId } }),
      prisma.category.findUnique({ where: { id: businessCategoryId } }),
    ])

    if (!marketsCategory || marketsCategory.type !== "MARKETS") {
      return NextResponse.json(
        { error: "Markets category must be of type MARKETS" },
        { status: 400 }
      )
    }

    if (!businessCategory || businessCategory.type !== "BUSINESS") {
      return NextResponse.json(
        { error: "Business category must be of type BUSINESS" },
        { status: 400 }
      )
    }

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
        marketsCategoryId,
        businessCategoryId,
        authorId,
        relevantTickers: relevantTickers || [],
        tags: {
          set: tagIds?.map((tagId: string) => ({ id: tagId })) || [],
        },
        // Update categories many-to-many relation
        categories: {
          set: [{ id: marketsCategoryId }, { id: businessCategoryId }],
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
        marketsCategory: true,
        businessCategory: true,
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
