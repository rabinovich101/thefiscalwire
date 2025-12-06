import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET all auto-fill rules
export async function GET() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const rules = await prisma.autoFillRule.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(rules)
  } catch (error) {
    console.error("Get auto-fill rules error:", error)
    return NextResponse.json({ error: "Failed to get auto-fill rules" }, { status: 500 })
  }
}

// POST create new auto-fill rule
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, config, isActive } = body

    const rule = await prisma.autoFillRule.create({
      data: {
        name,
        description: description || null,
        config,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error("Create auto-fill rule error:", error)
    return NextResponse.json({ error: "Failed to create auto-fill rule" }, { status: 500 })
  }
}
