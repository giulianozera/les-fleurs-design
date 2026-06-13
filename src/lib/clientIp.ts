import type { NextRequest } from 'next/server';

// Resolve a best-effort client IP for rate-limiting / abuse keys.
//
// SECURITY: never use the whole `x-forwarded-for` header as a key. Behind
// Vercel's proxy the header is "<realClient>, <proxy1>, <proxy2>"; the FIRST
// entry is the real client. A bot can *prepend* arbitrary values to the header,
// so keying on the raw string lets it mint a brand-new bucket on every request
// and sail past any per-IP limit. We therefore take only the left-most hop and
// fall back to `x-real-ip`.
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}
