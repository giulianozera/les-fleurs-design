import type { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sendEmail, ADMIN } from '@/lib/resend';
import { interiorsInquiryAdminHtml, wholesaleConfirmationHtml } from '@/lib/emails';
import { guardForm } from '@/lib/formGuard';
import { inquirySchema } from '@/lib/formSchemas';

export async function POST(req: NextRequest) {
  const guard = await guardForm({ req, name: 'inquiries', schema: inquirySchema });
  if (guard.ok === 'spam') return Response.json({ ok: true });
  if (!guard.ok) return guard.response;

  const { name, business, role, email, phone, spaceType, budget, description } = guard.data;

  // Save to Supabase (requires migration 003 for the extra columns).
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from('b2b_inquiries').insert({
        name,
        email,
        company: business,
        message: description,
        role: role || null,
        phone: phone || null,
        space_type: spaceType || null,
        budget: budget || null,
      });
    } catch (err) {
      console.error('[inquiries] supabase insert error', err);
    }
  }

  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'https://cal.com';

  await Promise.all([
    sendEmail({
      to: email,
      subject: 'We received your inquiry — Les Fleurs Design',
      html: wholesaleConfirmationHtml({ name, company: business, calLink }),
    }),
    sendEmail({
      to: ADMIN,
      subject: `New Interiors inquiry — ${business || name}`,
      html: interiorsInquiryAdminHtml({ name, business, role, email, phone, spaceType, budget, description }),
    }),
  ]);

  return Response.json({ ok: true });
}
