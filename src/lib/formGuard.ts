import type { NextRequest } from 'next/server';
import type { z } from 'zod';
import { getClientIp } from './clientIp';
import { rateLimit, rateLimitHeaders } from './rateLimit';
import { isHoneypotFilled } from './antispam';
import { parseBody } from './formSchemas';
import { verifyTurnstile } from './turnstile';

// Shared anti-spam pipeline for public form POST handlers. Order matters:
// cheap/local checks first, the network Turnstile call last.
//
//   1. Per-IP rate limit (durable via Upstash when configured)
//   2. Body-size cap (early Content-Length out + post-read guard)
//   3. Honeypot  → silently "succeed" so the bot learns nothing
//   4. Zod schema + content heuristics (gibberish, disposable email, lengths)
//   5. Turnstile token verification (contact form)

const MAX_BODY_BYTES = 32 * 1024; // 32 KB — far more than any form needs.

interface GuardOptions<S extends z.ZodType> {
  req: NextRequest;
  /** Rate-limit namespace, e.g. "contact". */
  name: string;
  schema: S;
  /** Max submissions per window per IP. Default 3. */
  limit?: number;
  /** Window length in ms. Default 10 minutes. */
  windowMs?: number;
  /** Verify the Cloudflare Turnstile token (contact form). Default false. */
  requireTurnstile?: boolean;
}

type GuardResult<T> =
  | { ok: true; data: T; ip: string }
  | { ok: false; response: Response }
  // Honeypot tripped: the caller should return a normal-looking 200 and do
  // nothing else (no email, no DB write).
  | { ok: 'spam' };

export async function guardForm<S extends z.ZodType>(
  opts: GuardOptions<S>,
): Promise<GuardResult<z.infer<S>>> {
  const { req, name, schema, limit = 3, windowMs = 600_000, requireTurnstile = false } = opts;
  const ip = getClientIp(req);

  // 1. Rate limit.
  const rl = await rateLimit(`${name}:${ip}`, limit, windowMs);
  if (!rl.success) {
    return {
      ok: false,
      response: Response.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429, headers: rateLimitHeaders(rl) },
      ),
    };
  }

  // 2. Body-size cap.
  const declaredLength = Number(req.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return { ok: false, response: Response.json({ error: 'Request too large.' }, { status: 413 }) };
  }

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return { ok: false, response: Response.json({ error: 'Request too large.' }, { status: 413 }) };
    }
    body = JSON.parse(raw);
  } catch {
    return { ok: false, response: Response.json({ error: 'Invalid request.' }, { status: 400 }) };
  }

  // 3. Honeypot — bots that fill every field trip this. Pretend success.
  if (isHoneypotFilled(body)) {
    return { ok: 'spam' };
  }

  // 4. Schema + content validation.
  const parsed = parseBody(schema, body);
  if (!parsed.ok) {
    return { ok: false, response: Response.json({ error: parsed.error }, { status: 400 }) };
  }

  // 5. Turnstile (last — it's a network round-trip).
  if (requireTurnstile) {
    const token = (body as Record<string, unknown>).turnstileToken;
    const verified = await verifyTurnstile(typeof token === 'string' ? token : null, ip);
    if (!verified) {
      return {
        ok: false,
        response: Response.json(
          { error: 'We couldn’t verify your submission. Please try again.' },
          { status: 400 },
        ),
      };
    }
  }

  return { ok: true, data: parsed.data, ip };
}
