-- Migration 001: Posts table for blog
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Date: 2026-08-05
-- Spec: docs/specs/001-portfolio-rebuild.md

-- ============================================================
-- Posts table
-- ============================================================
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_url text,
  body_mdx text not null,           -- MDX source, not compiled
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index posts_slug_idx on posts (slug);
create index posts_status_published_at_idx on posts (status, published_at desc);

-- Auto-update updated_at on row modification
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row
  execute function update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table posts enable row level security;

-- Table permissions
grant usage on schema public to anon, authenticated;
grant select on table posts to anon;
grant all on table posts to authenticated;

-- Anon can read published posts only
create policy "Public reads published posts"
  on posts for select
  to anon
  using (status = 'published');

-- Authenticated users (admin) can do everything
create policy "Authenticated reads/writes all posts"
  on posts for all
  to authenticated
  using (true) with check (true);

-- ============================================================
-- Seed: first post (draft)
-- ============================================================
-- Uncomment to seed a hello-world post after creating your admin user:
--
-- insert into posts (slug, title, excerpt, body_mdx, status)
-- values (
--   'hello-world',
--   'Hello World',
--   'First post from the new portfolio.',
--   '## Hello\n\nThis is the first post on the rebuilt portfolio.\n\nBuilt with Next.js 16 + Tailwind 4 + Supabase + MDX.',
--   'draft'
-- );
