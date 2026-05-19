import type { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sendEmail, ADMIN } from '@/lib/resend';
import { wholesaleConfirmationHtml, wholesaleAdminHtml } from '@/lib/emails';

export async function POST(req: NextRequest) {
  let name: string, email: string, company: string, message: string;
  try {
    const body = await req.json();
    name = String(body.name ?? '').trim();
    email = String(body.email ?? '').trim();
    company = String(body.company ?? '').trim();
    message = String(body.message ?? '').trim();
    if (!name || !email || !message) throw new Error();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error();
  } catch {
    return Response.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    await supabase.from('b2b_inquiries').insert({ name, email, company, message });
  }

  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'https://cal.com';

  await Promise.all([
    sendEmail({
      to: email,
      subject: 'We received your inquiry — Les Fleurs Design',
      html: wholesaleConfirmationHtml({ name, company, calLink }),
    }),
    sendEmail({
      to: ADMIN,
      subject: `New wholesale inquiry — ${company || name}`,
      html: wholesaleAdminHtml({ name, email, company, message }),
    }),
  ]);

  return Response.json({ ok: true });
}
