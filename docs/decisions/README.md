# Architecture Decision Records (ADRs)

Nygard-style ADRs. One file per irreversible decision.

## When to write one

- Stack change (framework, DB, host, image provider).
- Schema migration in production.
- Public API shape change.
- Anything you'd find hard to reverse without a re-deploy or data migration.

## Format

`NNNN-<slug>.md` where `NNNN` is a 4-digit zero-padded sequence. Use `docs/decisions/templates/adr.md` as the starting point.

## Status

- **Proposed** — under discussion, not yet decided.
- **Accepted** — in effect, current state of the world.
- **Superseded by NNNN** — replaced by a later decision. Link the successor.
- **Deprecated** — no longer relevant but kept for history.

## Index

| # | Title | Status | Verified |
|---|---|---|---|
| [0001](0001-nextjs-over-vite.md) | Next.js 16.3 over Vite 7 | Accepted | 2026-08-05 (npm `next@16.3.0`) |
| [0002](0002-supabase-as-backend.md) | Supabase as backend (DB + Auth + Storage) | Accepted | 2026-08-05 (npm `@supabase/ssr@0.12.4`) |
| [0003](0003-cloudinary-for-images.md) | Cloudinary for image hosting | Accepted | 2026-08-05 (cloudinary.com/pricing) |
| [0004](0004-vercel-as-host.md) | Vercel as hosting platform | Accepted | 2026-08-05 (vercel.com/pricing) |
| [0005](0005-stack-version-verification-2026-08-05.md) | Stack version audit (no stack change) | Accepted | 2026-08-05 (npm registry + MCP web_search) |
| [0006](0006-public-only-policy.md) | Public-only surface + accessibility conventions | Accepted | 2026-08-05 (no stack change) |
