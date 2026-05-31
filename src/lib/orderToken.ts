import crypto from 'node:crypto';

// HMAC-signed, per-order action tokens. Used for the "mark shipped & notify
// customer" magic link in the admin email — no login required, but only the
// holder of ORDER_ACTION_SECRET (the server) can mint a valid token.
const SECRET = process.env.ORDER_ACTION_SECRET;

export function signOrderAction(orderId: string): string | null {
  if (!SECRET) return null;
  return crypto.createHmac('sha256', SECRET).update(orderId).digest('hex');
}

export function verifyOrderAction(orderId: string, token: string): boolean {
  const expected = signOrderAction(orderId);
  if (!expected || !token) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
