-- =====================================================================
--  THE FATHER INTELLIGENCE — report store
--  Run once in the Supabase SQL editor. Safe to re-run.
-- =====================================================================

create extension if not exists "pgcrypto";

do $$ begin
  create type report_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_visibility as enum ('members', 'public');
exception when duplicate_object then null; end $$;

create table if not exists reports (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,

  title             text not null,
  excerpt           text not null default '',

  -- body_raw is exactly what was pasted, kept so the admin can re-edit the
  -- original. body_md is the normalised markdown that gets rendered.
  body_raw          text not null,
  body_md           text not null,

  category          text not null default 'markets',
  framework_version text,
  session_label     text,
  report_date       date not null default current_date,

  status            report_status not null default 'draft',
  visibility        report_visibility not null default 'members',

  author_name       text not null default 'The Father',
  created_by        text,

  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists reports_feed_idx
  on reports (status, report_date desc, published_at desc nulls last);

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists reports_touch_updated_at on reports;
create trigger reports_touch_updated_at
  before update on reports
  for each row execute function touch_updated_at();

-- All reads happen server-side with the service-role key. RLS is enabled so
-- that if the anon key is ever used from a browser, drafts stay private.
alter table reports enable row level security;

drop policy if exists "published reports are readable" on reports;
create policy "published reports are readable"
  on reports for select
  using (status = 'published');
