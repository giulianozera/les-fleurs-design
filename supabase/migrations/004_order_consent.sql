-- ── Terms of Service consent on orders ───────────────────────────────────────
-- Records that the customer accepted the Terms of Service at checkout and the
-- server-side timestamp of that consent (sourced from the Stripe session
-- metadata stamped in src/app/api/checkout/route.ts).

alter table orders add column if not exists terms_consent boolean;
alter table orders add column if not exists consent_at    timestamptz;
