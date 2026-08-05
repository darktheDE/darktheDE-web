# 0005. Stack version verification — 2026-08-05 audit

- **Status:** Accepted
- **Date:** 2026-08-05
- **Last updated:** 2026-08-05 (re-audit after UI review session)
- **Deciders:** Kien Hung
- **Type:** Verification record (not a stack change)

## Context and Problem Statement

Between 2026-08-04 (when ADRs 0001–0004 were written) and today, packages move on. Before sinking more code into a Next.js 16.3 + Tailwind 4 + Supabase + Cloudinary + Vercel stack, we ran an audit to answer:

1. Are the package versions in `package.json` and [spec 001](docs/specs/001-portfolio-rebuild.md) still the **latest stable** as of 2026-08-05?
2. Are the **free-tier limits** cited in the ADRs still accurate?
3. Are there any **better 2026 defaults** we should adopt before writing more code?

This ADR records the audit results. No stack change is proposed — every dependency and vendor in ADRs 0001–0004 is confirmed current.

## Verification method

- `npm view <package> version time.modified` — checks npm registry.
- Web search via Anthropic's MCP web-search tool (queries targeting each vendor's pricing / changelog).
- All findings cross-referenced against the original ADR's "Date" and "Verified" claims.

## Results

### Package versions (vs. spec 001 line 7)

| Package | Spec 001 says | Latest on npm (2026-08-05) | Status |
|---|---|---|---|
| `next` | `16.3.0` | `16.3.0` (modified 2026-08-04) | ✅ exact match |
| `tailwindcss` | `4.3.3` | `4.3.3` (modified 2026-08-04) | ✅ exact match |
| `@tailwindcss/postcss` | (not pinned) | `4.3.3` (modified 2026-08-04) | ✅ auto-aligned with tailwindcss |
| `@next/mdx` | (not pinned) | `16.3.0` (modified 2026-08-04) | ✅ aligned with next major |
| `react-markdown` | `10.1.0` | `10.1.0` (modified 2025-03-07) | ✅ stable; older but no breaking changes pending |
| `@mdx-js/mdx` | `3.1.1` | `3.1.1` | ✅ match |
| `@uiw/react-md-editor` | `4.1.1` | `4.1.1` (modified 2026-05-21) | ✅ maintained but slow-moving (~3 months between releases) |
| `@supabase/ssr` | (not yet pinned — future use) | `0.12.4` (modified 2026-07-28) | ✅ actively maintained |
| `@types/node`, `@types/react`, `@types/react-dom` | (not pinned in spec) | aligned with React 19 / Node 20 | ✅ matches `package.json` |

### Free-tier limits (vs. ADR-0002 / 0003 / 0004)

| Vendor | ADR claim | 2026-08-05 confirmation | Match |
|---|---|---|---|
| Supabase | 500 MB DB / 5 GB egress | 500 MB DB / 5 GB egress / 50K MAU / 1 GB file storage | ✅ |
| Supabase — gotcha | (not noted) | **No mid-tier between Free and $25/mo Pro** | ⚠️ noted |
| Cloudinary | 25 credits / month | 25 credits / month (1 credit = 1 GB storage OR 1 GB bandwidth OR 1K transforms) | ✅ |
| Vercel Hobby | 100 GB transfer | 100 GB bandwidth, non-commercial only, custom domains supported | ✅ |

### Vendor policy / practice (vs. ADR-0004 Hobby note)

- Vercel Hobby explicitly forbids commercial use. Portfolio currently non-commercial — OK. Documented in README + ADR-0004 "Last verified" line.
- Cloudinary free tier has **no expiry** (per cloudinary.com/pricing). Credit-based consumption only.

### Best-practice check — are we using the 2026 canonical approach?

| Concern | Our approach | 2026 canonical | Match |
|---|---|---|---|
| Next.js framework | 16.3.0 + Turbopack (default) | Yes | ✅ |
| Tailwind config | CSS-first `@theme` in `globals.css` | Yes (since v4.0) | ✅ |
| Font loading | `next/font/google` for Fraunces + Inter | Yes (recommended over `@import` in CSS) | ✅ |
| Font — Monaspace Neon | self-hosted `.woff2` via `next/font/local` | Yes — variable font file exists on githubnext/monaspace | ✅ |
| Image hosting | Cloudinary with `f_auto,q_auto` URL params | Yes — best practice for free-tier CDN | ✅ |
| Auth + DB + RLS | Supabase | Yes — most common Next.js 2026 pick | ✅ |
| MDX rendering | `@next/mdx` for static + `next-mdx-remote/rsc` for dynamic posts | Yes | ✅ |
| React Compiler | (not yet enabled — `next.config.ts` has only `reactStrictMode`) | Stable in Next.js 16 (per nextjs.org/docs) | ⚠️ optional — defer until blog ships |

### Web search did NOT confirm

- **`create-next-app` ships `AGENTS.md` bundled** (claimed in ADR-0001 "Why Next.js 16"). Search returned only the standard release notes; no explicit mention of bundled `AGENTS.md`. The claim may still be true but isn't independently verifiable here. Non-blocking — we wrote our own `AGENTS.md` anyway.
- **Lighthouse Performance > 85/90 targets** (spec 001 line 53). Search doesn't validate this — must be measured after deploy.

### Web search surfaced better alternatives

- **`mdxeditor`** (the npm package — *not* MDXEditor the hosted SaaS): does **not** exist on npm (`npm view mdxeditor` → 404). The earlier "alternative" mentioned during ideation is not a real package. `@uiw/react-md-editor` is the right pick.
- **`next-mdx-remote/rsc`** is still the canonical dynamic MDX renderer in 2026; no replacement surfaced.

## Decision Outcome

