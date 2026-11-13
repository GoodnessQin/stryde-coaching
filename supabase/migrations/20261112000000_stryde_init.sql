-- =====================================================================
-- Stryde Coaching: testimonials CMS, referrals, bookings, admins
-- Run in Supabase SQL editor, or `supabase db push`.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Admins: auth users allowed into /admin
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Testimonials (managed from the admin dashboard)
-- ---------------------------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  credentials text,                       -- line breaks are kept
  body        text not null,              -- paragraphs separated by a blank line
  excerpt     text,                       -- optional shorter text for the homepage card
  photo_url   text,
  featured    boolean not null default false,  -- show on homepage (first 3)
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Referrers: people who requested a referral link
-- ---------------------------------------------------------------------
create table if not exists public.referrers (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  code               text not null unique,
  clicks             integer not null default 0,
  created_at         timestamptz not null default now(),
  last_email_sent_at timestamptz
);
create unique index if not exists referrers_email_key on public.referrers (lower(email));

-- ---------------------------------------------------------------------
-- Bookings: discovery-call requests from the contact form
-- ---------------------------------------------------------------------
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text not null,
  phone         text,
  message       text,
  referrer_id   uuid references public.referrers (id) on delete set null,
  referral_code text,
  status        text not null default 'new'
                check (status in ('new', 'scheduled', 'completed', 'cancelled')),
  admin_notes   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists bookings_referrer_idx on public.bookings (referrer_id);
create index if not exists bookings_created_idx on public.bookings (created_at desc);

-- updated_at triggers
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists testimonials_touch on public.testimonials;
create trigger testimonials_touch before update on public.testimonials
  for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- Public writes (referral sign-up, contact form) go through Edge Functions
-- using the service role, so anon users get no direct write access.
-- ---------------------------------------------------------------------
alter table public.admins       enable row level security;
alter table public.testimonials enable row level security;
alter table public.referrers    enable row level security;
alter table public.bookings     enable row level security;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "public read published testimonials" on public.testimonials;
create policy "public read published testimonials" on public.testimonials
  for select to anon, authenticated using (published or public.is_admin());

drop policy if exists "admins manage testimonials" on public.testimonials;
create policy "admins manage testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage referrers" on public.referrers;
create policy "admins manage referrers" on public.referrers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage bookings" on public.bookings;
create policy "admins manage bookings" on public.bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Public RPCs
-- ---------------------------------------------------------------------
create or replace function public.track_referral_click(p_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.referrers set clicks = clicks + 1 where code = upper(p_code);
$$;

create or replace function public.referral_code_exists(p_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.referrers where code = upper(p_code));
$$;

grant execute on function public.track_referral_click(text) to anon, authenticated;
grant execute on function public.referral_code_exists(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Storage bucket for testimonial photos
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('testimonials', 'testimonials', true)
on conflict (id) do nothing;

drop policy if exists "testimonial photos public read" on storage.objects;
create policy "testimonial photos public read" on storage.objects
  for select using (bucket_id = 'testimonials');

drop policy if exists "testimonial photos admin insert" on storage.objects;
create policy "testimonial photos admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'testimonials' and public.is_admin());

drop policy if exists "testimonial photos admin update" on storage.objects;
create policy "testimonial photos admin update" on storage.objects
  for update to authenticated using (bucket_id = 'testimonials' and public.is_admin());

drop policy if exists "testimonial photos admin delete" on storage.objects;
create policy "testimonial photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'testimonials' and public.is_admin());
