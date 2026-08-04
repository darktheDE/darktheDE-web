# 0001. Next.js 16.3 (App Router) over Vite 7

- **Status:** Accepted
- **Date:** 2026-08-04
- **Deciders:** Kien Hung
- **Verified:** 2026-08-04 against npm registry (`next@16.3.0` published 2026-08-03)

## Context and Problem Statement

Old portfolio is React 19 + Vite 7 + Tailwind 3.4, deployed to GitHub Pages via `gh-pages`. The site is a single SPA.

We're adding a blog with admin UI, MD content, image hosting, and possibly auth. The new feature set benefits from SSR (SEO for blog posts), server-side data fetching (Supabase queries don't ship through the browser's anon key alone), and API routes / server actions (form submissions, image upload signing).

Should we keep the Vite SPA + add Supabase client calls, or migrate to a full-stack framework?

## Considered Options

- **A: Keep Vite 7 + add Supabase JS client (SPA pattern)**
- **B: Migrate to Next.js 16.3 (App Router) + RSC + Server Actions + Turbopack**
- **C: Migrate to Astro 7.1 + React islands**

## Decision Outcome

**Chosen option: B (Next.js 16.3 App Router)**, because the blog needs SSR for SEO, and Server Actions simplify the admin → DB write path. Vite SPA would force client-side fetching for every blog post (bad for SEO + first paint). Astro 7 is content-first with Vite 8 + Rust compiler, but the user is comfortable with React idioms and wants a real full-stack learning experience.

### Why Next.js 16 specifically (not 15)

- **Turbopack is now the stable default bundler** (since 16.0, Oct 2025) — ~400% faster dev startup, ~50% faster rendering.
- **Cache Components** — new programming model with PPR (`use cache`) — useful for blog list pages where most posts are static.
- **React Compiler stable** — automatic memoization, less manual `useMemo`.
- **Active LTS = 16.2.11, Maintenance LTS = 15.5.21** (per July 2026 security release). We start on the latest stable (16.3) which gives us the longest support window.
- **`create-next-app` ships with `AGENTS.md` bundled** (since 16.3) — relevant for our agent-shaped repo.

### Consequences

- **Good:** RSC for blog list/post pages, Server Actions for admin writes, one codebase for portfolio + blog + admin, free Vercel deploy.
- **Good:** RSC + Edge Runtime unlocks streaming and partial prerendering if needed later.
- **Bad:** Migration cost — old code does not transfer directly. (Acceptable: we're rebuilding from scratch.)
- **Bad:** Next.js opinionated — some friction if we want non-standard routing. (Acceptable: our needs are standard.)
- **Risks:** RSC + Supabase SSR auth flow has known gotchas (cookies, server client). Mitigation: follow Supabase's official Next.js guide, verify with `npm run verify` + a real auth flow test before claiming done.

### Confirmation

- Blog index and post pages return server-rendered HTML (verify: `curl http://localhost:3000/blog` returns the title in the HTML body, not just in a `<script>` tag).
- Lighthouse SEO score > 90 on a published post.

## Pros and Cons of the Options

### Option A: Keep Vite 7 + Supabase JS

- Good, because no migration cost. Existing code keeps working.
- Good, because Vite dev server is faster than Next.js.
- Bad, because blog post HTML is not server-rendered → bad SEO.
- Bad, because admin writes need a separate backend (or Supabase directly from browser, which leaks the RLS complexity to the client).
- Bad, because we'd need a second deployment to host any backend logic, complicating DNS / domain.

### Option B: Next.js 16.3 App Router

- Good, because RSC gives us SSR for free on blog pages.
- Good, because Server Actions + Route Handlers cover the admin backend in the same codebase.
- Good, because Vercel deploys Next.js with zero config.
- Good, because Turbopack (default since 16) gives us fast dev.
- Bad, because migration cost (acceptable: rebuild).
- Bad, because RSC + Server Components mental model takes a session to internalize.

### Option C: Astro 7.1 + React islands

- Good, because content-first SSG is fast and SEO-friendly (Vite 8 + Rust compiler).
- Good, because MDX is first-class via content collections.
- Good, because 7.1 adds CSP, pagination, structured logging — good for portfolio.
- Bad, because the user prefers React idioms; Astro's island model means more cognitive switching.
- Bad, because admin UI would still need a separate React app or complex integration.

## References

- [Next.js 16.3 release notes (Aug 3, 2026)](https://nextjs.org/blog)
- [Next.js 16 release notes (Oct 21, 2025)](https://nextjs.org/blog)
- [Next.js App Router docs](https://nextjs.org/docs)
- [Supabase Next.js guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- Vercel Hobby free-tier limits: https://vercel.com/pricing
- Astro 7.1 release notes: https://astro.build/blog
