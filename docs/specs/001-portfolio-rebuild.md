# 001. Portfolio + Blog rebuild from scratch

- **Status:** Active (phases 1-8 shipped; deploy pending)
- **Author:** Kien Hung
- **Created:** 2026-08-04
- **Last updated:** 2026-08-05
- **Stack verified:** `next@16.3.0` (npm 2026-08-04), `tailwindcss@4.3.3` (npm 2026-08-04), `@tailwindcss/postcss@4.3.3`, `@next/mdx@16.3.0` (npm 2026-08-04), `@uiw/react-md-editor@4.1.1` (npm 2026-05-21), `react-markdown@10.1.0` (npm 2025-03-07, stable), `@mdx-js/mdx@3.1.1`, `@supabase/ssr@0.12.4` (npm 2026-07-28)

## Summary

Build a new Next.js 16.3 portfolio + blog at `darkthede.github.io`, replacing the old Vite SPA. Preserve the proven design tokens (ink/panel/rule palette, Fraunces/Monaspace Neon/Inter fonts, dark-only). Add an MDX-powered blog with admin UI gated by Supabase Auth. Free-tier stack throughout. No scope creep beyond what's listed here.

## Requirements

### Functional

**Portfolio home (`/`):**
- Hero section with thesis + status cards (copy preserved from old portfolio: "Hi, I'm Kiến Hưng. I build data systems.")
- Stack / skills section (5 lanes by job-to-be-done, data from `src/data/skills.ts`).
- Projects / Pipeline Log section (9 projects, data from `src/data/projects.ts`, Medallion diagram).
- RTIC section (lazy-loaded).
- Certifications section (lazy-loaded).
- Footer with social links.

**Blog index (`/blog`):**
- List of published posts (title, date, excerpt, cover image).
- Sorted by `published_at` desc.
- Server-rendered (RSC) for SEO.

**Blog post (`/blog/[slug]`):**
- Renders MDX from `content/posts/<slug>.mdx`.
- Typography: Fraunces for H1/H2, Inter for body, Monaspace Neon for code/eyebrows.
- Code blocks: Shiki syntax highlighting (dual theme light/dark — but since site is dark-only, dark only is fine).
- Mermaid diagrams: render `\`\`\`mermaid` fences.
- Cover image at top (Cloudinary URL).
- Reading time computed from MDX body.
- "Back to blog" link.

**Admin (`/admin`):**
- Gated by Supabase Auth (email + password).
- Authenticated user can:
  - List all posts (draft + published).
  - Create a new post (MDX editor, title + slug + cover URL + body + status).
  - Edit existing post.
  - Publish / unpublish.
  - Delete (with confirmation).
- MDX editor: `@uiw/react-md-editor` (drop-in React, MD-native, live preview).
- Image upload from editor → Cloudinary via signed upload.

**404 page:**
- Custom dark-only 404 with link back to home.

### Non-functional

