import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET all pages
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageType = searchParams.get("pageType")

    const pages = await prisma.pageDefinition.findMany({
      where: pageType ? { pageType: pageType as "HOMEPAGE" | "CATEGORY" | "STOCK" | "CUSTOM" } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
        layout: true,
        category: true,
        zones: {
          include: {
            zoneDefinition: true,
            placements: {
              orderBy: { position: "asc" },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: {
            zones: true,
          },
        },
      },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error("Get pages error:", error)
    return NextResponse.json({ error: "Failed to get pages" }, { status: 500 })
  }
}

// POST create new page
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, slug, pageType, categoryId, stockSymbol, layoutId, isActive } = body

    // Check if slug already exists
    const existingPage = await prisma.pageDefinition.findUnique({
      where: { slug },
    })

    if (existingPage) {
      return NextResponse.json(
        { error: "A page with this slug already exists" },
        { status: 400 }
      )
    }

    const page = await prisma.pageDefinition.create({
      data: {
        name,
        slug,
        pageType,
        categoryId: categoryId || null,
        stockSymbol: stockSymbol || null,
        layoutId: layoutId || null,
        isActive: isActive ?? true,
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
    console.error("Create page error:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
