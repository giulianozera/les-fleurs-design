import { HONEYPOT_FIELD } from './honeypot';

// Server-side content heuristics for catching bot/spam submissions that get
// past the honeypot, rate limit, and Turnstile. These are a conservative
// BACKSTOP: they favour letting a borderline-real submission through over
// blocking a real customer, because the primary defences (honeypot + Turnstile
// + rate limit) already do the heavy lifting.

// ── Honeypot ──────────────────────────────────────────────────────────────────

// A hidden field that real users never see or fill. Bots that blindly fill
// every input trip it. The name lives in ./honeypot so the client component can
// import it without dragging this module into the browser bundle.
export { HONEYPOT_FIELD };

export function isHoneypotFilled(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const v = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof v === 'string' && v.trim().length > 0;
}

// ── Email validation ──────────────────────────────────────────────────────────

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

// Throwaway / disposable mailbox providers commonly used by spam bots. Not
// exhaustive (no list is) — it's a cheap filter for the worst offenders. Real
// customers virtually never use these for a luxury purchase inquiry.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.biz',
  'sharklasers.com', 'grr.la', 'guerrillamailblock.com', '10minutemail.com',
  '10minutemail.net', 'tempmail.com', 'temp-mail.org', 'tempmailo.com',
  'throwawaymail.com', 'getnada.com', 'nada.email', 'maildrop.cc', 'mailnesia.com',
  'trashmail.com', 'trashmail.de', 'yopmail.com', 'yopmail.net', 'fakeinbox.com',
  'dispostable.com', 'mailcatch.com', 'mintemail.com', 'mohmal.com', 'emailondeck.com',
  'spamgourmet.com', 'mailtemp.net', 'tempinbox.com', 'temp-mail.io', 'moakt.com',
  'inboxkitten.com', 'tmail.io', 'tmailor.com', 'burnermail.io', 'discard.email',
  'maileater.com', 'spam4.me', 'wegwerfemail.de', 'einrot.com', 'fakemailgenerator.com',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

// ── Gibberish / random-string detection ───────────────────────────────────────

// Count lower↔upper case flips inside a token. Random bot strings like
// "bexNxcMoIKryIeDiWmZq" have many; real words (even CamelCase like "JavaScript"
// or "MacBook") have at most a couple.
function caseTransitions(token: string): number {
  let t = 0;
  for (let i = 1; i < token.length; i++) {
    const prev = token[i - 1];
    const cur = token[i];
    const prevLower = prev >= 'a' && prev <= 'z';
    const prevUpper = prev >= 'A' && prev <= 'Z';
    const curLower = cur >= 'a' && cur <= 'z';
    const curUpper = cur >= 'A' && cur <= 'Z';
    if ((prevLower && curUpper) || (prevUpper && curLower)) t++;
  }
  return t;
}

function letterStats(s: string): { len: number; vowelRatio: number; maxConsonantRun: number } {
  const letters = s.toLowerCase().replace(/[^a-z]/g, '');
  if (!letters.length) return { len: 0, vowelRatio: 1, maxConsonantRun: 0 };
  let vowels = 0;
  let run = 0;
  let maxRun = 0;
  for (const ch of letters) {
    if ('aeiou'.includes(ch)) {
      vowels++;
      run = 0;
    } else {
      run++;
      if (run > maxRun) maxRun = run;
    }
  }
  return { len: letters.length, vowelRatio: vowels / letters.length, maxConsonantRun: maxRun };
}

// Conservative: only flags clear randomness. Thresholds are gated on a minimum
// length so ordinary (even unusual, non-English) names and words pass. Examples:
//   "asdkjfhqwerbnm"  -> flagged (no vowels, huge consonant run)
//   "Krzysztof" / "Schwartz" / "Ng" / "Giuliano" -> NOT flagged
export function looksLikeGibberish(text: string): boolean {
  if (!text) return false;

  const tokens = text.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    const { len, maxConsonantRun, vowelRatio } = letterStats(token);
    // Long token that's almost all consonants.
    if (len >= 12 && (maxConsonantRun >= 7 || vowelRatio < 0.12)) return true;
    // Long token with random internal capitalization (e.g. "bexNxcMoIKry").
    if (token.length >= 10 && caseTransitions(token) >= 4) return true;
  }

  // A single long run-on token with no spaces is almost always a bot string —
  // real names are short, real messages have spaces.
  if (tokens.length === 1 && letterStats(tokens[0]).len >= 16) return true;

  // Aggregate signals across the whole string.
  const agg = letterStats(text);
  if (agg.len >= 12 && agg.vowelRatio < 0.18) return true;
  if (agg.maxConsonantRun >= 9) return true;

  return false;
}

// ── Combined free-text check ──────────────────────────────────────────────────

export interface TextCheckOptions {
  /** Minimum trimmed length (after collapsing). Default 1 (presence only). */
  minLength?: number;
  /** Run the gibberish heuristic. Default true. */
  checkGibberish?: boolean;
}

/**
 * Returns a human-readable rejection reason, or null if the text passes.
 * Generic messages avoid telling a bot exactly which filter it tripped.
 */
export function checkText(value: string, opts: TextCheckOptions = {}): string | null {
  const { minLength = 1, checkGibberish = true } = opts;
  const v = value.trim();
  if (v.length < minLength) {
    return minLength > 1
      ? `Please provide a little more detail (at least ${minLength} characters).`
      : 'This field is required.';
  }
  if (checkGibberish && looksLikeGibberish(v)) {
    return 'Your submission looks like it may be spam. Please write in plain language.';
  }
  return null;
}
