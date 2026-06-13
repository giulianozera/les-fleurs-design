import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@lesfleursdesign.com';
export const ADMIN = process.env.RESEND_ADMIN_EMAIL ?? 'lesfleurscompany@gmail.com';

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  // Optional per-message SMTP/MIME headers (e.g. List-Unsubscribe for
  // one-click opt-out on marketing email).
  headers?: Record<string, string>;
}): Promise<void> {
  if (!resend) return;
  const { error } = await resend.emails.send({ from: FROM, ...opts });
  if (error) {
    console.error('Resend send failed:', { to: opts.to, subject: opts.subject, error });
  }
}
