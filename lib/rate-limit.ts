import type { NextApiRequest, NextApiResponse } from 'next'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const rateLimitStore: RateLimitStore = {}

interface RateLimitConfig {
  interval: number // in milliseconds
  uniqueTokenPerInterval: number
}

/**
 * Simple in-memory rate limiter for API routes
 *
 * ⚠️ WARNING: This is an in-memory solution and has limitations:
 * - Does not work across multiple server instances (lost during deployments)
 * - Memory leaks if not cleaned up properly
 * - No persistence across restarts
 *
 * For production with multiple instances, consider:
 * - Redis-based rate limiting (e.g., @upstash/ratelimit)
 * - Edge-based rate limiting (e.g., Vercel Edge Config, Cloudflare Workers KV)
 * - Database-backed solutions for persistent tracking
 */
export function rateLimit(config: RateLimitConfig) {
  const { interval, uniqueTokenPerInterval } = config

  return {
    check: (req: NextApiRequest, res: NextApiResponse, limit: number): boolean => {
      // Get client identifier (IP address) with better extraction
      const token =
        // Cloudflare provides this header
        (req.headers['cf-connecting-ip'] as string) ||
        // Standard forwarding header (first IP in chain)
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        // Alternative real IP header
        (req.headers['x-real-ip'] as string) ||
        // Fallback to socket address
        req.socket.remoteAddress ||
        'unknown'

      const now = Date.now()
      const tokenKey = `${token}`

      // Clean up old entries periodically
      if (Math.random() < 0.01) {
        Object.keys(rateLimitStore).forEach((key) => {
          if (rateLimitStore[key].resetTime < now) {
            delete rateLimitStore[key]
          }
        })
      }

      // Initialize or reset if interval has passed
      if (!rateLimitStore[tokenKey] || rateLimitStore[tokenKey].resetTime < now) {
        rateLimitStore[tokenKey] = {
          count: 0,
          resetTime: now + interval,
        }
      }

      // Limit the number of unique tokens stored
      if (Object.keys(rateLimitStore).length > uniqueTokenPerInterval) {
        // Remove oldest entry
        const oldestKey = Object.keys(rateLimitStore).reduce((a, b) =>
          rateLimitStore[a].resetTime < rateLimitStore[b].resetTime ? a : b
        )
        delete rateLimitStore[oldestKey]
      }

      // Increment counter
      rateLimitStore[tokenKey].count += 1

      // Check if limit exceeded
      const currentCount = rateLimitStore[tokenKey].count
      const isRateLimited = currentCount > limit

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', limit.toString())
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - currentCount).toString())
      res.setHeader(
        'X-RateLimit-Reset',
        Math.ceil(rateLimitStore[tokenKey].resetTime / 1000).toString()
      )

      if (isRateLimited) {
        res.setHeader('Retry-After', Math.ceil((rateLimitStore[tokenKey].resetTime - now) / 1000).toString())
      }

      return !isRateLimited
    },
  }
}
