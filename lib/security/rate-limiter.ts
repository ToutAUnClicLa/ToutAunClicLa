// Rate limiting implementation for authentication endpoints
import { headers } from 'next/headers';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
}

interface RateLimitData {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitData>();

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private getClientId(): string {
    const headersList = headers();
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const userAgent = headersList.get('user-agent') || '';
    
    // Use IP address or fallback to user agent
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    return `${ip}-${userAgent.slice(0, 50)}`;
  }

  private cleanExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    rateLimitStore.forEach((data, key) => {
      if (now > data.resetTime) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => rateLimitStore.delete(key));
  }

  async checkLimit(identifier?: string): Promise<{ allowed: boolean; resetTime: number; remaining: number }> {
    this.cleanExpiredEntries();
    
    const clientId = identifier || this.getClientId();
    const key = `${clientId}`;
    const now = Date.now();
    const resetTime = now + this.config.windowMs;
    
    const existing = rateLimitStore.get(key);
    
    if (!existing || now > existing.resetTime) {
      // First request or expired window
      rateLimitStore.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        resetTime,
        remaining: this.config.maxAttempts - 1
      };
    }
    
    if (existing.count >= this.config.maxAttempts) {
      // Rate limit exceeded
      return {
        allowed: false,
        resetTime: existing.resetTime,
        remaining: 0
      };
    }
    
    // Increment counter
    existing.count++;
    rateLimitStore.set(key, existing);
    
    return {
      allowed: true,
      resetTime: existing.resetTime,
      remaining: this.config.maxAttempts - existing.count
    };
  }

  async reset(identifier?: string): Promise<void> {
    const clientId = identifier || this.getClientId();
    const key = `${clientId}`;
    rateLimitStore.delete(key);
  }
}

// Pre-configured rate limiters for different endpoints
export const authRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000 // 15 minutes
});

export const emailRateLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000 // 1 hour
});

export const passwordResetRateLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000 // 1 hour
});

// Helper function to handle rate limiting in API routes
export async function withRateLimit<T>(
  rateLimiter: RateLimiter,
  handler: () => Promise<T>,
  identifier?: string
): Promise<Response | T> {
  const { allowed, resetTime, remaining } = await rateLimiter.checkLimit(identifier);
  
  if (!allowed) {
    const resetDate = new Date(resetTime);
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        resetTime: resetDate.toISOString()
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': rateLimiter['config'].maxAttempts.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetDate.toISOString()
        }
      }
    );
  }

  // Add rate limit headers to successful responses
  const result = await handler();
  
  if (result instanceof Response) {
    result.headers.set('X-RateLimit-Limit', rateLimiter['config'].maxAttempts.toString());
    result.headers.set('X-RateLimit-Remaining', remaining.toString());
    result.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());
  }
  
  return result;
}
