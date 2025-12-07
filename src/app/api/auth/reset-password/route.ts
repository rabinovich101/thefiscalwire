import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { verifyPasswordResetToken } from "@/lib/tokens"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Verify the token and get the email
    const email = await verifyPasswordResetToken(token)

    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      )
    }

    // Hash the new password (12 rounds - standardized across all password operations)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      message: "Password reset successfully!"
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
