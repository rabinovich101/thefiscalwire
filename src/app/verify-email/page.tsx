"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useState, Suspense } from "react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const email = searchParams.get("email")

  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  const handleResend = async () => {
    if (!email) return

    setIsResending(true)
    setResendMessage("")

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendMessage("Verification email sent! Please check your inbox.")
      } else {
        setResendMessage(data.error || "Failed to resend verification email")
      }
    } catch {
      setResendMessage("Something went wrong. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const getErrorMessage = () => {
    switch (error) {
      case "missing-token":
        return "No verification token provided."
      case "invalid-token":
        return "This verification link is invalid or has expired."
      case "user-not-found":
        return "User account not found."
      case "unknown":
        return "Something went wrong during verification."
      default:
        return null
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {errorMessage ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            {email && (
              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </button>
                {resendMessage && (
                  <p className={`text-sm ${resendMessage.includes("sent") ? "text-green-600" : "text-red-600"}`}>
                    {resendMessage}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </>
        ) : email ? (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a verification link to <strong>{email}</strong>.
              Please click the link in the email to verify your account.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Didn&apos;t receive the email? Check your spam folder or click below to resend.
            </p>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </button>
            {resendMessage && (
              <p className={`mt-4 text-sm ${resendMessage.includes("sent") ? "text-green-600" : "text-red-600"}`}>
                {resendMessage}
              </p>
            )}

            <div className="mt-6">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verification
            </h1>
            <p className="text-gray-600 mb-6">
              Please check your email for a verification link. If you haven&apos;t received one,
              try logging in to resend the verification email.
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
