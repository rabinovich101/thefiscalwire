import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, slug, color } = await request.json()

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: { name, slug, color },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Failed to get categories" }, { status: 500 })
  }
}
