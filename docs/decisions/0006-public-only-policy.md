# 0006. Public-only policy + accessibility conventions

- **Status:** Accepted
- **Date:** 2026-08-05
- **Deciders:** Kien Hung

## Context and Problem Statement

Two related policies need explicit ADRs because they're easy to violate by accident during fast iterations:

1. **Public-only surface.** The site at `darkthede.github.io` is a recruiting surface. Anything an agent adds to the public route tree becomes part of Kien Hung's public professional record. Internal-only context (agent scratchpads, "this is for an AI agent" blocks, CV.tex prompt templates, etc.) has no business on the public surface.

2. **Accessibility conventions.** Without explicit conventions, "do the right thing" gets reinterpreted by each session. We need hard rules: all images via `next/image`, all lightboxes are accessible modals, all `z-*` use tokens, all `prefers-reduced-motion` respected.

Both policies were being followed informally. This ADR records them so future agents don't drift.

## Considered Options

### Public-only surface

- **Option A:** No policy; rely on agent judgment.
- **Option B:** Policy + audit (this ADR + a grep check in CI).
- **Option C:** Block AI-generated content from public routes entirely.

**Chosen: B.** A is what got us here. C is overkill — there's no AI-generated content, only AI-assisted code, and that's fine.

### Accessibility conventions

- **Option A:** No rules. Hope for the best.
- **Option B:** Ad-hoc per-component. (Old repo's pattern.)
- **Option C:** Convention table in `AGENTS.md` + checklist in `docs/process/ui-review-checklist.md`. (This ADR.)

**Chosen: C.** A is reckless. B is what produced the y-chang MVP clone that inherited old-repo a11y bugs.

## Decision Outcome

**Chosen: explicit policy + checklist, single source of truth in `AGENTS.md` + `docs/process/ui-review-checklist.md`.**

### Public-only surface — consequences

- **Good:** Recruiter-facing site stays clean. No risk of internal notes leaking.
- **Good:** Audit-friendly — single grep check (`grep -r "AGENT CONTEXT" src/`) catches violations.
- **Bad:** None seen. Cost is one checklist + one ADR.
- **Risks:** Future agent might add a "system prompt" comment to public code. Mitigation: this ADR + CI grep.

### Accessibility conventions — consequences

- **Good:** All components get consistent treatment (focus trap, role=dialog, escape, alt text, etc.).
- **Good:** Reusable primitives (`useFocusTrap`, `MotionConfig`) keep per-component cost low.
- **Bad:** Slight upfront cost — every new lightbox must wire the hook.
- **Risks:** Pattern drift if a new component bypasses the conventions. Mitigation: `docs/process/ui-review-checklist.md` runs before each UI ship.

## Confirmation

Public-only policy:
- [ ] `grep -r "AGENT CONTEXT" src/ public/` → no matches in production code.
- [ ] No "AI-generated" disclaimers in user-visible copy.
- [ ] No internal-only data files committed.

Accessibility conventions:
- [ ] All images use `next/image`.
- [ ] All lightboxes use `useFocusTrap` + `role="dialog"` + `aria-modal="true"`.
- [ ] All z-index values reference `--z-*` tokens.
- [ ] `MotionConfig reducedMotion="user"` present at layout root.
- [ ] Lighthouse Accessibility score ≥ 95 (verify post-deploy).

## Pros and Cons of the Options

### Option A (no policy, ad-hoc)

Agent judgment works in steady state but breaks under time pressure. Every session re-derives the rules. Old repo's a11y bugs prove this fails.

### Option C (no AI on public surface)

Throw the baby out with the bathwater. The value of agent assistance is enormous; banning AI from public surfaces is unnecessary.

### B/C (chosen)

Written rules + reusable primitives = low marginal cost, high consistency.

## Conventions codified (now in AGENTS.md)

1. No AI agent context blocks on public surface.
2. All `<img>` → `next/image` with `sizes` + dynamic alt where appropriate.
3. All lightboxes: `role="dialog"`, `aria-modal="true"`, `aria-label`, focus trap via `useFocusTrap`, Escape closes.
4. All `z-*` values reference `--z-nav/--z-lightbox/--z-skiplink` tokens.
5. All motion: `MotionConfig reducedMotion="user"` at root + CSS `@media (prefers-reduced-motion: reduce)` guard.
6. Display font (Fraunces) reserved for H1/H2/big numbers. Body = Inter.
7. No raw hex in components — Tailwind tokens only.

## References

- [AGENTS.md](../AGENTS.md) — codified conventions.
- [docs/process/ui-review-checklist.md](../process/ui-review-checklist.md) — pre-delivery checklist.
- [docs/specs/002-ui-review-a11y-hardening.md](../specs/002-ui-review-a11y-hardening.md) — session that produced these conventions.
- WCAG 2.1 AA — baseline target.