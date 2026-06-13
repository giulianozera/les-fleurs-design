import { legalName, mailingAddress, supportEmail, formatMailingAddress } from '@/lib/site-config';
import { signNewsletterEmail } from '@/lib/orderToken';
import { escapeHtml } from '@/lib/escapeHtml';

// All dynamic, user-derived values (customer names, addresses, cart option
// labels, inquiry text, emails) are passed through escapeHtml() before they
// enter the HTML so a crafted submission can't inject links/markup/tracking
// pixels into the inbox. System values (our own URLs, EasyPost label URLs) are
// trusted and left intact.

// ── Shared layout ─────────────────────────────────────────────────────────────

interface LayoutOptions {
  // Marketing email ONLY. When provided, renders a one-click unsubscribe line in
  // the footer. Transactional email (order confirmation/admin/shipped/inquiries)
  // omit this so they never show "unsubscribe" — CAN-SPAM requires the physical
  // address on all commercial email, but the unsubscribe mechanism only applies
  // to messages whose primary purpose is commercial advertising/promotion.
  unsubscribeUrl?: string;
}

function layout(body: string, options: LayoutOptions = {}): string {
  const { unsubscribeUrl } = options;
  // CAN-SPAM §7704(a)(5)(A)(iii): every commercial email must carry the sender's
  // valid physical postal address. We surface the legal entity name + mailing
  // address from the single source of truth in site-config.
  const postalAddress = formatMailingAddress(mailingAddress);

  const unsubscribeLine = unsubscribeUrl
    ? `
          <p style="margin:8px 0 0;font-size:11px;color:#6B6661;line-height:1.6;">
            Don't want these emails? <a href="${unsubscribeUrl}" style="color:#6B6661;">Unsubscribe</a>.
          </p>`
    : '';

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
            ${legalName} · ${postalAddress} · <a href="mailto:${supportEmail}" style="color:#6B6661;">${supportEmail}</a>
          </p>${unsubscribeLine}
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

// First name, escaped, for greetings. Empty string when no name.
const firstName = (name: string) => escapeHtml((name ?? '').split(' ')[0] ?? '');

// ── Order confirmation (to customer) ─────────────────────────────────────────

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  items: { title: string; colorName?: string | null; potName?: string | null; quantity: number; price: number }[];
  totalCents: number;
  shippingMethod?: string;
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  label?: {
    labelUrl: string;
    trackingCode: string;
    carrier: string;
  };
  trackingUrl?: string | null;
  // Magic link (admin email only) to mark the order shipped & notify the customer.
  shipUrl?: string | null;
}

