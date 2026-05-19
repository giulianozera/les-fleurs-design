-- Les Fleurs Design — initial schema
-- Run this in Supabase Dashboard → SQL Editor

-- ── Orders ────────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                      uuid primary key default gen_random_uuid(),
  stripe_session_id       text unique not null,
  stripe_payment_intent_id text,
  customer_email          text not null,
  customer_name           text,
  shipping_address        jsonb,
  subtotal_cents          integer not null default 0,
  shipping_cents          integer not null default 0,
  total_cents             integer not null default 0,
  status                  text not null default 'paid'
                            check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ── Order items ───────────────────────────────────────────────────────────────
create table if not exists order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references orders(id) on delete cascade,
  product_id       text not null,
  product_title    text not null,
  color_name       text,
  pot_name         text,
  quantity         integer not null,
  unit_price_cents integer not null,
  image_url        text,
  created_at       timestamptz not null default now()
);

-- ── Newsletter subscribers ────────────────────────────────────────────────────
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

-- ── B2B inquiries ─────────────────────────────────────────────────────────────
create table if not exists b2b_inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  company    text,
  message    text,
  created_at timestamptz not null default now()
);

-- ── updated_at trigger ────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute procedure set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table orders enable row level security;
alter table order_items enable row level security;
alter table newsletter_subscribers enable row level security;
alter table b2b_inquiries enable row level security;

-- Service role bypasses RLS, so webhook writes always work.
-- Public users can only insert into newsletter/b2b tables.
create policy "Anyone can subscribe" on newsletter_subscribers
  for insert with check (true);

create policy "Anyone can submit inquiry" on b2b_inquiries
  for insert with check (true);
