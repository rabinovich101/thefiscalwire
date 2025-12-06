import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET all layouts
export async function GET() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const layouts = await prisma.layoutTemplate.findMany({
      orderBy: { name: "asc" },
      include: {
        zones: {
          orderBy: { name: "asc" },
        },
        _count: {
          select: {
            pages: true,
          },
        },
      },
    })

    return NextResponse.json(layouts)
  } catch (error) {
    console.error("Get layouts error:", error)
    return NextResponse.json({ error: "Failed to get layouts" }, { status: 500 })
  }
}

// POST create new layout
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, gridConfig, thumbnail } = body

    const layout = await prisma.layoutTemplate.create({
      data: {
        name,
        description: description || null,
        gridConfig,
        thumbnail: thumbnail || null,
      },
      include: {
        zones: true,
      },
    })

    return NextResponse.json(layout)
  } catch (error) {
    console.error("Create layout error:", error)
    return NextResponse.json({ error: "Failed to create layout" }, { status: 500 })
  }
}
