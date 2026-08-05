# Supabase migrations

SQL files to run in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

## Order

| # | File | Purpose | Date |
|---|---|---|---|
| 001 | [001-posts.sql](001-posts.sql) | Posts table + RLS + indexes + updated_at trigger | 2026-08-05 |

## How to apply

1. Create a Supabase project at https://supabase.com/dashboard/new
2. Open SQL Editor
3. Paste contents of each file in order (001, 002, ...)
4. Run each query
5. Verify: `select * from posts;` should return empty table with correct columns

## Seeding

Each migration file has a commented-out seed block at the bottom. Uncomment to seed test data.

## Adding new migrations

1. Create `NNN-<slug>.md` following the numbering pattern
2. Update this README's table
3. Run in Supabase SQL Editor
