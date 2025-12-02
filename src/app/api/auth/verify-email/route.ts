import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/tokens"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(
        new URL("/verify-email?error=missing-token", request.url)
      )
    }

    // Verify the token and get the email
    const email = await verifyToken(token)

    if (!email) {
      return NextResponse.redirect(
        new URL("/verify-email?error=invalid-token", request.url)
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.redirect(
        new URL("/verify-email?error=user-not-found", request.url)
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.redirect(
        new URL("/login?verified=already", request.url)
      )
    }

    // Update the user's emailVerified field
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Redirect to login with success message
    return NextResponse.redirect(
      new URL("/login?verified=success", request.url)
    )
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.redirect(
      new URL("/verify-email?error=unknown", request.url)
    )
  }
}
