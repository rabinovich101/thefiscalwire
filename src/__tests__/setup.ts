import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js modules
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
    NextResponse: {
      json: (body: unknown, init?: ResponseInit) => {
        const response = new Response(JSON.stringify(body), {
          ...init,
          headers: {
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
          },
        })
        return response
      },
    },
    NextRequest: class MockNextRequest extends Request {
      nextUrl: URL

      constructor(input: string | URL | Request, init?: RequestInit) {
        super(input, init)
        this.nextUrl = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
      }
    },
  }
})

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})
