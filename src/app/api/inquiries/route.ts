import type { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sendEmail, ADMIN } from '@/lib/resend';
import { interiorsInquiryAdminHtml, wholesaleConfirmationHtml } from '@/lib/emails';

export async function POST(req: NextRequest) {
  let name: string,
    business: string,
    role: string,
    email: string,
    phone: string,
    spaceType: string,
    budget: string,
    description: string;

  try {
    const body = await req.json();
    name = String(body.name ?? '').trim();
    business = String(body.business ?? '').trim();
    role = String(body.role ?? '').trim();
    email = String(body.email ?? '').trim();
    phone = String(body.phone ?? '').trim();
    spaceType = String(body.spaceType ?? '').trim();
    budget = String(body.budget ?? '').trim();
    description = String(body.description ?? '').trim();
    if (!name || !business || !email || !description) throw new Error();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error();
  } catch {
    return Response.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

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
