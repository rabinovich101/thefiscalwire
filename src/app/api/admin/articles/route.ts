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
        marketsCategoryId,
        businessCategoryId,
        authorId,
        relevantTickers: relevantTickers || [],
        tags: {
          connect: tagIds?.map((id: string) => ({ id })) || [],
        },
        // Also connect to the categories many-to-many for filtering
        categories: {
          connect: [{ id: marketsCategoryId }, { id: businessCategoryId }],
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
        marketsCategory: true,
        businessCategory: true,
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
