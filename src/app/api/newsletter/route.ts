import type { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sendEmail, ADMIN } from '@/lib/resend';
import { newsletterWelcomeHtml } from '@/lib/emails';

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = String(body.email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error();
  } catch {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })
      .select()
      .single();

    if (error?.code === '23505') {
      // Already subscribed — treat as success silently
      return Response.json({ ok: true });
    }
  }

  await Promise.all([
    sendEmail({
      to: email,
      subject: 'Welcome to Les Fleurs Design',
      html: newsletterWelcomeHtml(),
    }),
    sendEmail({
      to: ADMIN,
      subject: `New subscriber: ${email}`,
      html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
    }),
  ]);

  return Response.json({ ok: true });
}
