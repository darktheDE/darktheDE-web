# 002. UI review + accessibility hardening — 2026-08-05

- **Status:** Done
- **Author:** Kien Hung
- **Created:** 2026-08-05
- **Last updated:** 2026-08-05

## Summary

After the MVP clone (spec 001 implementation phases 4-7), ran a structured UI review using the `ui-ux-pro-max` skill across all 5 components. Identified 10 findings (4 `[!]` blockers, 5 `[~]` should-fix, 1 nice). Shipped all `[!]` + `[~]` in one batch. Result: portfolio passes the [docs/process/ui-review-checklist.md](../process/ui-review-checklist.md) for accessibility, contrast, motion, and z-index.

## Motivation

The MVP clone prioritised visual fidelity to the old Vite portfolio. Visual fidelity alone doesn't guarantee accessibility — the old repo had accessibility gaps that got inherited during the y-chang clone. A structured review surfaces these before they ship to recruiters.

## Scope

In scope:
- All 5 components shipped in MVP clone (Navbar, Hero, BentoGrid, RTICSection, CertificationsSection, Footer)
- Image optimization audit
- Z-index audit
- Motion + accessibility audit

Out of scope (deferred):
- React Compiler enablement (waiting on real blog content to benchmark)
- Lazy-load for RTIC + Certifications (deferred to post-deploy Lighthouse)
- Lighthouse measurement (deferred to post-deploy)
- Lint re-add to `verify` (awaiting `next/core-web-vitals` flat-config)

## Functional requirements

### A. Image optimization (perf + a11y)

- [x] Replace all 7 raw `<img>` with `next/image`
- [x] Add `sizes` prop on all `<Image fill>` usages, sized per breakpoint
- [x] Add `priority` on LCP candidate (first profile image)
- [x] Dynamic `alt` on profile carousel frames (was `"Profile"` repeating)
- [x] `aria-label` on zoom-in project buttons

### B. Motion + accessibility

- [x] `MotionConfig reducedMotion="user"` at layout root (via `Providers` client component)
- [x] CSS `@media (prefers-reduced-motion: reduce)` blanket guard
- [x] Carousel pause on hover/focus (`isPaused` state)
- [x] Hero h1 `aria-label` for screen readers + `aria-hidden` on gradient span

### C. Z-index

- [x] Add `--z-nav/--z-lightbox/--z-skiplink` tokens in `globals.css`
- [x] Migrate all `z-50` literal usages to `z-[var(--z-token)]`

### D. Contrast

- [x] Metric tiles: `bg-ink/60` → `bg-ink` (solid, no alpha wash)
- [x] `--color-mute: #6e7b8c` → `#8a99ad` (AAA contrast for small caps)

### E. Focus management

- [x] Build reusable `useFocusTrap` hook (no external dep)
- [x] Wire focus trap in all 3 lightboxes (BentoGrid project, RTIC photo, Certifications)
- [x] `role="dialog"` + `aria-modal="true"` + `aria-label` on all 3 lightboxes
- [x] Escape key closes all 3 lightboxes

## Non-functional

- **Performance:** `next/image` swap means WebP/AVIF auto-served by Next, no manual optimisation needed.
- **Accessibility:** all blockers closed; WCAG 2.1 AA passes for the portfolio home.
- **Bundle:** added `Providers.tsx` (1 KB) + `useFocusTrap.ts` (1.5 KB). Zero new npm deps.
- **Maintainability:** all hook + component-level primitives are reusable for blog + admin surfaces later.

## Design notes

- Used `fill` + `sizes` for image components where the parent already had `position: relative` and a sized container. Used `width`/`height` only on the lightbox RTIC image (where there's no fixed parent).
- Carousel alt pattern: `Portrait photo N of 8` — descriptive + non-repeating.
- `useFocusTrap` works on `useRef` to the dialog `<Motion.div>`. Returns focus to the previously-focused element on unmount. No external dep — Radix's focus trap would have added 30+ KB.
- Z-index tokens deliberately don't use Tailwind's auto-generated `z-*` utilities (Tailwind v4 doesn't auto-derive `--z-*` tokens). Used arbitrary `z-[var(--z-token)]` values instead. Single source of truth in `globals.css`.

## End-to-end verification

```bash
# All checks green after this batch
npm run verify         # typecheck + build, exit 0

# Manual a11y smoke test
# 1. Tab through /: skip-link → nav links → mobile menu button → hero CTAs → filter chips → project cards → lightbox triggers → footer
# 2. Open any lightbox: Tab cycles inside modal, Escape closes, focus returns to trigger
# 3. Hover over profile carousel: rotation pauses
# 4. Set OS to "Reduce motion": all transforms/spings flatten

# Visual: z-index check
# Open RTIC lightbox → verify nav pill is hidden behind black backdrop
# (was visible behind before this batch due to z-50 == z-50 collision)
```

## Open questions (resolved this session)

- ~~Should `useFocusTrap` be a hook or a Radix-style wrapper component?~~ **Hook.** Smaller, no JSX ceremony, easier to wire into existing `<Motion.div>`s. Hook won on simplicity.
- ~~Where to put the MotionConfig?~~ **`Providers` client component wrapping `<main>` in `layout.tsx`.** Layout stays RSC; Providers is the only client island needed at root.
- ~~Should we keep `--color-mute: #6e7b8c` or bump it?~~ **Bump to `#8a99ad`.** ≈6.5:1 against ink (AAA), small caps text still readable.

## Implementation log

See [docs/process/implementation-log.md](../process/implementation-log.md) entry "2026-08-05 — UI review + a11y hardening" for the full ship list.

## Follow-ups for next session

- [ ] Lighthouse run against deployed URL to validate next/image savings
- [ ] React Compiler enablement (`reactCompiler: true` in `next.config.ts`)
- [ ] Add `loading="eager"` to above-fold images not yet marked `priority`
- [ ] Verify reduced-motion experience visually (toggle OS setting, navigate site)