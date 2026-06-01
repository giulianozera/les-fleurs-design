-- ── B2B inquiry: richer fields ───────────────────────────────────────────────
-- The Interiors project-inquiry form captures role, phone, type of space, and
-- estimated budget/volume in addition to name/email/company/message.

alter table b2b_inquiries add column if not exists role       text;
alter table b2b_inquiries add column if not exists phone      text;
alter table b2b_inquiries add column if not exists space_type text;
alter table b2b_inquiries add column if not exists budget     text;
