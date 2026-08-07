# Implementation log

Chronological record of what shipped. One entry per non-trivial session.

Format: `YYYY-MM-DD-session-N-<topic>.md` linking to the session-or-equivalent. Each entry captures:

- What was built (concrete files / functions)
- Why this approach (link to ADR / spec)
- What was deliberately left out (scope guard)
- Open questions / follow-ups

## Index

| Date | Topic | Specs / ADRs touched |
|---|---|---|
| 2026-08-04 | Bootstrap + ADR foundation | ADR-0001, ADR-0002, ADR-0003, ADR-0004 |
| 2026-08-05 | Stack audit + ADR-0005 | ADR-0005, spec 001 (updated) |
| 2026-08-05 | MVP clone (5 sections) + foundation cleanup | spec 001, AGENTS.md |
| 2026-08-05 | UI review + a11y hardening | spec 002, ADR-0006 |
| 2026-08-05 | Docs infrastructure + websearch stack re-audit + dep bumps | docs/process/*, ADR-0005 (re-audit), AGENTS.md, CLAUDE.md, README |
| 2026-08-05 | Phases 7-6-8: Supabase + Blog + Admin (full MVP spec 001) | spec 001 (phases 6-8 shipped) |
| 2026-08-05 | 404 page + CI pipeline + stale cleanup + deploy docs | spec 001 (404 done), AGENTS.md, docs/supabase/, .github/ |
| 2026-08-06 | Admin login UI + Supabase auth redirect & table GRANTs | spec 001, docs/supabase/, docs/deploy/ |
| 2026-08-07 | Lighthouse performance + SEO hardening | docs/process/implementation-log |

## Entries

### 2026-08-04 — Bootstrap + ADR foundation

Decided stack (Next.js 16.3 + Tailwind 4 + Supabase + Cloudinary + Vercel Hobby). Wrote 4 ADRs. Initialized repo. Did not write code yet.

Key files: [docs/decisions/0001-nextjs-over-vite.md](../decisions/0001-nextjs-over-vite.md), [0002](../decisions/0002-supabase-as-backend.md), [0003](../decisions/0003-cloudinary-for-images.md), [0004](../decisions/0004-vercel-as-host.md). Spec 001 drafted.

### 2026-08-05 — Stack audit (ADR-0005)

Web-searched + `npm view` to confirm all package versions and free-tier limits are current as of 2026-08-05. No stack change. Refined ADR wording with verified numbers.

See [ADR-0005](../decisions/0005-stack-version-verification-2026-08-05.md).

### 2026-08-05 — MVP clone (5 sections)

Cloned 5 sections from old `darktheDE-portfolio/` repo, y chang:

- Navbar (sticky pill, scroll-aware, mobile menu)
- Hero (thesis + 5 focus tags + 3 CTAs)
- BentoGrid (About + Signal + Stack + Projects filter + lightbox)
- RTICSection (community + photo lightbox)
- CertificationsSection (6 filter categories + grid + lightbox)
- Footer

Used MVP-compat tokens (`bg-background`, `bg-primary`, `text-text-light` aliased to dark palette vars) so cloned components render without raw hex.

Infrastructure cleanup: git init, `.env.local.example`, `LICENSE`, `eslint.config.mjs`, `public/` assets, Git LFS for binary assets. Skipped Monaspace Neon `.woff2` download (CDN blocked).

Decisions: dropped `next/dynamic` lazy-load for RTIC + Certifications in MVP (both static data; lazy-load adds Suspense complexity for marginal benefit). Deferred to post-deploy Lighthouse.

### 2026-08-05 — UI review + a11y hardening

Ran `ui-ux-pro-max` review across all 5 components. Findings:

| Severity | Finding | Fix |
|---|---|---|
| `[!]` | 7 raw `<img>` tags | Swap to `next/image` |
| `[!]` | Profile carousel alt never changes | Dynamic alt per frame |
| `[!]` | Carousel no pause on hover | Add `isPaused` state |
| `[!]` | Navbar/lightbox z-50 collision | Lightbox → `z-[var(--z-lightbox)]` (60) |
| `[!]` | No `prefers-reduced-motion` | CSS `@media` + framer `MotionConfig` at root |
| `[~]` | Zoom buttons missing aria-label | `aria-label={\`Open ${title} details\`}` |
| `[~]` | Hero h1 missing SR label | `aria-label` on h1, `aria-hidden` on span |
| `[~]` | Metric tiles `bg-ink/60` over ink = wash | Solid `bg-ink` |
| `[~]` | `--color-mute: #6e7b8c` low contrast on small caps | Bump to `#8a99ad` (≈6.5:1 AAA) |
| `[~]` | Lightbox no focus trap | Reusable `useFocusTrap` hook + 3 wirings |

Built:
- `src/lib/useFocusTrap.ts` (reusable hook, 60 lines, no deps)
- `src/app/Providers.tsx` (MotionConfig wrapper)
- `--z-nav/--z-lightbox/--z-skiplink` tokens in `globals.css`

`npm run verify` green after each batch.

Open follow-ups (not in this batch):
- React Compiler (optional, defer to blog content)
- Lazy-load lightbox images (spec 001 open question)
- Lint re-add to `verify` (await `next/core-web-vitals` flat-config)
- Lighthouse measurement against actual deployed URL

### 2026-08-05 — Docs infrastructure + websearch stack re-audit + dep bumps

Built the missing `docs/process/` directory (process docs were implied but never written):

- `docs/process/README.md` — index + "when to write here" rules
- `docs/process/workflow.md` — canonical loop for non-trivial tasks (spec → implement → verify → log)
- `docs/process/ui-review-checklist.md` — pre-delivery a11y/perf/motion checklist (10 sections, copy-paste friendly)
- `docs/process/implementation-log.md` — this file
- `docs/process/templates/retrospective.md` — template for future retros

Wrote new spec + ADR capturing the previous session's work:

- [spec 002](../specs/002-ui-review-a11y-hardening.md) — UI review + a11y hardening (status: Done)
- [ADR-0006](../decisions/0006-public-only-policy.md) — public-only surface + accessibility conventions (status: Accepted)

Updated cross-references in:

- [AGENTS.md](../AGENTS.md) — added docs/process link, removed TBD refs, sharpened z-index + a11y gotchas
- [CLAUDE.md](../CLAUDE.md) — wired process docs into workflow rules, added cavecrew subagent mention
- [README.md](../../README.md) — reflected shipped MVP state, linked docs/process, added new convention bullets
- [docs/decisions/README.md](../decisions/README.md) — filled in ADR-0006 row
- [docs/specs/README.md](../specs/README.md) — added spec 002 row

Re-audited stack via `npm view` + web search:

- **Major bump available:** `framer-motion@13.0.0` shipped today (2026-08-05). Verified migration cost is low for this repo (no Emotion/Styled Components). No code changes needed.
- **Minor bumps available:** `react-icons@5.7.0`, `tailwind-merge@3.6.0` (Tailwind v4.3 support).
- **No drift:** `next@16.3.0`, `tailwindcss@4.3.3`, `@uiw/react-md-editor@4.1.1`, `@supabase/ssr@0.12.4`.

Updated [ADR-0005](../decisions/0005-stack-version-verification-2026-08-05.md) with re-audit table.

Applied the bumps: `package.json` deps updated, `npm install` clean, `npm run verify` green.

**Bug found + fixed during this batch:** `z-[var(--z-lightbox)]` Tailwind utility class was NOT generated in the production CSS — Tailwind v4 doesn't emit utilities from arbitrary values containing CSS variables. Switched all 4 sites to inline `style={{ zIndex: 'var(--z-lightbox)' }}` (or `var(--z-nav)`). Updated AGENTS.md gotcha to document the pattern.

Open follow-ups (next session):
- Lighthouse run against deployed URL (verify next/image savings + reduced-motion behavior)
- React Compiler enablement (`reactCompiler: true` in `next.config.ts`)
- Confirm `prefers-reduced-motion` flow visually (toggle OS setting, navigate site)
- Plan blog + admin surfaces (spec 001 phases 6-8) — **DONE in this entry**

### 2026-08-05 — Phases 7-6-8: Supabase + Blog + Admin (full MVP spec 001)

Shipped the remaining 3 phases of spec 001 in one batch (phases 7 → 6 → 8, in dependency order).

**Phase 7 — Supabase setup:**
- `src/lib/supabase/server.ts` — server client (reads auth from cookies, async per Next 15+ pattern)
- `src/lib/supabase/client.ts` — browser client (`"use client"`)
- `src/lib/supabase/middleware.ts` — session refresh + admin route protection
- `src/middleware.ts` — root middleware wiring `updateSession`
- `docs/supabase/001-posts.sql` — full migration (posts table, indexes, RLS policies, updated_at trigger, seed comment)
- `next.config.ts` — added `images.remotePatterns` for Cloudinary + Supabase Storage

**Phase 6 — Blog:**
- `src/app/blog/page.tsx` — RSC blog index, reads published posts from Supabase
- `src/app/blog/[slug]/page.tsx` — RSC individual post, renders MDX via `next-mdx-remote/rsc`
- `src/lib/mdx-components.tsx` — custom MDX components (links, code, headings, blockquote, images)
- `src/app/globals.css` — added `.prose` blog spacing styles

**Phase 8 — Admin + Cloudinary:**
- `src/app/admin/page.tsx` — auth-gated admin page (server component, checks `getUser()`)
- `src/components/PostEditor.tsx` — client component with `@uiw/react-md-editor`, list/create/edit/delete/publish views
- `src/lib/actions.ts` — Server Actions for CRUD (`createPost`, `updatePost`, `deletePost`, `publishPost`)
- `src/lib/cloudinary.ts` — HMAC-signed upload URL generation (browser-direct to Cloudinary)
- `src/app/api/upload/route.ts` — API route returning signed params
- `src/app/api/auth/signout/route.ts` — sign-out redirect

**npm packages added:**
- `@supabase/ssr` + `@supabase/supabase-js` (Phase 7)
- `next-mdx-remote` + `@mdx-js/mdx` (Phase 6)
- `@uiw/react-md-editor` (Phase 8)

**`npm run verify` green.** All spec 001 phases (1-8) shipped. Deploy phase remains.

### 2026-08-05 — 404 page + CI pipeline + stale cleanup

Closed the remaining code/docs gaps from the progress audit:

- `src/app/not-found.tsx` — custom dark-only 404 page with link back home (spec 001 requirement)
- Removed dead `src/components/SectionEyebrow.tsx` (unused export, no imports)
- `AGENTS.md` — corrected `content/posts/` description to clarify Supabase-backed blog is primary and local MDX is optional
- `docs/supabase/README.md` — migration index + manual apply instructions
- `docs/deploy/README.md` — step-by-step manual runbook for Supabase, Cloudinary, GitHub, Vercel, env vars, smoke tests
- `.github/workflows/ci.yml` — CI pipeline: `npm ci`, `npm run typecheck`, `npm run build` on push/PR to main

`npm run verify` green after this cleanup.

Manual-only follow-ups are intentionally not implemented in code:
- Create Supabase project
- Run `docs/supabase/001-posts.sql`
- Add env vars in `.env.local` / Vercel
- Deploy on Vercel and configure custom domain

### 2026-08-06 — Admin login UI + Supabase auth redirect & table GRANTs

Resolved auth UX gap and database permission issues during initial post creation test:

- **Admin Login UI (`src/app/login/page.tsx`):** Created dark-themed login page with email & password form using `@/lib/supabase/client`.
- **Auth Middleware Redirects (`src/lib/supabase/middleware.ts`, `src/middleware.ts`, `src/app/admin/page.tsx`):** Updated redirect target for unauthenticated users accessing `/admin` from `/` to `/login`. Added auto-redirect from `/login` to `/admin` for authenticated users. Added `/login` to middleware matcher.
- **Supabase Key Fallbacks (`src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`):** Added fallback support for `NEXT_PUBLIC_SUPABASE_ANON_KEY` alongside `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **Database Table GRANTs (`docs/supabase/001-posts.sql`, `docs/deploy/supabase-setup.md`):** Added explicit `GRANT USAGE ON SCHEMA public` and `GRANT ALL ON TABLE posts TO authenticated` / `GRANT SELECT ON TABLE posts TO anon` statements to eliminate Postgres `permission denied for table posts` errors on initial write.
- **Header & Hero Blog Links (`src/components/Navbar.tsx`, `src/components/Hero.tsx`, `src/data/config.ts`):** Updated `SOCIAL_LINKS.blog` to `/blog`. Added Blog link & icon (`FiBookOpen`) to desktop/mobile Navbar and Hero section CTA button using Next.js `Link`.
- **Cloudinary Direct Upload UI (`src/components/PostEditor.tsx`):** Wired direct signed upload button into `PostEditor` Cover Image field calling `/api/upload` and POSTing to Cloudinary, auto-setting Cover URL.
- **Dynamic SEO Metadata (`src/app/robots.ts`, `src/app/sitemap.ts`):** Added automated `robots.txt` disallowing `/admin` & `/api/` and dynamic `sitemap.xml` fetching published blog posts from Supabase.

`npm run verify` green. Verified post creation successful end-to-end.

### 2026-08-07 — Lighthouse performance + SEO hardening

Ran Lighthouse against `https://darkthede-web.vercel.app/` and found production performance score at 68-69, with LCP blocked by hero text rendering and font/network work. Also found desktop SEO at 92 because the deployed `robots.txt` pointed its sitemap at `http://localhost:3000/sitemap.xml`.

**Findings:**
- Hero copy was the LCP candidate and lived inside a framer-motion wrapper that rendered `opacity: 0` until hydration.
- Fraunces loaded 5 weights plus italic variants but `font-serif` was unused in source.
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000` can leak into canonical, robots, sitemap, and signout URLs if configured in a production build environment.
- React icon SVGs used decoratively next to visible labels but lacked `aria-hidden`/`focusable="false"`.

**Built:**
- `src/data/config.ts` — centralized `resolvePrimarySiteUrl()` guard that ignores localhost and falls back to Vercel URL or GitHub Pages.
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/api/auth/signout/route.ts` — switched to `SITE_URLS.primary`.
- `src/app/layout.tsx`, `src/app/globals.css` — removed unused Fraunces font wiring.
- `src/components/Hero.tsx` — converted Hero to a server component and removed the framer-motion opacity gate around LCP text.
- `src/components/BentoGrid.tsx`, `Footer.tsx`, `Navbar.tsx`, `RTICSection.tsx`, `Hero.tsx` — marked decorative React icons as hidden from assistive tech.

**Verification:**
- `npm run verify` green.
- Local production Lighthouse mobile after fixes: Performance 79, Accessibility 100, Best Practices 100, SEO 100. FCP improved from 3.1s to 1.9s; Speed Index from 8.2s to 2.8s; total byte weight from 754 KiB to 619 KiB.

**Open follow-up:**
- Update Vercel production env `NEXT_PUBLIC_SITE_URL` to the canonical production URL or remove it so `VERCEL_URL` fallback is used; then redeploy and re-run Lighthouse on production.

## Conventions

- One entry per non-trivial session (≥ 3 files OR meaningful decision).
- Link to ADRs / specs by relative path.
- Use `### Findings` and `### Built` and `### Open follow-ups` for scannability.
- Don't recap every commit — link to git log if available.
