# 0003. Cloudinary for image hosting + transformations

- **Status:** Accepted
- **Date:** 2026-08-04
- **Last verified:** 2026-08-05 via cloudinary.com/pricing + cloudinary.com/documentation/developer_onboarding_faq_credits
- **Deciders:** Kien Hung

## Context and Problem Statement

Blog posts will contain screenshots, diagrams, photos. We need: storage, on-the-fly transforms (resize, WebP/AVIF, crop), and a CDN. Supabase Free does NOT include image transformations (costs Pro $25/mo).

Should we (a) pay for Supabase Pro, (b) use Supabase Storage and pre-process images with `sharp` at build time, (c) use a separate image host with transforms on free tier?

## Considered Options

- **A: Cloudinary Free (25 credits/mo)**
- **B: Supabase Pro ($25/mo) for transforms**
- **C: Pre-process with `sharp` at build time + commit to repo**
- **D: UploadThing Free (2 GB, no transforms)**
- **E: Vercel Blob (1 GB + 5K transforms/mo on Hobby)**

## Decision Outcome

**Chosen option: A (Cloudinary)**, because 25 credits/mo on free tier buys us 25 GB managed storage OR 25 GB bandwidth OR 25K transforms — and we can mix and match. URL-based transform API (`f_auto,q_auto,w_800`) means responsive images with zero build-time processing.

**Credit model (verified 2026-08-05):** 1 credit = 1 GB storage OR 1 GB bandwidth OR 1,000 transformations. The "25 credits" cap applies regardless of which resource type you consume. For a personal portfolio with ~10 images/post and 5 posts/mo, expect mostly transforms to count (URL-based responsive variants) — well within 25K transforms/mo.

### Consequences

- **Good:** Zero build-time image processing pipeline.
- **Good:** Auto WebP/AVIF via `f_auto` — major bandwidth saving for visitors.
- **Good:** URL parameters are inspectable / cacheable / shareable.
- **Bad:** Credit-based pricing is hard to predict exactly. Mitigation: monitor usage weekly, set Cloudinary alert at 20 credits used.
- **Bad:** Vendor lock-in for image URLs. Mitigation: keep originals in repo `public/blog-originals/` as backup.
- **Risks:** Cloudinary could tighten free tier. Mitigation: Vercel Blob (5K transforms) is a drop-in replacement; just need to rewrite the URL helper.

### Confirmation

- A blog post with 5 images renders correctly with responsive `srcset`.
- Cloudinary dashboard shows < 25 credits / month at typical usage (5 posts/mo, ~10 images/post).

## Pros and Cons of the Options

### Option A: Cloudinary Free

- Good, because 25 credits are flexible (storage / bandwidth / transforms).
- Good, because URL-based transforms are zero-build.
- Good, because mature CDN, broad global presence.
- Bad, because 25 credits is not a lot — if you go viral, you'll know.

### Option B: Supabase Pro

- Good, because one vendor for everything.
- Bad, because $25/mo is real money for a personal site.
- Bad, because Pro still charges per-GB for storage / egress — easy to overshoot.

### Option C: `sharp` at build time

- Good, because no vendor dependency.
- Good, because images live in git = versioned.
- Bad, because every new image requires a rebuild.
- Bad, because no `srcset` without per-image variants committed.
- Bad, because repo bloat (large binaries).

### Option D: UploadThing Free

- Good, because the upload UX is built for end users.
- Bad, because no on-the-fly transforms — would need separate processing step.
- Bad, because 2 GB is tight for a long-running blog.

### Option E: Vercel Blob

- Good, because tightly integrated with Vercel deploy.
- Good, because 5K transforms/mo on Hobby covers the early stage.
- Bad, because 1 GB storage cap is small.
- Bad, because lock-in to Vercel.

## References

- https://cloudinary.com/pricing
- https://cloudinary.com/documentation/image_transformations
- https://vercel.com/docs/storage/blob
- ADR 0002 (why Supabase alone is not enough)
