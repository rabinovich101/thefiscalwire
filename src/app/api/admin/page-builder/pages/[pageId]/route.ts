import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET single page with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { pageId } = await params

    const page = await prisma.pageDefinition.findUnique({
      where: { id: pageId },
      include: {
        layout: true,
        category: true,
        zones: {
          include: {
            zoneDefinition: true,
            placements: {
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
                createdBy: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error("Get page error:", error)
    return NextResponse.json({ error: "Failed to get page" }, { status: 500 })
  }
}

// PUT update page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { pageId } = await params
    const body = await request.json()
    const { name, slug, pageType, categoryId, stockSymbol, layoutId, isActive } = body

    // Check if slug already exists (excluding current page)
    if (slug) {
      const existingPage = await prisma.pageDefinition.findFirst({
        where: {
          slug,
          NOT: { id: pageId },
        },
      })

      if (existingPage) {
        return NextResponse.json(
          { error: "A page with this slug already exists" },
          { status: 400 }
        )
      }
    }

    const page = await prisma.pageDefinition.update({
      where: { id: pageId },
      data: {
        name,
        slug,
        pageType,
        categoryId: categoryId || null,
        stockSymbol: stockSymbol || null,
        layoutId: layoutId || null,
        isActive,
      },
      include: {
        layout: true,
        category: true,
        zones: {
          include: {
            zoneDefinition: true,
          },
        },
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Update page error:", error)
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}

// DELETE page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { pageId } = await params

    await prisma.pageDefinition.delete({
      where: { id: pageId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete page error:", error)
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}
