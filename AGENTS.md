# AGENTS.md

> Vendor-neutral entrypoint for AI coding agents (Claude Code, Cursor, Aider, Codex, ...).
> Claude-Code-specific overrides live in `CLAUDE.md` next to this file.

## What this repo is

Personal portfolio + blog for Kien Hung (darktheDE), a Data Engineering student at HCM-UTE.

- **Live:** https://darkthede.github.io
- **Goal:** showcase projects, share learnings, document the build process.
- **Audience:** recruiters + hiring managers. Plain student English. No marketing tone.

## Stack (locked, do not change without ADR)

- **Framework:** Next.js 16.3 (App Router, TypeScript) — Turbopack default
- **Styling:** Tailwind CSS 4.3.3 — CSS-first config (`@theme` in globals.css), NOT tailwind.config.js
- **Backend / DB / Auth:** Supabase (Postgres + Auth + RLS + Edge Functions)
- **Image hosting:** Cloudinary (free tier)
- **Hosting:** Vercel (Hobby plan) — DNS points to `darkthede.github.io`
- **Markdown:** `@next/mdx` for content, `react-markdown` for inline rendering
- **Fonts:** Fraunces (display, Google Fonts) + Monaspace Neon (mono, self-hosted at `public/fonts/`) + Inter (body)

Decisions behind these choices: `docs/decisions/0001-*.md` through `0004-*.md`.

## Conventions

### File layout
```
darktheDE-web/
├── AGENTS.md                    # this file
├── CLAUDE.md                    # Claude Code-specific overrides
├── README.md                    # human-facing overview
├── package.json
├── next.config.mjs
├── tsconfig.json
├── eslint.config.mjs
├── .env.local.example           # copy to .env.local, gitignored
├── docs/
│   ├── decisions/               # ADRs (Architecture Decision Records)
│   │   ├── README.md
│   │   ├── templates/adr.md
│   │   └── NNNN-<slug>.md
│   └── specs/                   # feature specs (one file per non-trivial feature)
│       ├── README.md
│       ├── templates/feature.md
│       └── NNN-<slug>.md
├── content/
│   └── posts/                   # blog posts (MDX, git-versioned)
│       └── *.mdx
├── public/
│   ├── fonts/                   # self-hosted Monaspace Neon
│   └── assets/                  # images, favicon
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx             # portfolio home
│   │   ├── blog/
│   │   │   ├── page.tsx         # blog index
│   │   │   └── [slug]/page.tsx  # individual post
│   │   └── admin/
│   │       └── page.tsx         # blog editor (Supabase Auth gated)
│   ├── components/              # React components
│   ├── lib/                     # shared utilities (supabase client, mdx, etc.)
│   └── styles/                  # global CSS, Tailwind layer overrides
└── .github/
    └── workflows/ci.yml         # lint + typecheck + build on PR
```

### Code style
- TypeScript everywhere. `any` is a code smell.
- React Server Components by default. Add `"use client"` only when needed (state, effects, browser APIs).
- Tailwind utilities over inline styles. Use design tokens (`bg-ink`, `text-accent`, ...) — never raw hex in components.
- Component files: `PascalCase.tsx`. Utility files: `kebab-case.ts`. Hooks: `use-*.ts`.
- One component per file unless trivially small.
- Comments explain WHY, not WHAT.

### Naming
- Branches: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`.
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- PRs: short title, "why" > "what", screenshots if UI changes.

## Commands

```bash
npm run dev        # local dev server (port 3000)
npm run build      # production build
npm run start      # serve production build
npm run typecheck  # tsc --noEmit
npm run verify     # typecheck + build (run before claiming done)
```

## Verification before "done"

The agent must run `npm run verify` and confirm green before claiming a task complete.
If a task changes UI, also screenshot the result.

## Gotchas

- **Dark-only.** No light mode. Don't add `dark:` prefixes or theme toggles.
- **Public-only site.** No AI agent context block, no CV.tex prompts, no internal-only sections. See `docs/decisions/0005-public-only.md` (TBD).
- **Plain English copy.** No superlatives, no "production-grade" alone, no jargon dumps. One sentence per claim.
- **Monaspace Neon is self-hosted.** Variable font file at `public/fonts/MonaspaceNeonVar.woff2`. Don't replace with system mono.
- **No raw hex in components.** Use Tailwind tokens (`text-accent`, `bg-panel`, `border-rule`).
- **Display font reserved for H1/H2/big numbers.** Body text = Inter.
- **Free tier awareness.** Supabase 500 MB DB / 5 GB egress; Cloudinary 25 credits/mo; Vercel Hobby 100 GB transfer. Don't propose changes that blow these.

## When to write a spec vs vibe code

- **Vibe code:** typo, copy tweak, single-component styling, 1-2 file changes.
- **Write `/docs/specs/NNN-<slug>.md` first:** new feature, new route, schema change, anything that touches more than 3 files or that you'd want to think twice about.

## When to write an ADR

- Stack change (framework, DB, host).
- Schema migration.
- Public API shape change.
- Anything you'd find hard to reverse without a re-deploy.

Template: `docs/decisions/templates/adr.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
