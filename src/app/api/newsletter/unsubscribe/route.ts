import type { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { verifyNewsletterEmail } from '@/lib/orderToken';
import { legalName, supportEmail } from '@/lib/site-config';

// One-click unsubscribe for the newsletter (CAN-SPAM opt-out).
//
// The link is emitted only on marketing email (see newsletterWelcomeHtml). It
// carries an HMAC token over the recipient's email so we honor opt-outs without
// a login, while a guessed/forged URL cannot unsubscribe an arbitrary address.
// On a valid token we flip the subscriber to subscribed=false and stamp
// unsubscribed_at. We return a small branded HTML confirmation page either way
// the request succeeds, and a 400 when the token is missing/invalid.

function htmlPage(opts: { status: number; heading: string; body: string }): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${opts.heading} · ${legalName}</title>
</head>
<body style="margin:0;padding:0;background:#EDE6DA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EDE6DA;padding:64px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#3A3733;font-weight:500;">Les Fleurs Design</p>
        </td></tr>
        <tr><td style="background:#FAF7F2;padding:48px 40px;">
          <h1 style="margin:0 0 16px;font-size:26px;font-weight:300;color:#0F0F0F;line-height:1.2;">${opts.heading}</h1>
          <p style="margin:0;font-size:14px;color:#6B6661;line-height:1.8;">${opts.body}</p>
        </td></tr>
        <tr><td style="padding:24px 0 0;">
          <p style="margin:0;font-size:11px;color:#6B6661;line-height:1.6;">
            ${legalName} · <a href="mailto:${supportEmail}" style="color:#6B6661;">${supportEmail}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return new Response(html, {
    status: opts.status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// Flips a verified subscriber to opted-out. Returns null on success, or an error
// string when the database write fails. Shared by the GET confirmation page and
// the RFC 8058 one-click POST.
async function unsubscribeEmail(email: string): Promise<{ error: true } | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
    .eq('email', email);

  if (error) {
    console.error('Newsletter unsubscribe failed:', { email, error });
    return { error: true };
  }
  return null;
}

export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get('email') ?? '').trim().toLowerCase();
  const token = req.nextUrl.searchParams.get('token') ?? '';

  // A valid token is mandatory — without it we never touch the database.
  if (!email || !verifyNewsletterEmail(email, token)) {
    return htmlPage({
      status: 400,
      heading: 'Invalid link.',
      body: `This unsubscribe link is invalid or has expired. If you continue to receive emails you'd rather not, contact us at <a href="mailto:${supportEmail}" style="color:#8A6F47;">${supportEmail}</a> and we'll remove you right away.`,
    });
  }

  const result = await unsubscribeEmail(email);
  if (result?.error) {
    return htmlPage({
      status: 500,
      heading: 'Something went wrong.',
      body: `We couldn't process your request just now. Please try again, or email us at <a href="mailto:${supportEmail}" style="color:#8A6F47;">${supportEmail}</a> and we'll take care of it.`,
    });
  }

  return htmlPage({
    status: 200,
    heading: 'You’re unsubscribed.',
    body: `You won’t receive any more marketing emails from us. We’re sorry to see you go — you’re always welcome back. Questions? Reach us at <a href="mailto:${supportEmail}" style="color:#8A6F47;">${supportEmail}</a>.`,
  });
}

// RFC 8058 one-click unsubscribe. Mail clients (Gmail, Apple Mail, …) POST to
// the List-Unsubscribe URL with body "List-Unsubscribe=One-Click" when the user
// hits the native "Unsubscribe" button. There is no human viewing a page here,
// so we return small JSON status responses rather than the branded HTML page.
export async function POST(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get('email') ?? '').trim().toLowerCase();
  const token = req.nextUrl.searchParams.get('token') ?? '';

  if (!email || !verifyNewsletterEmail(email, token)) {
    return Response.json({ error: 'Invalid or expired unsubscribe link.' }, { status: 400 });
  }

  const result = await unsubscribeEmail(email);
  if (result?.error) {
    return Response.json({ error: 'Could not process unsubscribe.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
