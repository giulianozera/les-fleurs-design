import type { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sendEmail, ADMIN } from '@/lib/resend';
import { wholesaleConfirmationHtml, wholesaleAdminHtml } from '@/lib/emails';
import { guardForm } from '@/lib/formGuard';
import { wholesaleSchema } from '@/lib/formSchemas';

export async function POST(req: NextRequest) {
  const guard = await guardForm({ req, name: 'wholesale', schema: wholesaleSchema });
  if (guard.ok === 'spam') return Response.json({ ok: true });
  if (!guard.ok) return guard.response;

  const { name, email, company, message } = guard.data;

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
