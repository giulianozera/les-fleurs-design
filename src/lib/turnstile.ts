// Cloudflare Turnstile server-side verification.
//
// The contact form sends a `turnstileToken` minted by the invisible widget.
// We verify it here against Cloudflare's siteverify endpoint using the SECRET
// key (server-only). If TURNSTILE_SECRET_KEY is not configured we skip the
// check entirely — so the form keeps working before the keys are added, and the
// honeypot + content validation + rate limit still apply.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const isTurnstileConfigured = Boolean(process.env.TURNSTILE_SECRET_KEY);

export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Not configured → don't block. Other anti-spam layers remain active.
  if (!secret) return true;

  // Configured but no token → fail closed. A real browser with the widget
  // always sends one.
  if (!token || typeof token !== 'string') return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(4000),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[turnstile] siteverify HTTP', res.status);
      return false;
    }
    const data = (await res.json()) as { success?: boolean; ['error-codes']?: string[] };
    if (!data.success) {
      console.warn('[turnstile] verification failed', data['error-codes']);
    }
    return data.success === true;
  } catch (err) {
    // Cloudflare's endpoint is highly available; a failure here is rare. We fail
    // closed (treat as unverified) to keep spam out, and the user sees a
    // friendly "please try again" which succeeds once connectivity returns.
    console.error('[turnstile] verification error', err);
    return false;
  }
}
