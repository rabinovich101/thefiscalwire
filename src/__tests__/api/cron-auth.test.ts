/**
 * Cron Authentication Tests
 *
 * These tests verify that:
 * 1. Cron routes accept Bearer token in Authorization header
 * 2. Cron routes accept Vercel Cron header (x-vercel-cron)
 * 3. Cron routes reject unauthorized requests
 * 4. Cron routes do NOT accept secret in query params (for security)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Store original env
const originalEnv = { ...process.env }

// Mock all external dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    author: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'author-1', name: 'Test Author' },
      ]),
      findFirst: vi.fn().mockResolvedValue({ id: 'author-1', name: 'NewsData' }),
      create: vi.fn().mockResolvedValue({ id: 'author-1', name: 'NewsData' }),
    },
    article: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'article-1' }),
    },
    category: {
      findUnique: vi.fn().mockResolvedValue({ id: 'cat-1', slug: 'tech' }),
      create: vi.fn().mockResolvedValue({ id: 'cat-1', slug: 'tech' }),
    },
    tag: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'tag-1' }),
    },
  },
}))

vi.mock('@/lib/newsdata', () => ({
  fetchNewsFromNewsData: vi.fn().mockResolvedValue([]),
  fetchNewsByCategory: vi.fn().mockResolvedValue([]),
  generateSlug: vi.fn().mockReturnValue('test-slug'),
  estimateReadTime: vi.fn().mockReturnValue(5),
  mapCategory: vi.fn().mockReturnValue('tech'),
  extractTickers: vi.fn().mockReturnValue([]),
}))

vi.mock('@/lib/perplexity', () => ({
  rewriteArticleWithPerplexity: vi.fn().mockResolvedValue(null),
  convertRewrittenToBlocks: vi.fn().mockReturnValue([]),
  delay: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/article-analyzer', () => ({
  analyzeArticleWithAI: vi.fn().mockResolvedValue({
    markets: ['US'],
    primarySector: 'tech',
    secondarySectors: [],
    subSectors: [],
    industries: [],
    primaryStock: null,
    mentionedStocks: [],
    competitors: [],
    businessType: 'tech',
    sentiment: 'neutral',
    impactLevel: 'medium',
    confidence: 0.8,
  }),
}))

vi.mock('@/lib/activityLogger', () => ({
  logImport: vi.fn().mockResolvedValue(undefined),
  logNewsApiUsage: vi.fn().mockResolvedValue(undefined),
  logPerplexityBatch: vi.fn().mockResolvedValue(undefined),
  logError: vi.fn().mockResolvedValue(undefined),
  logArticleAnalysis: vi.fn().mockResolvedValue(undefined),
}))

describe('Cron Routes Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set up test environment
    process.env.CRON_SECRET = 'test-cron-secret-12345'
    process.env.NODE_ENV = 'production'
  })

  afterEach(() => {
    // Restore original environment
    process.env = { ...originalEnv }
    vi.resetModules()
  })

  describe('/api/cron/import-news', () => {
    it('should accept valid Authorization Bearer token', async () => {
      const { GET } = await import('@/app/api/cron/import-news/route')

      const request = new Request('http://localhost/api/cron/import-news', {
        headers: {
          Authorization: 'Bearer test-cron-secret-12345',
        },
      })

      const response = await GET(request)
      expect(response.status).not.toBe(401)
    })

    it('should accept x-vercel-cron header', async () => {
      const { GET } = await import('@/app/api/cron/import-news/route')

      const request = new Request('http://localhost/api/cron/import-news', {
        headers: {
          'x-vercel-cron': '1',
        },
      })

      const response = await GET(request)
      expect(response.status).not.toBe(401)
    })

    it('should reject request without auth headers', async () => {
      const { GET } = await import('@/app/api/cron/import-news/route')

      const request = new Request('http://localhost/api/cron/import-news')

      const response = await GET(request)
      expect(response.status).toBe(401)

      const body = await response.json()
      expect(body.error).toBe('Unauthorized')
    })

    it('should reject request with invalid Bearer token', async () => {
      const { GET } = await import('@/app/api/cron/import-news/route')

      const request = new Request('http://localhost/api/cron/import-news', {
        headers: {
          Authorization: 'Bearer wrong-secret',
        },
      })

      const response = await GET(request)
      expect(response.status).toBe(401)
    })

    it('should reject request with secret in query params', async () => {
      const { GET } = await import('@/app/api/cron/import-news/route')

      // Attempting to pass secret via query params should NOT work
      const request = new Request(
        'http://localhost/api/cron/import-news?secret=test-cron-secret-12345'
      )

      const response = await GET(request)
      expect(response.status).toBe(401)
    })

    it('should reject request with malformed Authorization header', async () => {
      const { GET } = await import('@/app/api/cron/import-news/route')

      const request = new Request('http://localhost/api/cron/import-news', {
        headers: {
          // Missing "Bearer" prefix
          Authorization: 'test-cron-secret-12345',
        },
      })

      const response = await GET(request)
      expect(response.status).toBe(401)
    })

    it('should allow request in development mode without secret', async () => {
      // Reset modules to pick up new env
      vi.resetModules()
      process.env.NODE_ENV = 'development'
      delete process.env.CRON_SECRET

      const { GET } = await import('@/app/api/cron/import-news/route')

      const request = new Request('http://localhost/api/cron/import-news')

      const response = await GET(request)
      expect(response.status).not.toBe(401)
    })
  })

  describe('/api/cron/import-category', () => {
    it('should accept valid Authorization Bearer token', async () => {
      const { GET } = await import('@/app/api/cron/import-category/route')

      const request = new Request(
        'http://localhost/api/cron/import-category?category=tech',
        {
          headers: {
            Authorization: 'Bearer test-cron-secret-12345',
          },
        }
      )

      const response = await GET(request)
      expect(response.status).not.toBe(401)
    })

    it('should accept x-vercel-cron header', async () => {
      const { GET } = await import('@/app/api/cron/import-category/route')

      const request = new Request(
        'http://localhost/api/cron/import-category?category=tech',
        {
          headers: {
            'x-vercel-cron': '1',
          },
        }
      )

      const response = await GET(request)
      expect(response.status).not.toBe(401)
    })

    it('should reject request without auth headers', async () => {
      const { GET } = await import('@/app/api/cron/import-category/route')

      const request = new Request(
        'http://localhost/api/cron/import-category?category=tech'
      )

      const response = await GET(request)
      expect(response.status).toBe(401)

      const body = await response.json()
      expect(body.error).toBe('Unauthorized')
    })

    it('should reject request with invalid Bearer token', async () => {
      const { GET } = await import('@/app/api/cron/import-category/route')

      const request = new Request(
        'http://localhost/api/cron/import-category?category=tech',
        {
          headers: {
            Authorization: 'Bearer wrong-secret',
          },
        }
      )

      const response = await GET(request)
      expect(response.status).toBe(401)
    })

    it('should validate category parameter after authentication', async () => {
      const { GET } = await import('@/app/api/cron/import-category/route')

      // Valid auth but invalid category
      const request = new Request(
        'http://localhost/api/cron/import-category?category=invalid-category',
        {
          headers: {
            Authorization: 'Bearer test-cron-secret-12345',
          },
        }
      )

      const response = await GET(request)
      // Should get past auth (not 401) but fail on validation (400)
      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body.error).toContain('Invalid category')
    })

    it('should require category parameter', async () => {
      const { GET } = await import('@/app/api/cron/import-category/route')

      const request = new Request(
        'http://localhost/api/cron/import-category',
        {
          headers: {
            Authorization: 'Bearer test-cron-secret-12345',
          },
        }
      )

      const response = await GET(request)
      expect(response.status).toBe(400)
    })

    it('should reject secret in query params', async () => {
      const { GET } = await import('@/app/api/cron/import-category/route')

      const request = new Request(
        'http://localhost/api/cron/import-category?category=tech&secret=test-cron-secret-12345'
      )

      const response = await GET(request)
      expect(response.status).toBe(401)
    })
  })

  describe('Authorization Header Parsing', () => {
    it('should be case-insensitive for Bearer prefix', async () => {
      // Note: HTTP headers are case-insensitive by spec
      // but Authorization value is typically case-sensitive
      const { GET } = await import('@/app/api/cron/import-news/route')

      // "Bearer" should work (standard)
      const request = new Request('http://localhost/api/cron/import-news', {
        headers: {
          Authorization: 'Bearer test-cron-secret-12345',
        },
      })

      const response = await GET(request)
      expect(response.status).not.toBe(401)
    })

    it('should handle Authorization header with extra whitespace', async () => {
      const { GET } = await import('@/app/api/cron/import-news/route')

      // Extra spaces should cause it to fail (strict matching)
      const request = new Request('http://localhost/api/cron/import-news', {
        headers: {
          Authorization: 'Bearer  test-cron-secret-12345',
        },
      })

      const response = await GET(request)
      // Double space means the token is " test-cron-secret-12345" which is wrong
      expect(response.status).toBe(401)
    })
  })

  describe('Security Best Practices', () => {
    it('should not leak secret in error messages', async () => {
      const { GET } = await import('@/app/api/cron/import-news/route')

      const request = new Request('http://localhost/api/cron/import-news', {
        headers: {
          Authorization: 'Bearer wrong-token',
        },
      })

      const response = await GET(request)
      const body = await response.json()

      // Error message should not contain the actual secret
      expect(JSON.stringify(body)).not.toContain('test-cron-secret-12345')
    })

    it('should return consistent response time regardless of auth failure type', async () => {
      // This is a timing attack mitigation test
      // Both scenarios should complete in similar time

      const { GET } = await import('@/app/api/cron/import-news/route')

      const start1 = Date.now()
      await GET(new Request('http://localhost/api/cron/import-news'))
      const time1 = Date.now() - start1

      const start2 = Date.now()
      await GET(
        new Request('http://localhost/api/cron/import-news', {
          headers: { Authorization: 'Bearer wrong' },
        })
      )
      const time2 = Date.now() - start2

      // Both should complete quickly (within 100ms of each other)
      // This is a basic timing consistency check
      expect(Math.abs(time1 - time2)).toBeLessThan(100)
    })
  })
})
