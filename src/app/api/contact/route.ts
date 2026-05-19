import type { NextRequest } from 'next/server';
import { sendEmail, ADMIN } from '@/lib/resend';
import { contactAdminHtml } from '@/lib/emails';

export async function POST(req: NextRequest) {
  let name: string, email: string, subject: string, message: string;
  try {
    const body = await req.json();
    name = String(body.name ?? '').trim();
    email = String(body.email ?? '').trim();
    subject = String(body.subject ?? '').trim();
    message = String(body.message ?? '').trim();
    if (!name || !email || !subject || !message) throw new Error();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error();
  } catch {
    return Response.json({ error: 'Please fill in all fields.' }, { status: 400 });
  }

  await sendEmail({
    to: ADMIN,
    subject: `New message: ${subject}`,
    html: contactAdminHtml({ name, email, subject, message }),
  });

  return Response.json({ ok: true });
}
