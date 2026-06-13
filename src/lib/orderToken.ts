import crypto from 'node:crypto';

// HMAC-signed, per-order action tokens. Used for the "mark shipped & notify
// customer" magic link in the admin email — no login required, but only the
// holder of ORDER_ACTION_SECRET (the server) can mint a valid token.
const SECRET = process.env.ORDER_ACTION_SECRET;

// Order-action tokens expire after this many ms so a leaked magic link (e.g.
// forwarded admin email) can't be used to "mark shipped & notify" forever.
const ORDER_ACTION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// Token format: "<expMs>.<hmac(orderId + '.' + expMs)>". The expiry is carried
// in the clear and bound into the signature, so it can't be tampered with — a
// forged expiry changes the payload and fails verification.
export function signOrderAction(orderId: string): string | null {
  if (!SECRET) return null;
  const expMs = Date.now() + ORDER_ACTION_TTL_MS;
  const sig = crypto.createHmac('sha256', SECRET).update(`${orderId}.${expMs}`).digest('hex');
  return `${expMs}.${sig}`;
}

export function verifyOrderAction(orderId: string, token: string): boolean {
  if (!SECRET || !token) return false;

  const sep = token.indexOf('.');
  if (sep <= 0) return false;

  const expPart = token.slice(0, sep);
  const sig = token.slice(sep + 1);

  const expMs = Number(expPart);
  if (!Number.isFinite(expMs) || !sig) return false;

  // Reject expired tokens.
  if (Date.now() > expMs) return false;

  const expected = crypto.createHmac('sha256', SECRET).update(`${orderId}.${expMs}`).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// HMAC-signed newsletter unsubscribe tokens. The one-click unsubscribe link in
// marketing email carries this token so only the server (holder of the secret)
// can mint a valid opt-out URL — prevents anyone from unsubscribing arbitrary
// addresses by guessing the URL. Email is normalized (trim + lowercase) before
// signing so the token matches regardless of casing/whitespace in the link.
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function signNewsletterEmail(email: string): string | null {
  if (!SECRET) return null;
  return crypto.createHmac('sha256', SECRET).update(normalizeEmail(email)).digest('hex');
}

export function verifyNewsletterEmail(email: string, token: string): boolean {
  const expected = signNewsletterEmail(email);
  if (!expected || !token) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
