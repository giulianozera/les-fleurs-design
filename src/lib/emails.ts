// ── Shared layout ─────────────────────────────────────────────────────────────

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EDE6DA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EDE6DA;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <!-- Logo -->
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#3A3733;font-weight:500;">Les Fleurs Design</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="background:#FAF7F2;padding:40px;">
          ${body}
        </td></tr>
        <!-- Footer -->
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

const h1 = (text: string) =>
  `<h1 style="margin:0 0 16px;font-size:28px;font-weight:300;color:#0F0F0F;line-height:1.2;">${text}</h1>`;

const p = (text: string) =>
  `<p style="margin:0 0 16px;font-size:14px;color:#6B6661;line-height:1.8;">${text}</p>`;

const divider = () =>
  `<hr style="border:none;border-top:1px solid #E5DDD3;margin:24px 0;">`;

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;margin-top:8px;padding:12px 28px;background:#0F0F0F;color:#EDE6DA;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">${label}</a>`;

// ── Order confirmation (to customer) ─────────────────────────────────────────

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  items: { title: string; colorName?: string | null; potName?: string | null; quantity: number; price: number }[];
  totalCents: number;
  shippingMethod?: string;
}

export function orderConfirmationHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#0F0F0F;">
          ${i.title}${i.colorName ? ` · ${i.colorName}` : ''}${i.potName ? ` · ${i.potName}` : ''} × ${i.quantity}
        </td>
        <td align="right" style="padding:8px 0;font-size:13px;color:#0F0F0F;">$${(i.price * i.quantity).toLocaleString()}</td>
      </tr>`,
    )
    .join('');

  const total = (data.totalCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return layout(`
    ${h1(`Thank you${data.customerName ? `, ${data.customerName.split(' ')[0]}` : ''}.`)}
    ${p('Your order has been confirmed. We\'re carefully preparing your arrangement.')}
    ${divider()}
    <table width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>
    ${divider()}
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:13px;font-weight:600;color:#0F0F0F;">Total</td>
        <td align="right" style="font-size:13px;font-weight:600;color:#0F0F0F;">$${total}</td>
      </tr>
    </table>
    ${divider()}
    ${p('Your roses will be shipped within 2–3 business days. You\'ll receive a tracking number by email once dispatched.')}
    ${p('Questions? Reply to this email or reach us at <a href="mailto:hello@lesfleursdesign.com" style="color:#8A6F47;">hello@lesfleursdesign.com</a>')}
  `);
}

// ── Order admin notification ───────────────────────────────────────────────────

export function orderAdminHtml(data: OrderEmailData): string {
  const itemList = data.items
    .map((i) => `${i.title} × ${i.quantity} ($${i.price})`)
    .join('<br>');
  const total = (data.totalCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return layout(`
    ${h1('New order received.')}
    ${p(`<strong>Customer:</strong> ${data.customerName || '—'} (${data.customerEmail})`)}
    ${p(`<strong>Items:</strong><br>${itemList}`)}
    ${p(`<strong>Total:</strong> $${total}`)}
  `);
}

// ── Wholesale inquiry confirmation (to customer) ───────────────────────────────

export interface WholesaleEmailData {
  name: string;
  company?: string;
  calLink: string;
}

export function wholesaleConfirmationHtml(data: WholesaleEmailData): string {
  return layout(`
    ${h1('We received your inquiry.')}
    ${p(`Thank you${data.name ? `, ${data.name.split(' ')[0]}` : ''}. We review every partner request personally and will get back to you within 1–2 business days.`)}
    ${divider()}
    ${p('Want to connect sooner? Book a 30-minute call directly:')}
    ${btn(data.calLink, 'Schedule a Call')}
    ${divider()}
    ${p('hello@lesfleursdesign.com')}
  `);
}

// ── Wholesale admin notification ──────────────────────────────────────────────

export interface WholesaleAdminData {
  name: string;
  email: string;
  company?: string;
  message?: string;
}

export function wholesaleAdminHtml(data: WholesaleAdminData): string {
  return layout(`
    ${h1('New wholesale inquiry.')}
    ${p(`<strong>Name:</strong> ${data.name}`)}
    ${p(`<strong>Email:</strong> ${data.email}`)}
    ${data.company ? p(`<strong>Company:</strong> ${data.company}`) : ''}
    ${data.message ? `${divider()}${p(`<strong>Message:</strong><br>${data.message.replace(/\n/g, '<br>')}`)}` : ''}
  `);
}

// ── Contact admin notification ────────────────────────────────────────────────

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function contactAdminHtml(data: ContactEmailData): string {
  return layout(`
    ${h1(`New message: ${data.subject}`)}
    ${p(`<strong>From:</strong> ${data.name} (${data.email})`)}
    ${divider()}
    ${p(data.message.replace(/\n/g, '<br>'))}
  `);
}

// ── Newsletter welcome (to subscriber) ────────────────────────────────────────

export function newsletterWelcomeHtml(): string {
  return layout(`
    ${h1('You\'re on the list.')}
    ${p('Be the first to discover new arrangements, seasonal collections, and private previews — before anyone else.')}
    ${divider()}
    ${btn('https://lesfleursdesign.com/shop', 'Browse the Collection')}
  `);
}
