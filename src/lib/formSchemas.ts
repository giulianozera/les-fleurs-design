import { z } from 'zod';
import {
  HONEYPOT_FIELD,
  isDisposableEmail,
  isValidEmail,
  looksLikeGibberish,
} from './antispam';

// Zod schemas for every public form endpoint. These enforce structure AND size
// (max lengths cap memory/DoS and oversized-email payloads), validate the email,
// reject disposable domains, and flag gibberish names/messages — all in one
// `safeParse`. The honeypot and Turnstile token are accepted but handled
// separately in the route (the honeypot is dropped silently so bots learn
// nothing; Turnstile is verified against Cloudflare).

// ── Reusable fields ───────────────────────────────────────────────────────────

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Please enter a valid email address.')
  .refine(isValidEmail, 'Please enter a valid email address.')
  .refine((e) => !isDisposableEmail(e), 'Please use a non-disposable email address.');

const personName = z
  .string()
  .trim()
  .min(1, 'Please enter your name.')
  .max(100, 'That name is too long.')
  .refine((v) => !looksLikeGibberish(v), 'Please enter a real name.');

const longText = (min: number, label = 'message') =>
  z
    .string()
    .trim()
    .min(min, `Please provide a little more detail (at least ${min} characters).`)
    .max(5000, `That ${label} is too long.`)
    .refine((v) => !looksLikeGibberish(v), 'Your submission looks like spam. Please write in plain language.');

const shortOptional = (max = 200) => z.string().trim().max(max).optional().default('');
const shortRequired = (max = 200, msg = 'This field is required.') =>
  z.string().trim().min(1, msg).max(max);

// Honeypot + Turnstile are optional on every schema. `.passthrough()`-free:
// we list them explicitly so unknown keys are stripped.
const antiSpamFields = {
  [HONEYPOT_FIELD]: z.string().max(200).optional(),
  turnstileToken: z.string().max(4096).optional(),
};

// ── Per-endpoint schemas ──────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: personName,
  email,
  subject: shortRequired(200, 'Please choose a subject.'),
  message: longText(10),
  ...antiSpamFields,
});

export const commissionSchema = z.object({
  name: personName,
  email,
  orgName: shortOptional(200),
  category: shortRequired(200, 'Please choose a category.'),
  budget: shortOptional(100),
  timeline: shortOptional(100),
  notes: longText(10, 'note'),
  variant: z.enum(['business', 'interiors']).default('business'),
  ...antiSpamFields,
});

export const inquirySchema = z.object({
  name: personName,
  business: shortRequired(200, 'Please enter your business or firm name.'),
  role: shortOptional(120),
  email,
  phone: shortOptional(50),
  spaceType: shortRequired(120, 'Please choose a type of space.'),
  budget: shortOptional(200),
  description: longText(10, 'description'),
  ...antiSpamFields,
});

export const wholesaleSchema = z.object({
  name: personName,
  email,
  company: shortOptional(200),
  message: longText(10),
  ...antiSpamFields,
});

export const newsletterSchema = z.object({
  email,
  ...antiSpamFields,
});

// ── Parse helper ──────────────────────────────────────────────────────────────

export type ParseResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function parseBody<S extends z.ZodType>(schema: S, body: unknown): ParseResult<z.infer<S>> {
  const result = schema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };
  const first = result.error.issues[0];
  return { ok: false, error: first?.message ?? 'Please check the form and try again.' };
}
