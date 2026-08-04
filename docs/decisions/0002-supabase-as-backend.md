# 0002. Supabase as backend (DB + Auth + Storage)

- **Status:** Accepted
- **Date:** 2026-08-04
- **Deciders:** Kien Hung

## Context and Problem Statement

We need: Postgres for blog post metadata, Auth for admin login, Storage for image uploads, RLS for security. We want this on a free tier with a real chance of surviving the first 6 months of a personal site without surprise bills.

Options: self-host Postgres (Heroku, Railway, Fly.io), Neon (serverless Postgres), Turso (libSQL/SQLite at edge), Supabase (Postgres + Auth + Storage + RLS + Edge Functions all-in-one), or a headless CMS like Sanity/Contentful that absorbs the DB concern.

## Considered Options

- **A: Supabase Free** — Postgres + Auth + Storage + RLS in one.
- **B: Neon Free + Clerk Auth + UploadThing Storage** — best-of-breed, more moving parts.
- **C: Sanity (headless CMS)** — opinionated content model, great DX, but no RLS / no direct SQL access.
- **D: Turso (libSQL) + Clerk** — edge-first, SQLite semantics.

## Decision Outcome

**Chosen option: A (Supabase)**, because one vendor for DB + Auth + Storage + RLS is the minimum moving-parts setup. RLS gives us a real security boundary for the admin route. Image storage doubles as a backup option if Cloudinary's free tier turns out insufficient (we chose Cloudinary separately for transforms — see ADR 0003).

### Consequences

- **Good:** One console, one set of env vars, one auth flow.
- **Good:** RLS policies are declarative SQL — auditable.
- **Good:** Edge Functions available if we need a webhook (e.g., on publish → trigger ISR revalidation).
- **Bad:** Free tier is 5 GB egress / month — modest. Need to monitor.
- **Bad:** Free tier has NO image transformations (costs compute on Pro $25/mo). That's why we chose Cloudinary separately.
- **Risks:** Vendor lock-in. Mitigation: keep schema simple, document `posts` table DDL in this repo, dump periodically.
- **Risks:** Free-tier limits could change. Mitigation: monitor with Vercel Analytics + Supabase dashboard; migrate to Neon if needed (Postgres-compatible).

### Confirmation

- Admin login works via Supabase Auth (email + password for v1).
- A `SELECT` on `posts` as anon returns only `status = 'published'` rows (RLS working).
- 1 GB free storage is enough for ~500 blog-sized images (assuming 2 MB each).

## Pros and Cons of the Options

### Option A: Supabase Free

- Good, because all-in-one reduces context switching.
- Good, because RLS is the right abstraction for "public read, admin write".
- Bad, because egress is only 5 GB / month on free.
- Bad, because image transformations not included (need Pro or external CDN).

### Option B: Neon + Clerk + UploadThing

- Good, because Neon has generous free tier for Postgres specifically (0.5 GB, but 100 CU-hrs).
- Good, because Clerk Auth is polished.
- Bad, because 3 vendors = 3 sets of env vars, 3 dashboards, 3 bills if we ever scale.
- Bad, because RLS doesn't exist in Neon — we'd code auth checks in Clerk + middleware.

### Option C: Sanity

- Good, because Studio (admin UI) is built-in and polished.
- Good, because Portable Text is great for structured content.
- Bad, because content is a proprietary format — harder to grep / diff / move.
- Bad, because no direct SQL queries — would need to learn GROQ.

### Option D: Turso

- Good, because edge-first = low latency.
- Good, because SQLite semantics are simple.
- Bad, because Postgres compatibility is partial (libSQL dialect) — no `gen_random_uuid()`, no RLS, etc.
- Bad, because ecosystem is smaller; integrations with Next.js are less mature.

## References

- https://supabase.com/pricing
- https://supabase.com/docs/guides/auth/server-side/nextjs
- https://neon.com/pricing (alternative considered)
- ADR 0003 (why we still need Cloudinary for image transforms)
