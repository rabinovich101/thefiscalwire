import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  checkRateLimit,
  getClientIdentifier,
  rateLimitMiddleware,
  addRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from '@/lib/rate-limit'

// We need to clear the rate limit store between tests
// Since the store is private, we'll work around it by using unique identifiers

describe('Rate Limit Module', () => {
  describe('RATE_LIMIT_CONFIGS', () => {
    it('should have correct public rate limit configuration', () => {
      expect(RATE_LIMIT_CONFIGS.public).toEqual({
        windowMs: 60000,
        maxRequests: 60,
      })
    })

    it('should have strict auth rate limit configuration', () => {
      expect(RATE_LIMIT_CONFIGS.auth).toEqual({
        windowMs: 900000,
        maxRequests: 10,
      })
    })

    it('should have market rate limit configuration', () => {
      expect(RATE_LIMIT_CONFIGS.market).toEqual({
        windowMs: 60000,
        maxRequests: 100,
      })
    })

    it('should have api rate limit configuration', () => {
      expect(RATE_LIMIT_CONFIGS.api).toEqual({
        windowMs: 60000,
        maxRequests: 30,
      })
    })

    it('should have admin rate limit configuration', () => {
      expect(RATE_LIMIT_CONFIGS.admin).toEqual({
        windowMs: 60000,
        maxRequests: 50,
      })
    })
  })

  describe('getClientIdentifier', () => {
    it('should extract IP from X-Forwarded-For header (first IP in chain)', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
        },
      })
      expect(getClientIdentifier(request)).toBe('192.168.1.1')
    })

    it('should extract single IP from X-Forwarded-For header', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '203.0.113.50',
        },
      })
      expect(getClientIdentifier(request)).toBe('203.0.113.50')
    })

    it('should extract IP from X-Real-IP header', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-real-ip': '10.20.30.40',
        },
      })
      expect(getClientIdentifier(request)).toBe('10.20.30.40')
    })

    it('should extract IP from CF-Connecting-IP header (Cloudflare)', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'cf-connecting-ip': '198.51.100.23',
        },
      })
      expect(getClientIdentifier(request)).toBe('198.51.100.23')
    })

    it('should prioritize X-Forwarded-For over X-Real-IP', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '10.0.0.1',
        },
      })
      expect(getClientIdentifier(request)).toBe('192.168.1.1')
    })

    it('should prioritize X-Real-IP over CF-Connecting-IP', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-real-ip': '10.0.0.1',
          'cf-connecting-ip': '172.16.0.1',
        },
      })
      expect(getClientIdentifier(request)).toBe('10.0.0.1')
    })

    it('should return unknown-client when no IP headers present', () => {
      const request = new Request('http://localhost/api/test')
      expect(getClientIdentifier(request)).toBe('unknown-client')
    })

    it('should trim whitespace from IP addresses', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '  192.168.1.1  , 10.0.0.1',
        },
      })
      expect(getClientIdentifier(request)).toBe('192.168.1.1')
    })
  })

  describe('checkRateLimit', () => {
    it('should allow first request for new identifier', () => {
      const identifier = `test-${Date.now()}-${Math.random()}`
      const result = checkRateLimit(identifier, 'api')

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(RATE_LIMIT_CONFIGS.api.maxRequests - 1)
      expect(result.resetTime).toBeGreaterThan(Date.now())
    })

    it('should decrement remaining count with each request', () => {
      const identifier = `test-decrement-${Date.now()}-${Math.random()}`

      const first = checkRateLimit(identifier, 'api')
      expect(first.remaining).toBe(29)

      const second = checkRateLimit(identifier, 'api')
      expect(second.remaining).toBe(28)

      const third = checkRateLimit(identifier, 'api')
      expect(third.remaining).toBe(27)
    })

    it('should deny requests after exceeding limit', () => {
      const identifier = `test-exceed-${Date.now()}-${Math.random()}`

      // Use a rate limit with low count for testing
      // We'll make (maxRequests + 1) requests
      for (let i = 0; i < RATE_LIMIT_CONFIGS.api.maxRequests; i++) {
        const result = checkRateLimit(identifier, 'api')
        expect(result.allowed).toBe(true)
      }

      // This request should be denied
      const denied = checkRateLimit(identifier, 'api')
      expect(denied.allowed).toBe(false)
      expect(denied.remaining).toBe(0)
    })

    it('should use correct config for each rate limit type', () => {
      const publicId = `test-public-${Date.now()}-${Math.random()}`
      const authId = `test-auth-${Date.now()}-${Math.random()}`

      const publicResult = checkRateLimit(publicId, 'public')
      expect(publicResult.remaining).toBe(RATE_LIMIT_CONFIGS.public.maxRequests - 1)

      const authResult = checkRateLimit(authId, 'auth')
      expect(authResult.remaining).toBe(RATE_LIMIT_CONFIGS.auth.maxRequests - 1)
    })

    it('should separate rate limits by type for same identifier', () => {
      const identifier = `test-separate-${Date.now()}-${Math.random()}`

      const apiResult = checkRateLimit(identifier, 'api')
      const marketResult = checkRateLimit(identifier, 'market')

      // Both should be first requests for their respective types
      expect(apiResult.remaining).toBe(RATE_LIMIT_CONFIGS.api.maxRequests - 1)
      expect(marketResult.remaining).toBe(RATE_LIMIT_CONFIGS.market.maxRequests - 1)
    })
  })

  describe('rateLimitMiddleware', () => {
    it('should return null when request is allowed', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': `unique-ip-${Date.now()}-${Math.random()}`,
        },
      })

      const result = rateLimitMiddleware(request, 'public')
      expect(result).toBeNull()
    })

    it('should return 429 response when rate limited', async () => {
      const uniqueIp = `rate-limit-test-${Date.now()}-${Math.random()}`

      // Exhaust the rate limit for auth (only 10 requests)
      for (let i = 0; i < RATE_LIMIT_CONFIGS.auth.maxRequests; i++) {
        const req = new Request('http://localhost/api/test', {
          headers: { 'x-forwarded-for': uniqueIp },
        })
        rateLimitMiddleware(req, 'auth')
      }

      // Next request should be rate limited
      const request = new Request('http://localhost/api/test', {
        headers: { 'x-forwarded-for': uniqueIp },
      })

      const response = rateLimitMiddleware(request, 'auth')

      expect(response).not.toBeNull()
      expect(response?.status).toBe(429)

      const body = await response?.json()
      expect(body.error).toBe('Too many requests')
      expect(body.retryAfter).toBeGreaterThan(0)
    })

    it('should include rate limit headers in 429 response', async () => {
      const uniqueIp = `headers-test-${Date.now()}-${Math.random()}`

      // Exhaust the rate limit
      for (let i = 0; i < RATE_LIMIT_CONFIGS.auth.maxRequests; i++) {
        const req = new Request('http://localhost/api/test', {
          headers: { 'x-forwarded-for': uniqueIp },
        })
        rateLimitMiddleware(req, 'auth')
      }

      const request = new Request('http://localhost/api/test', {
        headers: { 'x-forwarded-for': uniqueIp },
      })

      const response = rateLimitMiddleware(request, 'auth')

      expect(response?.headers.get('Retry-After')).toBeTruthy()
      expect(response?.headers.get('X-RateLimit-Limit')).toBe(String(RATE_LIMIT_CONFIGS.auth.maxRequests))
      expect(response?.headers.get('X-RateLimit-Remaining')).toBe('0')
      expect(response?.headers.get('X-RateLimit-Reset')).toBeTruthy()
    })

    it('should use api type by default', () => {
      const uniqueIp = `default-type-${Date.now()}-${Math.random()}`
      const request = new Request('http://localhost/api/test', {
        headers: { 'x-forwarded-for': uniqueIp },
      })

      // Call without specifying type (should use 'api' default)
      const result = rateLimitMiddleware(request)
      expect(result).toBeNull()

      // Verify it used api config by checking the internal state
      // We can do this by making more requests
      for (let i = 0; i < RATE_LIMIT_CONFIGS.api.maxRequests - 1; i++) {
        const req = new Request('http://localhost/api/test', {
          headers: { 'x-forwarded-for': uniqueIp },
        })
        rateLimitMiddleware(req)
      }

      // This should be the 31st request (api limit is 30)
      const finalRequest = new Request('http://localhost/api/test', {
        headers: { 'x-forwarded-for': uniqueIp },
      })
      const finalResult = rateLimitMiddleware(finalRequest)
      expect(finalResult?.status).toBe(429)
    })
  })

  describe('addRateLimitHeaders', () => {
    it('should add rate limit headers to response', () => {
      const uniqueId = `add-headers-${Date.now()}-${Math.random()}`

      // Make a request to create an entry
      checkRateLimit(uniqueId, 'public')

      const originalResponse = new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })

      const enhancedResponse = addRateLimitHeaders(originalResponse, uniqueId, 'public')

      expect(enhancedResponse.headers.get('X-RateLimit-Limit')).toBe(String(RATE_LIMIT_CONFIGS.public.maxRequests))
      expect(enhancedResponse.headers.get('X-RateLimit-Remaining')).toBeTruthy()
      expect(enhancedResponse.headers.get('X-RateLimit-Reset')).toBeTruthy()
    })

    it('should preserve original response properties', async () => {
      const uniqueId = `preserve-props-${Date.now()}-${Math.random()}`
      checkRateLimit(uniqueId, 'api')

      const originalResponse = new Response(JSON.stringify({ success: true }), {
        status: 201,
        statusText: 'Created',
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'test-value',
        },
      })

      const enhancedResponse = addRateLimitHeaders(originalResponse, uniqueId, 'api')

      expect(enhancedResponse.status).toBe(201)
      expect(enhancedResponse.statusText).toBe('Created')
      expect(enhancedResponse.headers.get('Content-Type')).toBe('application/json')
      expect(enhancedResponse.headers.get('X-Custom-Header')).toBe('test-value')
    })

    it('should show max remaining when no entry exists', () => {
      const uniqueId = `no-entry-${Date.now()}-${Math.random()}`
      // Do NOT make any requests first

      const originalResponse = new Response('{}')
      const enhancedResponse = addRateLimitHeaders(originalResponse, uniqueId, 'market')

      expect(enhancedResponse.headers.get('X-RateLimit-Limit')).toBe(String(RATE_LIMIT_CONFIGS.market.maxRequests))
      expect(enhancedResponse.headers.get('X-RateLimit-Remaining')).toBe(String(RATE_LIMIT_CONFIGS.market.maxRequests))
    })
  })
})
