/**
 * Simple in-memory per-IP rate limiter (token bucket).
 * Works for single-instance deployments (Vercel single region).
 * Replace with Redis/Upstash KV for multi-region deployments.
 */

type Bucket = { count: number; reset: number };
const store = new Map<string, Bucket>();

/**
 * Returns true if the request is within the rate limit, false if it should be blocked.
 * @param ip      Client IP address
 * @param limit   Max requests allowed per window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || entry.reset < now) {
    store.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

/**
 * Extracts the real client IP from a Next.js request.
 * Works behind Vercel's reverse proxy (x-forwarded-for).
 */
export function getIp(req: Request): string {
  return (
    (req.headers as Headers).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Standard 429 response body for Malay-speaking users */
export const RATE_LIMIT_RESPONSE = { error: "Terlalu banyak permintaan. Cuba lagi sebentar." };
