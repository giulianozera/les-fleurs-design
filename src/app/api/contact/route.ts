import type { NextRequest } from 'next/server';
import { sendEmail, ADMIN } from '@/lib/resend';
import { contactAdminHtml } from '@/lib/emails';
import { guardForm } from '@/lib/formGuard';
import { contactSchema } from '@/lib/formSchemas';

export async function POST(req: NextRequest) {
  // Rate limit + honeypot + zod/content validation + Turnstile, all in one.
  const guard = await guardForm({
    req,
    name: 'contact',
    schema: contactSchema,
    requireTurnstile: true,
  });
  if (guard.ok === 'spam') return Response.json({ ok: true }); // honeypot — drop silently
  if (!guard.ok) return guard.response;

  const { name, email, subject, message } = guard.data;

  await sendEmail({
    to: ADMIN,
    subject: `New message: ${subject}`,
    html: contactAdminHtml({ name, email, subject, message }),
  });

  return Response.json({ ok: true });
}
