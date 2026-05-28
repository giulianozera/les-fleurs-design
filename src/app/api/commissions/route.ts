import type { NextRequest } from 'next/server';
import { sendEmail, ADMIN } from '@/lib/resend';

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EDE6DA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EDE6DA;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#3A3733;font-weight:500;">Les Fleurs Design</p>
        </td></tr>
        <tr><td style="background:#FAF7F2;padding:40px;">
          ${body}
        </td></tr>
        <tr><td style="padding:24px 0 0;">
          <p style="margin:0;font-size:11px;color:#6B6661;line-height:1.6;">
            Les Fleurs Design · Miami, FL · <a href="mailto:hello@lesfleursdesign.com" style="color:#6B6661;">hello@lesfleursdesign.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const h1 = (t: string) =>
  `<h1 style="margin:0 0 16px;font-size:28px;font-weight:300;color:#0F0F0F;line-height:1.2;">${t}</h1>`;
const p = (t: string) =>
  `<p style="margin:0 0 12px;font-size:14px;color:#6B6661;line-height:1.8;">${t}</p>`;
const divider = () => `<hr style="border:none;border-top:1px solid #E5DDD3;margin:20px 0;">`;

export async function POST(req: NextRequest) {
  let name: string,
    email: string,
    orgName: string,
    category: string,
    budget: string,
    timeline: string,
    notes: string,
    variant: string;

  try {
    const body = await req.json();
    name = String(body.name ?? '').trim();
    email = String(body.email ?? '').trim();
    orgName = String(body.orgName ?? '').trim();
    category = String(body.category ?? '').trim();
    budget = String(body.budget ?? '').trim();
    timeline = String(body.timeline ?? '').trim();
    notes = String(body.notes ?? '').trim();
    variant = String(body.variant ?? 'business').trim();

    if (!name || !email || !category || !notes) throw new Error();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error();
  } catch {
    return Response.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  const pageLabel = variant === 'interiors' ? 'Interiors' : 'Business';
  const orgLabel = variant === 'interiors' ? 'Firm' : 'Business';

  await sendEmail({
    to: ADMIN,
    subject: `New ${pageLabel} commission — ${orgName || name}`,
    html: layout(`
      ${h1(`New ${pageLabel} commission request.`)}
      ${p(`<strong>Name:</strong> ${name}`)}
      ${p(`<strong>Email:</strong> ${email}`)}
      ${orgName ? p(`<strong>${orgLabel}:</strong> ${orgName}`) : ''}
      ${p(`<strong>${variant === 'interiors' ? 'Project Type' : 'Venue Type'}:</strong> ${category}`)}
      ${divider()}
      ${p(`<strong>Budget:</strong> ${budget}`)}
      ${p(`<strong>Timeline:</strong> ${timeline}`)}
      ${divider()}
      ${p(`<strong>Notes:</strong><br>${notes.replace(/\n/g, '<br>')}`)}
    `),
  });

  return Response.json({ ok: true });
}
