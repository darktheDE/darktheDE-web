# 0004. Vercel as hosting platform

- **Status:** Accepted
- **Date:** 2026-08-04
- **Deciders:** Kien Hung

## Context and Problem Statement

We picked Next.js 16.3 (ADR 0001). Where to deploy it? Old site is on GitHub Pages via `gh-pages`. We need: zero-config Next.js support, free tier that scales with portfolio traffic, custom domain to keep `darkthede.github.io` URL.

## Considered Options

- **A: Vercel Hobby (free)**
- **B: Cloudflare Pages (unlimited bandwidth on free)**
- **C: Netlify Free (300 credits/mo)**
- **D: Keep GitHub Pages (would require migrating away from Next.js RSC)**

## Decision Outcome

**Chosen option: A (Vercel)**, because Vercel is the canonical Next.js host (same company, same team, first-class integration). Hobby free tier (100 GB transfer, 1M function invocations, 5K image transforms/mo) is enough for a personal portfolio. Custom domain maps to `darkthede.github.io` via CNAME.

### Consequences

- **Good:** `git push` to main → preview URL → production deploy. Zero config.
- **Good:** Preview URLs per PR — perfect for design review.
- **Good:** Free tier includes 5K image transforms (covers Vercel-served images if we ever add some).
- **Bad:** Hobby is for non-commercial / personal use only (matches our case).
- **Bad:** Vercel-specific features (Edge Middleware, Image Optimization) can create lock-in. Mitigation: keep Next.js usage portable (no Vercel-only APIs except where optional).
- **Risks:** Vercel could tighten Hobby limits. Mitigation: Cloudflare Pages is a 30-min migration if needed (Next.js works on both).

### Confirmation

- Site at `https://darkthede.github.io` returns 200 OK and serves the new portfolio.
- `git push` to `main` triggers a production deploy that completes < 2 min.
- Preview URLs work on PRs (verify with a test PR).

## Pros and Cons of the Options

### Option A: Vercel Hobby

- Good, because zero-config Next.js.
- Good, because 100 GB transfer covers portfolio traffic.
- Good, because preview URLs per PR are a workflow multiplier.
- Bad, because Hobby is non-commercial only (acceptable).
- Bad, because Vercel lock-in risk.

### Option B: Cloudflare Pages

- Good, because unlimited bandwidth on free.
- Good, because 500 builds/mo is plenty.
- Bad, because Next.js support is "works but not first-class" (slightly slower deploys, less Edge integration).
- Bad, because RSC streaming has occasional edge cases on Cloudflare's edge runtime.

### Option C: Netlify

- Good, because mature, broad framework support.
- Good, because credit-based pricing is generous for low-traffic sites.
- Bad, because Next.js support is less polished than Vercel.
- Bad, because credit model is harder to predict.

### Option D: Keep GitHub Pages

- Good, because zero new vendor.
- Good, because URL is already there.
- Bad, because GitHub Pages is static-only — no Next.js RSC, no Server Actions, no ISR.
- Bad, because this would defeat the purpose of choosing Next.js.

## References

- https://vercel.com/pricing
- https://vercel.com/docs/projects/domains
- ADR 0001 (why Next.js in the first place)
- [Cloudflare Pages limits](https://pages.cloudflare.com/) (alternative)
