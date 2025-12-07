/**
 * API Routes Rate Limiting Integration Tests
 *
 * These tests verify that:
 * 1. API routes apply rate limiting correctly
 * 2. Different rate limit types are used for different endpoints
 * 3. Rate limited responses have correct status and headers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RATE_LIMIT_CONFIGS } from '@/lib/rate-limit'

// Mock prisma to avoid database calls
vi.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
  },
  default: {
    article: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
    user: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    },
    author: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}))

// Mock external services
vi.mock('@/lib/yahoo-finance', () => ({
  getTrendingStocks: vi.fn().mockResolvedValue([]),
  getMostActiveStocks: vi.fn().mockResolvedValue([]),
  getTopGainers: vi.fn().mockResolvedValue([]),
  getTopLosers: vi.fn().mockResolvedValue([]),
  getQuotes: vi.fn().mockResolvedValue([]),
  getMarketIndices: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/data/stockSymbols', () => ({
  searchStocks: vi.fn().mockReturnValue([]),
}))

vi.mock('@/lib/tokens', () => ({
  generateVerificationToken: vi.fn().mockResolvedValue({ token: 'test-token' }),
  generatePasswordResetToken: vi.fn().mockResolvedValue({ token: 'test-token' }),
}))

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
  },
}))

// Helper to create a request with a unique IP
function createRequest(
  url: string,
  options: RequestInit & { uniqueIp?: string } = {}
): Request {
  const { uniqueIp, ...requestOptions } = options
  const ip = uniqueIp || `test-ip-${Date.now()}-${Math.random()}`

  return new Request(url, {
    ...requestOptions,
    headers: {
      ...(requestOptions.headers || {}),
      'x-forwarded-for': ip,
    },
  })
}

// Create a NextRequest-like object for testing
class MockNextRequest extends Request {
  nextUrl: URL

  constructor(input: string | URL, init?: RequestInit) {
    super(input, init)
    this.nextUrl = new URL(typeof input === 'string' ? input : input.href)
  }
}

function createNextRequest(
  url: string,
  options: RequestInit & { uniqueIp?: string } = {}
): MockNextRequest {
  const { uniqueIp, ...requestOptions } = options
  const ip = uniqueIp || `test-ip-${Date.now()}-${Math.random()}`

  return new MockNextRequest(url, {
    ...requestOptions,
    headers: {
      ...(requestOptions.headers || {}),
      'x-forwarded-for': ip,
    },
  })
}

describe('API Routes Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Public Rate Limit Routes', () => {
    describe('/api/search', () => {
      it('should apply public rate limit to search endpoint', async () => {
        const uniqueIp = `search-rate-limit-${Date.now()}`
        const { GET } = await import('@/app/api/search/route')

        // First request should succeed
        const firstRequest = createNextRequest(
          'http://localhost/api/search?q=test',
          { uniqueIp }
        )
        const firstResponse = await GET(firstRequest as any)
        expect(firstResponse.status).not.toBe(429)
      })

      it('should return 429 after exceeding public rate limit', async () => {
        const uniqueIp = `search-exceed-${Date.now()}`
        const { GET } = await import('@/app/api/search/route')

        // Exhaust the rate limit
        for (let i = 0; i < RATE_LIMIT_CONFIGS.public.maxRequests; i++) {
          const request = createNextRequest(
            'http://localhost/api/search?q=test',
            { uniqueIp }
          )
          await GET(request as any)
        }

        // Next request should be rate limited
        const limitedRequest = createNextRequest(
          'http://localhost/api/search?q=test',
          { uniqueIp }
        )
        const response = await GET(limitedRequest as any)

        expect(response.status).toBe(429)
        const body = await response.json()
        expect(body.error).toBe('Too many requests')
      })
    })

    describe('/api/articles', () => {
      it('should apply public rate limit to articles endpoint', async () => {
        const uniqueIp = `articles-rate-limit-${Date.now()}`
        const { GET } = await import('@/app/api/articles/route')

        const request = createNextRequest(
          'http://localhost/api/articles',
          { uniqueIp }
        )
        const response = await GET(request as any)
        expect(response.status).not.toBe(429)
      })

      it('should return 429 after exceeding rate limit for articles', async () => {
        const uniqueIp = `articles-exceed-${Date.now()}`
        const { GET } = await import('@/app/api/articles/route')

        // Exhaust the rate limit
        for (let i = 0; i < RATE_LIMIT_CONFIGS.public.maxRequests; i++) {
          const request = createNextRequest(
            'http://localhost/api/articles',
            { uniqueIp }
          )
          await GET(request as any)
        }

        // Next request should be rate limited
        const limitedRequest = createNextRequest(
          'http://localhost/api/articles',
          { uniqueIp }
        )
        const response = await GET(limitedRequest as any)

        expect(response.status).toBe(429)
      })
    })
  })

  describe('Market Rate Limit Routes', () => {
    describe('/api/stocks/search', () => {
      it('should apply market rate limit to stock search', async () => {
        const uniqueIp = `stocks-search-${Date.now()}`
        const { GET } = await import('@/app/api/stocks/search/route')

        const request = createNextRequest(
          'http://localhost/api/stocks/search?q=AAPL',
          { uniqueIp }
        )
        const response = await GET(request as any)
        expect(response.status).not.toBe(429)
      })

      it('should return 429 after exceeding market rate limit', async () => {
        // Use a smaller subset for this test to avoid timeout
        // We'll verify the rate limit works by testing fewer requests
        const uniqueIp = `stocks-search-exceed-${Date.now()}`
        const { GET } = await import('@/app/api/stocks/search/route')

        // Make enough requests to exceed the limit (100 for market)
        // We batch this to avoid timeout
        const promises = []
        for (let i = 0; i < RATE_LIMIT_CONFIGS.market.maxRequests; i++) {
          const request = createNextRequest(
            'http://localhost/api/stocks/search?q=AAPL',
            { uniqueIp }
          )
          promises.push(GET(request as any))
        }
        await Promise.all(promises)

        // Next request should be rate limited
        const limitedRequest = createNextRequest(
          'http://localhost/api/stocks/search?q=AAPL',
          { uniqueIp }
        )
        const response = await GET(limitedRequest as any)

        expect(response.status).toBe(429)
      }, 30000)
    })

    describe('/api/stocks/trending', () => {
      it('should apply market rate limit to trending stocks', async () => {
        const uniqueIp = `stocks-trending-${Date.now()}`
        const { GET } = await import('@/app/api/stocks/trending/route')

        const request = createNextRequest(
          'http://localhost/api/stocks/trending',
          { uniqueIp }
        )
        const response = await GET(request as any)
        expect(response.status).not.toBe(429)
      })
    })

    describe('/api/market/quotes', () => {
      it('should apply market rate limit to quotes endpoint', async () => {
        const uniqueIp = `market-quotes-${Date.now()}`
        const { GET } = await import('@/app/api/market/quotes/route')

        const request = createNextRequest(
          'http://localhost/api/market/quotes',
          { uniqueIp }
        )
        const response = await GET(request as any)
        expect(response.status).not.toBe(429)
      })

      it('should validate symbols parameter', async () => {
        const uniqueIp = `market-quotes-symbols-${Date.now()}`
        const { GET } = await import('@/app/api/market/quotes/route')

        const request = createNextRequest(
          'http://localhost/api/market/quotes?symbols=AAPL,GOOGL',
          { uniqueIp }
        )
        const response = await GET(request as any)
        expect(response.status).not.toBe(400) // Should not fail validation
      })
    })
  })

  describe('Auth Rate Limit Routes', () => {
    describe('/api/auth/signup', () => {
      it('should apply auth rate limit to signup endpoint', async () => {
        const uniqueIp = `signup-rate-limit-${Date.now()}`
        const { POST } = await import('@/app/api/auth/signup/route')

        const request = createRequest(
          'http://localhost/api/auth/signup',
          {
            method: 'POST',
            body: JSON.stringify({
              name: 'Test User',
              email: 'test@example.com',
              password: 'Password123',
            }),
            headers: { 'Content-Type': 'application/json' },
            uniqueIp,
          }
        )
        const response = await POST(request)
        expect(response.status).not.toBe(429)
      })

      it('should return 429 after exceeding auth rate limit', async () => {
        const uniqueIp = `signup-exceed-${Date.now()}`
        const { POST } = await import('@/app/api/auth/signup/route')

        // Exhaust the auth rate limit (10 requests)
        for (let i = 0; i < RATE_LIMIT_CONFIGS.auth.maxRequests; i++) {
          const request = createRequest(
            'http://localhost/api/auth/signup',
            {
              method: 'POST',
              body: JSON.stringify({
                name: 'Test User',
                email: `test${i}@example.com`,
                password: 'Password123',
              }),
              headers: { 'Content-Type': 'application/json' },
              uniqueIp,
            }
          )
          await POST(request)
        }

        // Next request should be rate limited
        const limitedRequest = createRequest(
          'http://localhost/api/auth/signup',
          {
            method: 'POST',
            body: JSON.stringify({
              name: 'Test User',
              email: 'test@example.com',
              password: 'Password123',
            }),
            headers: { 'Content-Type': 'application/json' },
            uniqueIp,
          }
        )
        const response = await POST(limitedRequest)

        expect(response.status).toBe(429)
        const body = await response.json()
        expect(body.error).toBe('Too many requests')
      })
    })

    describe('/api/auth/forgot-password', () => {
      it('should apply auth rate limit to forgot password endpoint', async () => {
        const uniqueIp = `forgot-password-rate-limit-${Date.now()}`
        const { POST } = await import('@/app/api/auth/forgot-password/route')

        const request = createRequest(
          'http://localhost/api/auth/forgot-password',
          {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com' }),
            headers: { 'Content-Type': 'application/json' },
            uniqueIp,
          }
        )
        const response = await POST(request)
        expect(response.status).not.toBe(429)
      })

      it('should return 429 after exceeding auth rate limit', async () => {
        const uniqueIp = `forgot-password-exceed-${Date.now()}`
        const { POST } = await import('@/app/api/auth/forgot-password/route')

        // Exhaust the auth rate limit (10 requests)
        for (let i = 0; i < RATE_LIMIT_CONFIGS.auth.maxRequests; i++) {
          const request = createRequest(
            'http://localhost/api/auth/forgot-password',
            {
              method: 'POST',
              body: JSON.stringify({ email: `test${i}@example.com` }),
              headers: { 'Content-Type': 'application/json' },
              uniqueIp,
            }
          )
          await POST(request)
        }

        // Next request should be rate limited
        const limitedRequest = createRequest(
          'http://localhost/api/auth/forgot-password',
          {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com' }),
            headers: { 'Content-Type': 'application/json' },
            uniqueIp,
          }
        )
        const response = await POST(limitedRequest)

        expect(response.status).toBe(429)
      })
    })
  })

  describe('Rate Limit Response Headers', () => {
    it('should include proper rate limit headers in 429 response', async () => {
      const uniqueIp = `headers-test-${Date.now()}`
      const { POST } = await import('@/app/api/auth/signup/route')

      // Exhaust the rate limit
      for (let i = 0; i < RATE_LIMIT_CONFIGS.auth.maxRequests; i++) {
        const request = createRequest(
          'http://localhost/api/auth/signup',
          {
            method: 'POST',
            body: JSON.stringify({
              name: 'Test',
              email: `test${i}@example.com`,
              password: 'Password123',
            }),
            headers: { 'Content-Type': 'application/json' },
            uniqueIp,
          }
        )
        await POST(request)
      }

      // Get rate limited response
      const limitedRequest = createRequest(
        'http://localhost/api/auth/signup',
        {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test',
            email: 'test@example.com',
            password: 'Password123',
          }),
          headers: { 'Content-Type': 'application/json' },
          uniqueIp,
        }
      )
      const response = await POST(limitedRequest)

      expect(response.headers.get('Retry-After')).toBeTruthy()
      expect(response.headers.get('X-RateLimit-Limit')).toBe(String(RATE_LIMIT_CONFIGS.auth.maxRequests))
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
      expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy()
    })
  })

  describe('Different IPs are rate limited independently', () => {
    it('should rate limit different IPs independently', async () => {
      const { POST } = await import('@/app/api/auth/signup/route')

      // Exhaust rate limit for first IP
      const ip1 = `ip1-${Date.now()}`
      for (let i = 0; i < RATE_LIMIT_CONFIGS.auth.maxRequests; i++) {
        const request = createRequest(
          'http://localhost/api/auth/signup',
          {
            method: 'POST',
            body: JSON.stringify({
              name: 'Test',
              email: `test${i}@example.com`,
              password: 'Password123',
            }),
            headers: { 'Content-Type': 'application/json' },
            uniqueIp: ip1,
          }
        )
        await POST(request)
      }

      // First IP should be rate limited
      const limitedRequest = createRequest(
        'http://localhost/api/auth/signup',
        {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test',
            email: 'test@example.com',
            password: 'Password123',
          }),
          headers: { 'Content-Type': 'application/json' },
          uniqueIp: ip1,
        }
      )
      const limitedResponse = await POST(limitedRequest)
      expect(limitedResponse.status).toBe(429)

      // Second IP should NOT be rate limited
      const ip2 = `ip2-${Date.now()}`
      const allowedRequest = createRequest(
        'http://localhost/api/auth/signup',
        {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test',
            email: 'test@example.com',
            password: 'Password123',
          }),
          headers: { 'Content-Type': 'application/json' },
          uniqueIp: ip2,
        }
      )
      const allowedResponse = await POST(allowedRequest)
      expect(allowedResponse.status).not.toBe(429)
    })
  })
})
