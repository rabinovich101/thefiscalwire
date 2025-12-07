import { describe, it, expect } from 'vitest'
import {
  searchQuerySchema,
  articleQuerySchema,
  stockSearchSchema,
  paginationSchema,
  signupSchema,
  forgotPasswordSchema,
  marketQuotesSchema,
  validateSearchParams,
  validateBody,
  validationErrorResponse,
} from '@/lib/validations'
import { z } from 'zod'

describe('Validation Schemas', () => {
  describe('searchQuerySchema', () => {
    it('should validate query with minimum 2 characters', () => {
      const result = searchQuerySchema.safeParse({ q: 'ab' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.q).toBe('ab')
      }
    })

    it('should reject query with less than 2 characters', () => {
      const result = searchQuerySchema.safeParse({ q: 'a' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters')
      }
    })

    it('should reject empty query', () => {
      const result = searchQuerySchema.safeParse({ q: '' })
      expect(result.success).toBe(false)
    })

    it('should enforce maximum 200 characters', () => {
      const longQuery = 'a'.repeat(201)
      const result = searchQuerySchema.safeParse({ q: longQuery })
      expect(result.success).toBe(false)
    })

    it('should accept query at maximum length', () => {
      const maxQuery = 'a'.repeat(200)
      const result = searchQuerySchema.safeParse({ q: maxQuery })
      expect(result.success).toBe(true)
    })

    it('should default limit to 10', () => {
      const result = searchQuerySchema.safeParse({ q: 'test' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(10)
      }
    })

    it('should accept custom limit', () => {
      const result = searchQuerySchema.safeParse({ q: 'test', limit: '25' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(25)
      }
    })

    it('should enforce maximum limit of 50', () => {
      const result = searchQuerySchema.safeParse({ q: 'test', limit: '100' })
      expect(result.success).toBe(false)
    })

    it('should reject negative limit', () => {
      const result = searchQuerySchema.safeParse({ q: 'test', limit: '-5' })
      expect(result.success).toBe(false)
    })
  })

  describe('articleQuerySchema', () => {
    it('should have default offset of 0', () => {
      const result = articleQuerySchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.offset).toBe(0)
      }
    })

    it('should have default limit of 8', () => {
      const result = articleQuerySchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(8)
      }
    })

    it('should accept category filter', () => {
      const result = articleQuerySchema.safeParse({ category: 'tech' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.category).toBe('tech')
      }
    })

    it('should accept analysis filters', () => {
      const result = articleQuerySchema.safeParse({
        sector: 'technology',
        stock: 'AAPL',
        market: 'US',
        sentiment: 'positive',
        businessType: 'tech-company',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sector).toBe('technology')
        expect(result.data.stock).toBe('AAPL')
        expect(result.data.market).toBe('US')
        expect(result.data.sentiment).toBe('positive')
        expect(result.data.businessType).toBe('tech-company')
      }
    })

    it('should validate sentiment enum values', () => {
      const validResult = articleQuerySchema.safeParse({ sentiment: 'negative' })
      expect(validResult.success).toBe(true)

      const invalidResult = articleQuerySchema.safeParse({ sentiment: 'invalid' })
      expect(invalidResult.success).toBe(false)
    })

    it('should enforce maximum limit of 100', () => {
      const result = articleQuerySchema.safeParse({ limit: '150' })
      expect(result.success).toBe(false)
    })

    it('should coerce string numbers to integers', () => {
      const result = articleQuerySchema.safeParse({ offset: '20', limit: '15' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.offset).toBe(20)
        expect(result.data.limit).toBe(15)
      }
    })
  })

  describe('stockSearchSchema', () => {
    it('should validate query with minimum 1 character', () => {
      const result = stockSearchSchema.safeParse({ q: 'A' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.q).toBe('A')
      }
    })

    it('should reject empty query', () => {
      const result = stockSearchSchema.safeParse({ q: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('required')
      }
    })

    it('should enforce maximum 50 characters', () => {
      const longQuery = 'a'.repeat(51)
      const result = stockSearchSchema.safeParse({ q: longQuery })
      expect(result.success).toBe(false)
    })

    it('should accept valid stock symbols', () => {
      const result = stockSearchSchema.safeParse({ q: 'AAPL' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.q).toBe('AAPL')
      }
    })
  })

  describe('paginationSchema', () => {
    it('should have default page of 1', () => {
      const result = paginationSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
      }
    })

    it('should have default offset of 0', () => {
      const result = paginationSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.offset).toBe(0)
      }
    })

    it('should have default limit of 20', () => {
      const result = paginationSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(20)
      }
    })

    it('should reject negative offset', () => {
      const result = paginationSchema.safeParse({ offset: '-5' })
      expect(result.success).toBe(false)
    })

    it('should reject page less than 1', () => {
      const result = paginationSchema.safeParse({ page: '0' })
      expect(result.success).toBe(false)
    })

    it('should enforce maximum limit of 100', () => {
      const result = paginationSchema.safeParse({ limit: '150' })
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    it('should validate correct signup data', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password1',
      })
      expect(result.success).toBe(true)
    })

    it('should reject name less than 2 characters', () => {
      const result = signupSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        password: 'Password1',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password1',
      })
      expect(result.success).toBe(false)
    })

    it('should reject password without uppercase', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password1',
      })
      expect(result.success).toBe(false)
    })

    it('should reject password without lowercase', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'PASSWORD1',
      })
      expect(result.success).toBe(false)
    })

    it('should reject password without number', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'PasswordABC',
      })
      expect(result.success).toBe(false)
    })

    it('should reject password less than 8 characters', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Pass1',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('should validate correct email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'invalid',
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('marketQuotesSchema', () => {
    it('should transform comma-separated symbols to array', () => {
      const result = marketQuotesSchema.safeParse({
        symbols: 'AAPL,GOOGL,MSFT',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.symbols).toEqual(['AAPL', 'GOOGL', 'MSFT'])
      }
    })

    it('should accept single symbol', () => {
      const result = marketQuotesSchema.safeParse({
        symbols: 'AAPL',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.symbols).toEqual(['AAPL'])
      }
    })

    it('should reject empty symbols', () => {
      const result = marketQuotesSchema.safeParse({
        symbols: '',
      })
      expect(result.success).toBe(false)
    })

    it('should enforce maximum 50 symbols', () => {
      const manySymbols = Array.from({ length: 51 }, (_, i) => `SYM${i}`).join(',')
      const result = marketQuotesSchema.safeParse({
        symbols: manySymbols,
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('Validation Helper Functions', () => {
  describe('validateSearchParams', () => {
    it('should parse valid URL search params', () => {
      const searchParams = new URLSearchParams('q=test&limit=20')
      const result = validateSearchParams(searchParams, searchQuerySchema)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.q).toBe('test')
        expect(result.data.limit).toBe(20)
      }
    })

    it('should return error for invalid params', () => {
      const searchParams = new URLSearchParams('q=a')
      const result = validateSearchParams(searchParams, searchQuerySchema)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(z.ZodError)
      }
    })

    it('should handle empty search params with defaults', () => {
      const searchParams = new URLSearchParams('')
      const result = validateSearchParams(searchParams, articleQuerySchema)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.offset).toBe(0)
        expect(result.data.limit).toBe(8)
      }
    })

    it('should handle multiple filters', () => {
      const searchParams = new URLSearchParams('category=tech&offset=10&limit=20&sentiment=positive')
      const result = validateSearchParams(searchParams, articleQuerySchema)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.category).toBe('tech')
        expect(result.data.offset).toBe(10)
        expect(result.data.limit).toBe(20)
        expect(result.data.sentiment).toBe('positive')
      }
    })
  })

  describe('validateBody', () => {
    it('should parse valid JSON body', async () => {
      const request = new Request('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await validateBody(request, forgotPasswordSchema)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should return error for invalid JSON', async () => {
      const request = new Request('http://localhost/api/test', {
        method: 'POST',
        body: 'not valid json',
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await validateBody(request, forgotPasswordSchema)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid JSON body')
      }
    })

    it('should return error for invalid data', async () => {
      const request = new Request('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid-email' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await validateBody(request, forgotPasswordSchema)

      expect(result.success).toBe(false)
    })
  })

  describe('validationErrorResponse', () => {
    it('should format single error correctly', async () => {
      const result = searchQuerySchema.safeParse({ q: 'a' })

      expect(result.success).toBe(false)
      if (!result.success) {
        const response = validationErrorResponse(result.error)

        expect(response.status).toBe(400)
        expect(response.headers.get('Content-Type')).toBe('application/json')

        const body = await response.json()
        expect(body.error).toBe('Validation failed')
        expect(body.details).toBeInstanceOf(Array)
        expect(body.details.length).toBeGreaterThan(0)
        expect(body.details[0]).toHaveProperty('field')
        expect(body.details[0]).toHaveProperty('message')
      }
    })

    it('should format multiple errors correctly', async () => {
      const result = signupSchema.safeParse({
        name: 'J',
        email: 'invalid',
        password: 'weak',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const response = validationErrorResponse(result.error)
        const body = await response.json()

        expect(body.details.length).toBeGreaterThan(1)
      }
    })

    it('should include field path in error details', async () => {
      const result = searchQuerySchema.safeParse({ q: 'a' })

      expect(result.success).toBe(false)
      if (!result.success) {
        const response = validationErrorResponse(result.error)
        const body = await response.json()

        expect(body.details[0].field).toBe('q')
      }
    })

    it('should handle nested field paths', async () => {
      // Create a schema with nested object
      const nestedSchema = z.object({
        user: z.object({
          profile: z.object({
            age: z.number().min(18),
          }),
        }),
      })

      const result = nestedSchema.safeParse({
        user: { profile: { age: 15 } },
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const response = validationErrorResponse(result.error)
        const body = await response.json()

        expect(body.details[0].field).toBe('user.profile.age')
      }
    })
  })
})