export function orderConfirmationHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#0F0F0F;">
          ${escapeHtml(i.title)}${i.colorName ? ` · ${escapeHtml(i.colorName)}` : ''}${i.potName ? ` · ${escapeHtml(i.potName)}` : ''} × ${i.quantity}
        </td>
        <td align="right" style="padding:8px 0;font-size:13px;color:#0F0F0F;">$${(i.price * i.quantity).toLocaleString()}</td>
      </tr>`,
    )
    .join('');

  const total = (data.totalCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return layout(`
    ${h1(`Thank you${data.customerName ? `, ${firstName(data.customerName)}` : ''}.`)}
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
    ${
      data.label?.trackingCode
        ? `${p(`Your roses will ship within 2–3 business days. Track your order any time:`)}
           ${p(`<strong>${escapeHtml(data.label.carrier || 'Carrier')}:</strong> ${escapeHtml(data.label.trackingCode)}`)}
           ${data.trackingUrl ? btn(data.trackingUrl, 'Track Your Order') : ''}`
        : p('Your roses will be shipped within 2–3 business days. You\'ll receive a tracking number by email once dispatched.')
    }
    ${p('Questions? Reply to this email or reach us at <a href="mailto:hello@lesfleursdesign.com" style="color:#8A6F47;">hello@lesfleursdesign.com</a>')}
  `);
}

// ── Order admin notification ───────────────────────────────────────────────────

export function orderAdminHtml(data: OrderEmailData): string {
  const itemList = data.items
    .map((i) => `${escapeHtml(i.title)} × ${i.quantity} ($${i.price})`)
    .join('<br>');
  const total = (data.totalCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

  const addr = data.shippingAddress;
  const addressBlock = addr
    ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
        .filter(Boolean)
        .map((part) => escapeHtml(part))
        .join(', ')
    : null;

  return layout(`
    ${h1('New order received.')}
    ${p(`<strong>Customer:</strong> ${escapeHtml(data.customerName || '—')} (${escapeHtml(data.customerEmail)})`)}
    ${data.customerPhone ? p(`<strong>Phone:</strong> ${escapeHtml(data.customerPhone)}`) : ''}
    ${addressBlock ? p(`<strong>Ship to:</strong><br>${addressBlock}`) : ''}
    ${p(`<strong>Items:</strong><br>${itemList}`)}
    ${p(`<strong>Total:</strong> $${total}`)}
    ${data.label ? `${divider()}${p(`<strong>Tracking:</strong> ${escapeHtml(data.label.carrier)} · ${escapeHtml(data.label.trackingCode)}`)}${data.label.labelUrl ? btn(data.label.labelUrl, 'Print Shipping Label') : ''}` : `${divider()}${p('<strong>No shipping label was generated</strong> for this order — check EasyPost (account funding / carrier setup) and create the label manually.')}`}
    ${data.shipUrl ? `${p('When you\'ve handed the box to the carrier, mark it shipped — this emails the customer their tracking number:')}${btn(data.shipUrl, 'Mark Shipped &amp; Notify Customer')}` : ''}
  `);
}

// ── Order shipped (to customer) ───────────────────────────────────────────────

export interface ShippedEmailData {
  customerName: string;
  carrier: string;
  trackingCode: string;
  trackingUrl?: string | null;
}

export function orderShippedHtml(data: ShippedEmailData): string {
  return layout(`
    ${h1(`Your order is on its way${data.customerName ? `, ${firstName(data.customerName)}` : ''}.`)}
    ${p('Your preserved roses have been dispatched. Here are your tracking details:')}
    ${divider()}
    ${p(`<strong>${escapeHtml(data.carrier || 'Carrier')}:</strong> ${escapeHtml(data.trackingCode || '—')}`)}
    ${data.trackingUrl ? btn(data.trackingUrl, 'Track Your Order') : ''}
    ${divider()}
    ${p('Questions? Reply to this email or reach us at <a href="mailto:hello@lesfleursdesign.com" style="color:#8A6F47;">hello@lesfleursdesign.com</a>')}
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
    ${p(`Thank you${data.name ? `, ${firstName(data.name)}` : ''}. We review every partner request personally and will get back to you within 1–2 business days.`)}
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
    ${p(`<strong>Name:</strong> ${escapeHtml(data.name)}`)}
    ${p(`<strong>Email:</strong> ${escapeHtml(data.email)}`)}
    ${data.company ? p(`<strong>Company:</strong> ${escapeHtml(data.company)}`) : ''}
    ${data.message ? `${divider()}${p(`<strong>Message:</strong><br>${escapeHtml(data.message).replace(/\n/g, '<br>')}`)}` : ''}
  `);
}

// ── Interiors project inquiry (admin) ─────────────────────────────────────────

export interface InteriorsInquiryData {
  name: string;
  business?: string;
  role?: string;
  email: string;
  phone?: string;
  spaceType?: string;
  budget?: string;
  description: string;
}

export function interiorsInquiryAdminHtml(data: InteriorsInquiryData): string {
  return layout(`
    ${h1('New Interiors inquiry.')}
    ${p(`<strong>Name:</strong> ${escapeHtml(data.name)}${data.role ? ` · ${escapeHtml(data.role)}` : ''}`)}
    ${p(`<strong>Business / Firm:</strong> ${escapeHtml(data.business || '—')}`)}
    ${p(`<strong>Email:</strong> ${escapeHtml(data.email)}`)}
    ${data.phone ? p(`<strong>Phone:</strong> ${escapeHtml(data.phone)}`) : ''}
    ${divider()}
    ${p(`<strong>Type of space:</strong> ${escapeHtml(data.spaceType || '—')}`)}
    ${data.budget ? p(`<strong>Budget / volume:</strong> ${escapeHtml(data.budget)}`) : ''}
    ${divider()}
    ${p(`<strong>Project:</strong><br>${escapeHtml(data.description).replace(/\n/g, '<br>')}`)}
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
    ${h1(`New message: ${escapeHtml(data.subject)}`)}
    ${p(`<strong>From:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})`)}
    ${divider()}
    ${p(escapeHtml(data.message).replace(/\n/g, '<br>'))}
  `);
}

// ── Newsletter welcome (to subscriber) — MARKETING email ──────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lesfleursdesign.com';

// Build the HMAC-signed one-click unsubscribe URL for a subscriber. Returns
// undefined when the signing secret is unavailable, in which case the welcome
// email still renders the required postal address (per CAN-SPAM) but omits the
// unsubscribe link rather than emitting a link that can't be honored.
function unsubscribeUrlFor(email: string): string | undefined {
  const token = signNewsletterEmail(email);
  if (!token) return undefined;
  return `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

export function newsletterWelcomeHtml(email: string): string {
  return layout(
    `
    ${h1('You\'re on the list.')}
    ${p('Be the first to discover new arrangements, seasonal collections, and private previews — before anyone else.')}
    ${divider()}
    ${btn(`${SITE_URL}/shop`, 'Browse the Collection')}
  `,
    { unsubscribeUrl: unsubscribeUrlFor(email) },
  );
}