- **Performance:** Lighthouse Performance > 85 on home, > 90 on blog post.
- **Accessibility:** All images have `alt`, all interactive elements keyboard-navigable, color contrast meets WCAG AA on accent green (#7CFFB2) against ink (#0A0E14).
- **Security:**
  - Supabase RLS: `posts` table — `anon` can SELECT only `status = 'published'`. `authenticated` can SELECT/INSERT/UPDATE/DELETE all.
  - Cloudinary upload via signed upload only (admin gated).
  - Admin route protected by Supabase session check (server-side).
- **Browser support:** Evergreen only (Chrome, Firefox, Safari, Edge latest).
- **TypeScript:** strict mode. No `any` except in 1-line compat shims with comment.

## Out of Scope (deliberately)

- **Light mode.** Site is dark-only forever. (Reaffirmed by old-repo refactor memory.)
- **Comments / reactions on blog posts.** Defer until there are actual posts to comment on.
- **Search.** No search for v1. (Could add Pagefind later — client-side static search.)
- **RSS feed.** Defer.
- **Newsletter / email signup.** Defer.
- **i18n.** English + Vietnamese copy is fine inline; no i18n routing.
- **Analytics.** Vercel Analytics only (built-in, free). No GA4, no Plausible for v1.
- **Custom font subsets.** Use the variable fonts as-shipped.
- **Image alt-text auto-generation.** Manual for v1. (Could add VLM later.)
- **Migrating any content from the old `darktheDE-portfolio/` repo.** Old repo is archive only. The 9 project entries will be hand-re-entered in `src/data/projects.ts` (they're small).

## Design Notes

- **Tokens:** defined in `src/app/globals.css` under `@theme { ... }` (Tailwind v4 CSS-first config). Components reference them as `bg-ink`, `text-accent`, `border-rule`, `font-mono`, etc. **No raw hex in components.**
- **Display font (Fraunces):** H1, H2, big numbers, drawer titles. Never for body.
- **Mono font (Monaspace Neon):** eyebrows, code, data, labels. Self-hosted at `public/fonts/MonaspaceNeonVar.woff2`.
- **Body font (Inter):** everything else, 16-18px.
- **Single decoration:** vertical 1px rule on the left of the page (`.page-trace`). No gradients, no glow effects, no animated backgrounds.
- **Section padding:** consistent `py-24` (96px) on desktop, `py-16` (64px) on mobile.
- **Hover states:** opacity transitions only. No scale, no rotation.

## Data Model

### `posts` table (Supabase)

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_url text,
  body_mdx text not null,           -- MDX source, not compiled
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index posts_slug_idx on posts (slug);
create index posts_status_published_at_idx on posts (status, published_at desc);

-- RLS
alter table posts enable row level security;

create policy "Public reads published posts"
  on posts for select
  to anon
  using (status = 'published');

create policy "Authenticated reads/writes all posts"
  on posts for all
  to authenticated
  using (true) with check (true);
```

### `cloudinary_uploads` (optional, for tracking)

Not in v1. Cloudinary's signed upload + admin's Cloudinary dashboard is enough.

## End-to-end Verification

```bash
# 1. Install + dev server
cd darktheDE-web
npm install
npm run dev

# 2. Open browser
# - http://localhost:3000/ → portfolio home with Hero, Stack, Pipeline Log
# - http://localhost:3000/blog → empty state (no posts yet) OR first post
# - http://localhost:3000/admin → login screen

# 3. Admin flow
# - Log in with seeded test account (supabase admin: create user)
# - Create a post: title="Hello world", body="## Sub\n\nSome text", cover_url="https://..."
# - Save as draft → appears in /admin list
# - Publish → appears in /blog index
# - Click post → renders MDX with correct typography
# - Log out → /admin redirects to login

# 4. Verify
npm run verify         # lint + typecheck + build, all green
```

Specific observable behaviors:
- Blog post title appears in raw HTML on `/blog/<slug>` (verify with `curl -s http://localhost:3000/blog/hello | grep "Hello world"`).
- A request to Supabase from an anonymous browser session returns ONLY posts where `status='published'`.
- An unauthenticated request to `/admin` returns a redirect to the login screen.

## Open Questions

- **Q: First blog post content?** — likely a "Why I rebuilt my portfolio" retrospective. Will write after MVP ships, not before.
- **Q: How to seed the admin user in dev?** — Supabase dashboard manual create for now. Could add a seed script in v1.1.
- **Q: MDX plugins to enable?** — start with: `remark-gfm`, `remark-frontmatter`, `@shikijs/rehype` (or `rehype-pretty-code`), `remark-mermaid`. Add others only if needed.
- **Q (added 2026-08-05):** Is `@uiw/react-md-editor@4.1.1` the right MD editor, or should we go simpler? Last npm release was 2026-05-21 — package is maintained but slow-moving. Alternatives considered: (a) `<textarea>` + manual Markdown preview tab (zero deps, full control), (b) `react-markdown` + a thin toolbar wrapper, (c) `@uiw/react-md-editor` as-is. Decision pending — see ADR `0005-stack-version-verification-2026-08-05.md` for verification trail. Default plan: ship with `@uiw/react-md-editor@4.1.1` per original spec; revisit after first admin session if the UX is clunky.
- **Q (added 2026-08-05):** Lazy-load via `next/dynamic` for RTIC + Certifications — is this still best practice in Next.js 16? Both sections are static data. Lazy-load provides marginal perf benefit for below-the-fold content but adds Suspense boundary complexity. Decision: keep lazy-load for now (matches spec), but re-evaluate after Lighthouse run on real traffic.

## Implementation Plan

1. **Init project** — `npx create-next-app@latest darktheDE-web --typescript --tailwind --app --src-dir --import-alias "@/*"`. This will create Next.js 16.3 + Tailwind v4 skeleton. `create-next-app` 16.3 bundles an `AGENTS.md` — overwrite with ours.
2. **Tailwind v4 tokens** — Tailwind v4 uses CSS-first config. Tokens go in `src/app/globals.css`:
   ```css
   @import "tailwindcss";
   @theme {
     --color-ink: #0A0E14;
     --color-panel: #11161F;
     --color-panel-light: #19222F;
     --color-rule: #1F2A3A;
     --color-mute: #6E7B8C;
     --color-text: #E6EDF3;
     --color-accent: #7CFFB2;
     --color-accent-dim: #3FAA73;
     --color-warn: #FF7A59;
     --font-serif: "Fraunces", ui-serif, Georgia, serif;
     --font-mono: "Monaspace Neon", ui-monospace, monospace;
     --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
   }
   ```
   No `tailwind.config.ts` needed for v4 (delete if generated).
3. **Fonts** — Fraunces via `next/font/google` (variable axis `opsz`, `wght`). Monaspace Neon: copy `public/fonts/MonaspaceNeonVar.woff2` from old repo, declare via `next/font/local`. Inter: Google Fonts.
4. **Data** — `src/data/projects.ts`, `src/data/skills.ts`, `src/data/personal.ts`. Hand-port from old repo.
5. **Components** — `Navbar`, `Hero`, `StackSection`, `PipelineLog`, `RTICSection`, `CertificationsSection`, `Footer`. Lazy-load the bottom two via `next/dynamic`.
6. **Blog** — `app/blog/page.tsx` (RSC, reads MDX from `content/posts/*.mdx` via `@next/mdx@16.3.0`), `app/blog/[slug]/page.tsx` (RSC, renders via `next-mdx-remote/rsc`).
7. **Supabase setup** — `lib/supabase/server.ts` (server client, with `cookies()` per Next 15+ async pattern), `lib/supabase/client.ts` (browser client). Migration SQL above. Seed via dashboard.
8. **Admin** — `app/admin/page.tsx` (gated by `lib/supabase/server.ts` session check). `PostEditor` component using `@uiw/react-md-editor@4.1.1` (verified on npm 2026-08-04). CRUD via Server Actions.
9. **Cloudinary** — `lib/cloudinary.ts` with signed upload helper. Configured via env vars.
10. **Verify** — `npm run verify` green. Manual smoke test of all routes. Lighthouse check on a post page.
11. **Deploy** — Vercel GitHub integration. Set `darkthede.github.io` as custom domain. Test production.
