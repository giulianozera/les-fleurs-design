// Durable-when-possible, best-effort rate limiter.
//
// Two backends, chosen automatically at call time:
//
//   1. Upstash Redis (REST) — used when UPSTASH_REDIS_REST_URL and
//      UPSTASH_REDIS_REST_TOKEN are set. Counters are shared across every
//      serverless instance / region, so the limit actually holds on Vercel.
//      Implemented as a fixed-window counter via a single REST pipeline
//      (INCR + PEXPIRE NX) — no @upstash/* dependency required.
//
//   2. In-memory fallback — a module-level Map. Per-instance and lost on cold
//      start, so it is only a cheap guard against casual floods. Used when
//      Upstash isn't configured, or if a Redis call fails (we fail OPEN to the
//      in-memory limiter so a Redis outage never blocks real customers).
//
// The public API is async: `await rateLimit(key, limit, windowMs)`.

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Epoch ms at which the current window resets. */
  reset: number;
}

// ── In-memory backend ─────────────────────────────────────────────────────────

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the Map can't grow unbounded on a long-lived
// instance. Runs at most once per eviction window.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) {
    if (now >= b.resetAt) buckets.delete(k);
  }
}

function memoryLimit(key: string, limit: number, windowMs: number, now: number): RateLimitResult {
  sweep(now);
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const reset = now + windowMs;
    buckets.set(key, { count: 1, resetAt: reset });
    return { success: true, limit, remaining: limit - 1, reset };
  }

  if (bucket.count >= limit) {
    return { success: false, limit, remaining: 0, reset: bucket.resetAt };
  }

  bucket.count += 1;
  return { success: true, limit, remaining: limit - bucket.count, reset: bucket.resetAt };
}

// ── Upstash REST backend ──────────────────────────────────────────────────────

function upstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function upstashLimit(
  cfg: { url: string; token: string },
  key: string,
  limit: number,
  windowMs: number,
  now: number,
): Promise<RateLimitResult> {
  // Fixed window: bucket the timestamp so every request in the same window
  // shares one Redis key, which auto-expires when the window ends.
  const windowId = Math.floor(now / windowMs);
  const redisKey = `rl:${key}:${windowId}`;
  const reset = (windowId + 1) * windowMs;

  // One round-trip: INCR the counter, and set the TTL only if it's new (NX).
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', redisKey],
      ['PEXPIRE', redisKey, windowMs, 'NX'],
    ]),
    // Never let a slow Redis hang a request handler.
    signal: AbortSignal.timeout(1500),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const data = (await res.json()) as Array<{ result?: number; error?: string }>;
  const count = data?.[0]?.result;
  if (typeof count !== 'number') throw new Error('upstash bad response');

  const remaining = Math.max(0, limit - count);
  return { success: count <= limit, limit, remaining, reset };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Records a hit for `key` and reports whether it is allowed.
 *
 * @param key      Identifier to limit on (e.g. "contact:<ip>").
 * @param limit    Max allowed hits within the window.
 * @param windowMs Length of the window in milliseconds.
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const now = Date.now();
  const cfg = upstashConfig();
  if (cfg) {
    try {
      return await upstashLimit(cfg, key, limit, windowMs, now);
    } catch (err) {
      // Fail OPEN to the in-memory limiter — a Redis blip must never lock out
      // legitimate customers. Still logged so the outage is visible.
      console.error('[rateLimit] Upstash error, falling back to memory:', err);
    }
  }
  return memoryLimit(key, limit, windowMs, now);
}

/** Standard headers to attach to a 429 (or any rate-limited) response. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const retryAfter = Math.max(0, Math.ceil((result.reset - Date.now()) / 1000));
  return {
    'Retry-After': String(retryAfter),
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
  };
}