**No stack change.** All packages and vendors in ADRs 0001–0004 are confirmed current as of 2026-08-05. Spec 001 line 7 (`Stack verified`) is updated with precise `modified` dates so future audits can diff easily.

### Updates applied (2026-08-05)

- [AGENTS.md](../AGENTS.md) — Tailwind version wording sharpened; free-tier numbers replaced with verified 2026-08-05 figures.
- [ADR-0002](0002-supabase-as-backend.md) — "no mid-tier" gotcha added.
- [ADR-0003](0003-cloudinary-for-images.md) — credit equivalence added.
- [ADR-0004](0004-vercel-as-host.md) — non-commercial constraint made explicit; Vercel Analytics added to "Good" list.
- [Spec 001](docs/specs/001-portfolio-rebuild.md) — `Last updated` set to 2026-08-05; precise npm `modified` dates added; two new open questions (editor choice + lazy-load necessity).

### Things deliberately left unchanged

- `@uiw/react-md-editor@4.1.1` for admin — slow-moving but maintained. Ship per spec; revisit after first admin session.
- `next/dynamic` lazy-load for RTIC + Certifications — minor perf benefit, revisit after Lighthouse run.
- React Compiler — optional perf win, defer until blog content exists.

## Re-verification cadence

Run this audit again whenever:

- A new package is added to `package.json`.
- An ADR is touched.
- A vendor publishes a major version (Next.js 17, Tailwind 5, etc.).
- A free tier changes (Supabase / Cloudinary / Vercel — usually announced 60–90 days before).

A quarterly sweep is also fine for solo repos.

## Re-audit 2026-08-05 (post-UI-review session)

After the UI review + a11y hardening session, ran `npm view` against every runtime + dev dep to catch drift introduced by the session.

### Runtime deps (`package.json` deps)

| Package | Current | Latest | Drift | Action |
|---|---|---|---|---|
| `next` | `16.3.0` | `16.3.0` (2026-08-05) | none | — |
| `react` | `19.2.8` | `19.2.8` | none | — |
| `react-dom` | `19.2.8` | `19.2.8` | none | — |
| `tailwindcss` | `^4` | `4.3.3` (2026-08-05) | minor | OK; resolved to 4.3.3 |
| `framer-motion` | `^12.26.2` | `13.0.0` (2026-08-05) | **major** | **upgrade recommended** — see notes |
| `react-icons` | `^5.5.0` | `5.7.0` (2026-06-30) | minor | bump to `^5.7.0` |
| `clsx` | `^2.1.1` | `2.1.1` (2025-06-27) | none | — |
| `tailwind-merge` | `^3.4.0` | `3.6.0` (2026-08-04) | minor | bump to `^3.6.0` |
| `@tailwindcss/postcss` | `^4` | `4.3.3` | minor | OK |

### Dev deps

| Package | Current | Latest | Drift | Action |
|---|---|---|---|---|
| `eslint` | `^9` | `9.x` | none | — |
| `eslint-config-next` | `16.3.0` | `16.3.0` | none | — |
| `@eslint/eslintrc` | `^3` | `3.x` | none | — |
| `@types/node` | `^20` | `20.x` | none | — |
| `@types/react` | `^19` | `19.x` | none | — |
| `@types/react-dom` | `^19` | `19.x` | none | — |
| `typescript` | `^5` | `5.x` | none | — |

### Major bump: framer-motion → 13.0.0

**Migration cost for this repo: low.** Verified via [motion.dev upgrade guide](https://motion.dev/docs/react-upgrade-guide):

- **Breaking change:** `@emotion/is-prop-valid` removed as optional dep, replaced with explicit injection via `<MotionConfig isValidProp={...}>`. Affects users of CSS-in-JS (Styled Components / Emotion). **This repo uses Tailwind utilities only** — no impact.
- **No changes** to: `MotionConfig reducedMotion` prop, `AnimatePresence`, `motion.div`, `motion.img`, `motion.create()`.
- **Package name:** still `framer-motion` on npm (Motion 13.0.0 ships under that name). The "Motion" rebrand applies to v12+ marketing/docs but the npm package is unchanged for now.
- **Recommended action:** bump `framer-motion` from `^12.26.2` → `^13.0.0` in next patch batch. No code changes required.

### Minor bumps: react-icons + tailwind-merge

- **`react-icons@5.7.0`** — minor bump, only icon-pack updates (no API change). Safe to bump.
- **`tailwind-merge@3.6.0`** — adds support for Tailwind v4.3 (we're on 4.3.3 → relevant). Performance optimizations. Safe to bump.

### Tailwind v4.3 in `@tailwindcss/postcss`

Already aligned. No action.

### Decision outcome (re-audit)

- **No stack change.** All packages either current or have safe minor bumps available.
- **Recommended patch:** bump `framer-motion`, `react-icons`, `tailwind-merge` to latest in next maintenance commit. No spec or ADR amendment needed.
- **Re-audit triggered:** every major version published by a core dep (Next.js 17, Tailwind 5, framer-motion 14, React Compiler stable).

## References

- npm registry: `npm view <package> version time.modified`
- [Next.js 16.3 release notes](https://nextjs.org/blog)
- [Tailwind CSS v4 blog post](https://tailwindcss.com/blog/tailwindcss-v4)
- [Supabase pricing](https://supabase.com/pricing)
- [Cloudinary pricing](https://cloudinary.com/pricing) and [credits FAQ](https://cloudinary.com/documentation/developer_onboarding_faq_credits)
- [Vercel pricing](https://vercel.com/pricing) and [Hobby plan](https://vercel.com/docs/plans/hobby)
- [githubnext/monaspace releases](https://github.com/githubnext/monaspace/releases)
- Anthropic MCP `web_search` tool — used for all non-npm confirmations
