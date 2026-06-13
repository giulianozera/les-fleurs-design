import type { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sendEmail, ADMIN } from '@/lib/resend';
import { newsletterWelcomeHtml } from '@/lib/emails';
import { signNewsletterEmail } from '@/lib/orderToken';
import { guardForm } from '@/lib/formGuard';
import { newsletterSchema } from '@/lib/formSchemas';
import { escapeHtml } from '@/lib/escapeHtml';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lesfleursdesign.com';

export async function POST(req: NextRequest) {
  const guard = await guardForm({ req, name: 'newsletter', schema: newsletterSchema });
  if (guard.ok === 'spam') return Response.json({ ok: true });
  if (!guard.ok) return guard.response;

  const { email } = guard.data;

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, subscribed: true })
      .select()
      .single();

    if (error?.code === '23505') {
      // Already subscribed — treat as success silently
      return Response.json({ ok: true });
    }
  }

  // One-click unsubscribe (RFC 8058) — the HMAC token lets us honor opt-outs
  // without a login while preventing forged opt-outs of arbitrary addresses.
  const unsubToken = signNewsletterEmail(email);
  const welcomeHeaders = unsubToken
    ? (() => {
        const unsubUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(
          email,
        )}&token=${unsubToken}`;
        return {
          'List-Unsubscribe': `<${unsubUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        };
      })()
    : undefined;

  await Promise.all([
    // Welcome (marketing) email carries the List-Unsubscribe headers.
    sendEmail({
      to: email,
      subject: 'Welcome to Les Fleurs Design',
      html: newsletterWelcomeHtml(email),
      headers: welcomeHeaders,
    }),
    // Admin notification is transactional — no unsubscribe headers.
    sendEmail({
      to: ADMIN,
      subject: `New subscriber: ${email}`,
      html: `<p>New newsletter subscriber: <strong>${escapeHtml(email)}</strong></p>`,
    }),
  ]);

  return Response.json({ ok: true });
}
