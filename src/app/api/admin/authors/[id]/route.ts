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
    const { name, avatar, bio } = await request.json()

    const author = await prisma.author.update({
      where: { id },
      data: {
        name,
        avatar: avatar || null,
        bio: bio || null,
      },
    })

    return NextResponse.json(author)
  } catch (error) {
    console.error("Update author error:", error)
    return NextResponse.json({ error: "Failed to update author" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    // Check if author has articles
    const articleCount = await prisma.article.count({
      where: { authorId: id },
    })

    if (articleCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete author with articles" },
        { status: 400 }
      )
    }

    await prisma.author.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete author error:", error)
    return NextResponse.json({ error: "Failed to delete author" }, { status: 500 })
  }
}
