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

- [AGENTS.md](../AGENTS.md) — added docs/process link, removed TBD refs, sharpene d z-index + a11y gotchas
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
- Plan blog + admin surfaces (spec 001 phases 6-8)

## Conventions

- One entry per non-trivial session (≥ 3 files OR meaningful decision).
- Link to ADRs / specs by relative path.
- Use `### Findings` and `### Built` and `### Open follow-ups` for scannability.
- Don't recap every commit — link to git log if available.
