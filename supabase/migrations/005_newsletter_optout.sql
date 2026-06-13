-- ── Newsletter opt-out (CAN-SPAM) ────────────────────────────────────────────
-- Tracks marketing-email consent so honored unsubscribes persist. New rows
-- default to subscribed=true; the unsubscribe link flips the flag to false and
-- stamps unsubscribed_at.

alter table newsletter_subscribers add column if not exists subscribed      boolean     not null default true;
alter table newsletter_subscribers add column if not exists unsubscribed_at  timestamptz;
