# UI review checklist

Pre-delivery checklist for any UI-touching change. Run through this **before** claiming a UI task done.

The order roughly follows impact priority (a11y → touch → perf → style → layout → typography → motion → forms → nav → charts). Skip categories that don't apply.

## 1. Accessibility (CRITICAL — fix before anything else)

- [ ] All `<img>` / `<Image>` have descriptive `alt` (decorative = `alt=""`)
- [ ] Heading hierarchy: `h1` → `h2` → `h3`, no level skips
- [ ] All interactive elements keyboard-reachable: Tab through the page top-to-bottom
- [ ] Visible focus rings (`focus-visible:ring-*` or equivalent) on every focusable
- [ ] Icon-only buttons have `aria-label`
- [ ] Lightboxes / modals trap focus + restore on close (`role="dialog"` + `aria-modal="true"`)
- [ ] `aria-hidden="true"` on decorative elements
- [ ] Color contrast ≥ 4.5:1 for body, ≥ 3:1 for large text (verify against actual rendered colors)
- [ ] Form errors announced via `role="alert"` or `aria-live`
- [ ] No "color only" information conveyance (icon/text + color together)

## 2. Touch & interaction

- [ ] All clickable elements ≥ 44×44 px on mobile
- [ ] Hover states also have focus equivalents (`:focus-visible`)
- [ ] Loading feedback for async actions (button spinner / disabled state)
- [ ] Swipe gestures have keyboard alternatives

## 3. Performance

- [ ] Use `next/image` for all images (not raw `<img>`)
- [ ] `sizes` prop set per layout
- [ ] LCP candidate marked `priority` if above-the-fold
- [ ] No layout shift: image containers have reserved aspect ratio
- [ ] Bundle: no full lodash, no moment, no icon-pack-everything
- [ ] CLS < 0.1 (verify with Lighthouse)

## 4. Style selection

- [ ] Style consistent across surfaces (no random flat + skeuomorphic mix)
- [ ] Icons are SVG (react-icons, lucide, heroicons) — never emoji as icons
- [ ] `cursor-pointer` on all clickable non-button elements
- [ ] No raw hex in components — Tailwind tokens only

## 5. Layout & responsive

- [ ] Mobile-first: design starts at 375 px, scales up
- [ ] Test 375 / 768 / 1024 / 1440 px widths
- [ ] No horizontal scroll on any breakpoint
- [ ] `viewport` meta tag set
- [ ] Fixed-width containers (no `w-[1200px]` without responsive fallback)
- [ ] Safe-area-inset for fixed bottom bars on mobile

## 6. Typography & color

- [ ] Body text ≥ 16 px
- [ ] Line-height 1.5+ for body, 1.1-1.3 for display
- [ ] Semantic color tokens (`text-accent`, `bg-panel`, `border-rule`)
- [ ] Display font reserved for H1/H2/big numbers (per repo convention)
- [ ] Monospace reserved for eyebrows / code / data labels

## 7. Animation

- [ ] Durations 150-300 ms for UI transitions (perceived snappy)
- [ ] `ease-out` for enters, `ease-in` for exits
- [ ] No animation on `width`/`height` (use `transform`)
- [ ] `prefers-reduced-motion` respected:
  - framer-motion: `<MotionConfig reducedMotion="user">` at layout root
  - CSS: `@media (prefers-reduced-motion: reduce) { animation/transition: 0.01ms }`
- [ ] Continuous animations only for loading indicators
- [ ] Motion conveys meaning (not decoration)

## 8. Forms & feedback

- [ ] Every input has a visible label (not placeholder-only)
- [ ] Errors appear near the field
- [ ] Helper text for non-obvious inputs
- [ ] Progressive disclosure: don't overwhelm upfront
- [ ] Submit button disabled + spinner during in-flight

## 9. Navigation

- [ ] Predictable back behavior (browser back works as expected)
- [ ] Bottom nav ≤ 5 items
- [ ] Deep linking works: each section reachable by URL fragment
- [ ] Skip link to main content (this repo already has `.skip-link`)

## 10. Charts & data viz

- [ ] Legend present
- [ ] Tooltips on data points
- [ ] Accessible color palette (not red/green only)
- [ ] Charts render meaningfully in dark mode (verify, don't assume)

## Z-index audit

- [ ] All `z-*` values reference design tokens (`style={{ zIndex: 'var(--z-lightbox)' }}`), not literals
- [ ] Lightbox / modal > navbar > content > page-trace
- [ ] Skip-link always top (`var(--z-skiplink)`)

## SEO (if public surface)

- [ ] Page `<title>` set
- [ ] Meta description set
- [ ] OG image for social sharing
- [ ] `lang="en"` on `<html>`

## Output format

When reporting findings, structure as:

```
### [Severity] finding-name
File: path:line
Problem: <one sentence>
Fix: <one sentence>
```

Severity tags:
- `[!]` blocker — must fix before shipping
- `[~]` should-fix — fix before next milestone
- `[ ]` nice — backlog item