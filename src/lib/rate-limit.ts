/**
 * Simple in-memory rate limiter for API endpoints
 * Uses a sliding window approach for rate limiting
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: In production with multiple instances, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60000; // 1 minute
let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

// Default configurations for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  // Public search/read endpoints - more lenient
  public: {
    windowMs: 60000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  // Auth endpoints - stricter to prevent brute force
  auth: {
    windowMs: 900000, // 15 minutes
    maxRequests: 10, // 10 attempts per 15 minutes
  },
  // API endpoints - moderate
  api: {
    windowMs: 60000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
  // Stock/Market data - account for real-time needs
  market: {
    windowMs: 60000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
  // Admin endpoints - moderate
  admin: {
    windowMs: 60000, // 1 minute
    maxRequests: 50, // 50 requests per minute
  },
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (e.g., IP address, user ID)
 * @param type - Type of rate limit to apply
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  type: RateLimitType = 'api'
): { allowed: boolean; remaining: number; resetTime: number } {
  startCleanup();

  const config = RATE_LIMIT_CONFIGS[type];
  const key = `${type}:${identifier}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  // No existing entry or expired entry
  if (!entry || entry.resetTime < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request headers
 * Prefers X-Forwarded-For for proxied requests, falls back to a default
 */
export function getClientIdentifier(request: Request): string {
  // Try X-Forwarded-For first (common for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP in the chain (original client)
    return forwardedFor.split(',')[0].trim();
  }

  // Try X-Real-IP (some proxies use this)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Try CF-Connecting-IP (Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  // Fallback for local development or unknown sources
  return 'unknown-client';
}

/**
 * Rate limit middleware helper for API routes
 * Returns null if allowed, or a Response if rate limited
 */
export function rateLimitMiddleware(
  request: Request,
  type: RateLimitType = 'api'
): Response | null {
  const clientId = getClientIdentifier(request);
  const result = checkRateLimit(clientId, type);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(RATE_LIMIT_CONFIGS[type].maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.resetTime),
        },
      }
    );
  }

  return null;
}

/**
 * Helper to add rate limit headers to successful responses
 */
export function addRateLimitHeaders(
  response: Response,
  identifier: string,
  type: RateLimitType = 'api'
): Response {
  const key = `${type}:${identifier}`;
  const entry = rateLimitStore.get(key);
  const config = RATE_LIMIT_CONFIGS[type];

  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', String(config.maxRequests));
  headers.set(
    'X-RateLimit-Remaining',
    String(entry ? Math.max(0, config.maxRequests - entry.count) : config.maxRequests)
  );
  headers.set('X-RateLimit-Reset', String(entry?.resetTime || Date.now() + config.windowMs));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
