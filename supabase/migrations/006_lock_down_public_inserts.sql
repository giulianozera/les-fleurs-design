-- Les Fleurs Design — lock down public (anon) inserts
-- Run this in Supabase Dashboard → SQL Editor
--
-- Migration 001 granted the anon/public role direct INSERT access to the
-- newsletter_subscribers and b2b_inquiries tables. That is no longer needed and
-- is an abuse vector: anyone with the public anon key could write arbitrary rows
-- straight into these tables, bypassing our validation, rate limiting, and email
-- notifications.
--
-- All writes now go exclusively through our server-side API routes
-- (api/newsletter, api/inquiries, api/wholesale, …), which use the Supabase
-- service-role client (getSupabaseAdminClient). The service role bypasses RLS,
-- so dropping these public-insert policies does NOT break those server writes —
-- it only removes the ability for untrusted clients to insert directly.

drop policy if exists "Anyone can subscribe" on newsletter_subscribers;
drop policy if exists "Anyone can submit inquiry" on b2b_inquiries;
