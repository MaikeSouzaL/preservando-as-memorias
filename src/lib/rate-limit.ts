import { NextRequest, NextResponse } from "next/server";

// In-memory fallback for when Redis is not configured (dev / CI)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryCheck(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, limit - entry.count);
  return { allowed: entry.count <= limit, remaining };
}

type RateLimitConfig = {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSecs: number;
};

/**
 * Check rate limit for a request.
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set,
 * otherwise falls back to an in-process memory store (not shared across instances).
 *
 * Returns a 429 NextResponse if the limit is exceeded, or null if the request is allowed.
 */
export async function checkRateLimit(
  request: NextRequest | Request,
  prefix: string,
  { limit, windowSecs }: RateLimitConfig
): Promise<NextResponse | null> {
  const ip =
    (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (request.headers.get("x-real-ip") ?? "") ||
    "unknown";

  const key = `${prefix}:${ip}`;
  const windowMs = windowSecs * 1000;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  let allowed = true;
  let remaining = limit - 1;

  if (redisUrl && redisToken) {
    // Upstash Redis sliding window
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const ratelimit = new Ratelimit({
      redis: new Redis({ url: redisUrl, token: redisToken }),
      limiter: Ratelimit.slidingWindow(limit, `${windowSecs} s`),
      prefix,
    });

    const result = await ratelimit.limit(ip);
    allowed = result.success;
    remaining = result.remaining;
  } else {
    const result = memoryCheck(key, limit, windowMs);
    allowed = result.allowed;
    remaining = result.remaining;
  }

  if (!allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente." },
      {
        status: 429,
        headers: {
          "Retry-After": String(windowSecs),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}
