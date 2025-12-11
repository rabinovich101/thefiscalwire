import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { addArticleToPageBuilderZones } from "@/lib/page-builder-placement"

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
      newTags,
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

    // Create new tags if any
    const createdTagIds: string[] = []
    if (newTags && Array.isArray(newTags) && newTags.length > 0) {
      for (const tagName of newTags) {
        // Check if tag already exists (case-insensitive)
        const existingTag = await prisma.tag.findFirst({
          where: { name: { equals: tagName, mode: "insensitive" } },
        })

        if (existingTag) {
          createdTagIds.push(existingTag.id)
        } else {
          const newTag = await prisma.tag.create({
            data: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            },
          })
          createdTagIds.push(newTag.id)
        }
      }
    }

    // Combine existing tag IDs with newly created tag IDs
    const allTagIds = [...(tagIds || []), ...createdTagIds]

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
          connect: allTagIds.map((id: string) => ({ id })),
        },
        // Also connect to the categories many-to-many for filtering
        categories: {
          connect: [{ id: marketsCategoryId }, { id: businessCategoryId }],
        },
      },
    })

    // Add article to page builder zones (homepage + category pages)
    await addArticleToPageBuilderZones(article.id, marketsCategoryId, businessCategoryId)

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
