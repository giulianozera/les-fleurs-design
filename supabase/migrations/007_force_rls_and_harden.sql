-- Les Fleurs Design — RLS defense-in-depth
-- Run this in Supabase Dashboard → SQL Editor
--
-- Builds on migration 006 (which dropped the public anon INSERT policies). With
-- RLS enabled and NO policies, the anon/public role is already fully denied on
-- every table — all reads and writes go through the server-side service-role
-- client (getSupabaseAdminClient), which bypasses RLS.
--
-- This migration adds two hardening steps:
--   1. FORCE row level security, so even the table OWNER is subject to policies
--      (the service-role connection still bypasses RLS via its BYPASSRLS role
--      attribute, so server writes keep working — this only closes the implicit
--      owner-exemption gap).
--   2. Pin a non-mutable search_path on the trigger function (resolves the
--      Supabase "function_search_path_mutable" security advisor).

alter table orders                 force row level security;
alter table order_items            force row level security;
alter table newsletter_subscribers force row level security;
alter table b2b_inquiries          force row level security;

alter function set_updated_at() set search_path = '';
