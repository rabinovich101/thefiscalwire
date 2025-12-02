import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with this email, a password reset link has been sent."
      })
    }

    // Generate password reset token and send email
    const resetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(email, resetToken.token)

    return NextResponse.json({
      message: "Password reset link sent! Please check your inbox."
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
