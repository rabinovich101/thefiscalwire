import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/email"
import { rateLimitMiddleware } from "@/lib/rate-limit"
import { validateBody, forgotPasswordSchema, validationErrorResponse } from "@/lib/validations"

export async function POST(request: Request) {
  // Apply strict rate limiting for auth endpoints
  const rateLimitResponse = rateLimitMiddleware(request, 'auth')
  if (rateLimitResponse) return rateLimitResponse

  // Validate input
  const validation = await validateBody(request, forgotPasswordSchema)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { email } = validation.data

  try {

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
