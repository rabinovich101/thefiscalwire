import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, avatar, bio } = await request.json()

    const author = await prisma.author.create({
      data: {
        name,
        avatar: avatar || null,
        bio: bio || null,
      },
    })

    return NextResponse.json(author)
  } catch (error) {
    console.error("Create author error:", error)
    return NextResponse.json({ error: "Failed to create author" }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(authors)
  } catch (error) {
    console.error("Get authors error:", error)
    return NextResponse.json({ error: "Failed to get authors" }, { status: 500 })
  }
}
