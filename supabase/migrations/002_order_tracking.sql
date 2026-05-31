-- ── Order fulfillment / shipping tracking ────────────────────────────────────
-- Adds persistence for the EasyPost label + tracking so a missed admin email
-- never loses the label, and records when the order was dispatched.

alter table orders add column if not exists tracking_code text;
alter table orders add column if not exists label_url     text;
alter table orders add column if not exists carrier       text;
alter table orders add column if not exists shipped_at    timestamptz;
