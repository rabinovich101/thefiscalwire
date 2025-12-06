import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET all zone definitions
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const layoutId = searchParams.get("layoutId")

    const zoneDefinitions = await prisma.zoneDefinition.findMany({
      where: layoutId ? { layoutId } : undefined,
      orderBy: { name: "asc" },
      include: {
        layout: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            pageZones: true,
          },
        },
      },
    })

    return NextResponse.json(zoneDefinitions)
  } catch (error) {
    console.error("Get zone definitions error:", error)
    return NextResponse.json({ error: "Failed to get zone definitions" }, { status: 500 })
  }
}

// POST create new zone definition
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, slug, description, zoneType, gridArea, minItems, maxItems, defaultRules, layoutId } = body

    // Check if slug already exists
    const existingZone = await prisma.zoneDefinition.findUnique({
      where: { slug },
    })

    if (existingZone) {
      return NextResponse.json(
        { error: "A zone definition with this slug already exists" },
        { status: 400 }
      )
    }

    const zoneDefinition = await prisma.zoneDefinition.create({
      data: {
        name,
        slug,
        description: description || null,
        zoneType,
        gridArea: gridArea || null,
        minItems: minItems ?? 1,
        maxItems: maxItems ?? 10,
        defaultRules: defaultRules || null,
        layoutId: layoutId || null,
      },
      include: {
        layout: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(zoneDefinition)
  } catch (error) {
    console.error("Create zone definition error:", error)
    return NextResponse.json({ error: "Failed to create zone definition" }, { status: 500 })
  }
}
