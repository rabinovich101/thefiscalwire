import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/email"
import { rateLimitMiddleware } from "@/lib/rate-limit"
import { validateBody, signupSchema, validationErrorResponse } from "@/lib/validations"

export async function POST(request: Request) {
  // Apply strict rate limiting for auth endpoints
  const rateLimitResponse = rateLimitMiddleware(request, 'auth')
  if (rateLimitResponse) return rateLimitResponse

  // Validate input
  const validation = await validateBody(request, signupSchema)
  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { name, email, password } = validation.data

  try {

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (emailVerified is null by default)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Generate verification token and send email
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(email, verificationToken.token)

    return NextResponse.json(
      {
        message: "Account created! Please check your email to verify your account.",
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
