# darktheDE-web

> Personal portfolio + blog for **Kien Hung (darktheDE)** — Data Engineering student at HCM-UTE.
> Built to showcase projects, share learnings, and document the build process itself.

**Live:** [darkthede.github.io](https://darkthede.github.io)

![Status](https://img.shields.io/badge/status-in%20development-7cffb2?style=flat-square)
![Stack](https://img.shields.io/badge/stack-Next.js%2016.3%20%2B%20Tailwind%204-11161f?style=flat-square)
![Deploy](https://img.shields.io/badge/deploy-Vercel%20Hobby-000?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/license-MIT-1f2a3a?style=flat-square)

---

## What's inside

A single Next.js 16.3 codebase hosts three surfaces:

- **`/`** — Portfolio home. Hero, stack, projects (Medallion diagram), RTIC, certifications.
- **`/blog`** — MDX blog index, sorted by `published_at` desc. Server-rendered for SEO.
- **`/admin`** — Supabase Auth-gated post editor (CRUD) backed by Server Actions.

Design language: dark-only, "data engineer's notebook" — single 1px vertical rule on the left of the page (`page-trace`), no gradients, no glow.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | [Next.js 16.3](https://nextjs.org) (App Router, RSC, Turbopack) | SSR for blog SEO + Server Actions simplify admin writes |
| Language | TypeScript (strict) | Catch type errors at build, no runtime surprises |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) (CSS-first `@theme`) | No `tailwind.config.ts`; tokens live in `globals.css` |
| Backend | [Supabase](https://supabase.com) (Postgres + Auth + RLS) | One provider for DB, auth, and row-level security |
| Images | [Cloudinary](https://cloudinary.com) (free tier, signed upload) | Offload image hosting + transformation |
| Hosting | [Vercel](https://vercel.com) (Hobby) | Zero-config Next.js deploy; custom domain `darkthede.github.io` |
| Fonts | Fraunces (display, Google) + Monaspace Neon (mono, self-hosted) + Inter (body) | Plain student English voice, monospace for eyebrows |

Locked stack decisions are documented in [`docs/decisions/`](docs/decisions/).

## Getting started

### Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- Supabase project (free tier) — for blog + admin
- Cloudinary account (free tier) — for image uploads in admin

### Setup

```bash
# 1. Clone
git clone https://github.com/darktheDE/darktheDE-web.git
cd darktheDE-web

# 2. Install
npm install

# 3. Env
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, etc.

# 4. Dev server
npm run dev
# open http://localhost:3000
```

### Build & verify

```bash
npm run typecheck   # tsc --noEmit
npm run build       # production build
npm run verify      # typecheck + build (run before claiming a task done)
```

## Project structure

```
darktheDE-web/
├── AGENTS.md              # vendor-neutral AI agent instructions
├── CLAUDE.md              # Claude Code-specific overrides
├── README.md              # this file
├── docs/
│   ├── decisions/         # ADRs (architecture decision records)
│   └── specs/             # feature specs (one file per non-trivial feature)
├── content/
│   └── posts/             # MDX blog posts (git-versioned, server-rendered)
├── public/
│   ├── fonts/             # self-hosted Monaspace Neon variable font
│   └── assets/            # images, favicon
└── src/
    ├── app/               # Next.js App Router
    │   ├── layout.tsx     # root layout: fonts, page-trace, skip-link
    │   ├── page.tsx       # portfolio home
    │   ├── blog/          # /blog index + /blog/[slug] post
    │   └── admin/         # /admin (Supabase Auth gated)
    ├── components/        # React components (Hero, PipelineLog, …)
    ├── lib/               # shared utilities (supabase clients, cn, …)
    └── styles/            # global CSS + Tailwind tokens
```

## Adding a blog post

Two paths, same outcome:

1. **Drop an `.mdx` file** into `content/posts/<slug>.mdx`. The blog renders server-side — no DB write needed.
2. **Use the admin UI** at `/admin` (after signing in via Supabase Auth). The editor wraps `@uiw/react-md-editor`; cover images upload to Cloudinary.

## Deploy

Vercel + GitHub: push to `main`, Vercel builds automatically. Custom domain `darkthede.github.io` is wired through Vercel DNS.

```bash
# Manual deploy (if not using GitHub integration)
npm run build
vercel deploy --prod
```

## Conventions

- **No marketing copy.** Plain student English. No "production-grade", no superlatives, no jargon dumps.
- **Dark-only.** No light mode toggle. (Reaffirmed by the old-repo refactor.)
- **No raw hex in components.** Use Tailwind tokens (`text-accent`, `bg-panel`, `border-rule`).
- **Display font (Fraunces) is for H1/H2/big numbers only.** Body text uses Inter.
- **Small, frequent commits.** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).

Full conventions: [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md).

## License

MIT — see [LICENSE](LICENSE).

## Contact

- **GitHub:** [@darktheDE](https://github.com/darktheDE)
- **LinkedIn:** [kien-hung-de](https://www.linkedin.com/in/darkthede/)
- **Email:** dkh1105.work@gmail.com

---

<sub>Built with Next.js 16.3 · Deployed on Vercel Hobby · <code>npm run verify</code> green before every deploy.</sub>