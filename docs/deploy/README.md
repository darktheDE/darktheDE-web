# Deployment runbook

Manual steps the project owner runs. Agent handles code, docs, tests, and verification; owner handles external accounts, secrets, and deployment permissions.

## What is automated vs manual

| Area | Agent handles | Owner handles |
|---|---|---|
| Code | Next.js app, Supabase clients, blog/admin routes, Cloudinary signing | Review code, commit, push |
| Tests | `npm run verify`, CI config | Read output, decide deploy timing |
| Supabase | SQL migration file + docs | Create project, run SQL, copy keys |
| Cloudinary | Signed upload helper + API route | Create account, get cloud name/API key/API secret |
| Vercel | Next.js config + CI docs | Import repo, set env vars, custom domain |

## Checklist

- [ ] Local verify green: `npm run verify`
- [ ] Supabase project created
- [ ] `docs/supabase/001-posts.sql` executed
- [ ] Cloudinary account configured
- [ ] `.env.local` filled locally
- [ ] Local `npm run dev` smoke test
- [ ] Commit + push to GitHub
- [ ] Vercel project imported
- [ ] Vercel env vars set
- [ ] Production deploy green
- [ ] Custom domain configured

## 1. Local verify

```bash
npm install
npm run verify
```

Expected:

```text
✓ Compiled successfully
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /admin
├ ƒ /api/auth/signout
├ ƒ /api/upload
├ ƒ /blog
└ ƒ /blog/[slug]
```

## 2. Supabase setup (manual)

1. Go to https://supabase.com/dashboard
2. Create a new project
3. Open **SQL Editor**
4. Open [docs/supabase/001-posts.sql](../supabase/001-posts.sql)
5. Copy the whole SQL file
6. Paste into SQL Editor
7. Click **Run**
8. Verify table exists:

```sql
select * from posts;
```

Expected: empty table, no error.

### Supabase keys

Go to **Project Settings → API** and copy:

| Env var | Supabase field |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (server-only) |

Add to `.env.local` locally. Later, add same vars to Vercel.

## 3. Cloudinary setup (manual)

1. Go to https://cloudinary.com/console
2. Copy Cloud Name, API Key, API Secret
3. Add to `.env.local`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Optional unsigned preset is not required for current signed upload flow. Keep `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` empty unless you add unsigned uploads later.

## 4. Local env

Copy template:

```bash
cp .env.local.example .env.local
```

Fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit `.env.local`.

## 5. Local smoke test

```bash
npm run dev
```

Open:

| URL | Expected |
|---|---|
| http://localhost:3000 | portfolio home |
| http://localhost:3000/blog | empty blog state or published posts |
| http://localhost:3000/admin | redirects home when unauthenticated |
| http://localhost:3000/not-real | custom 404 page |

Admin auth requires a Supabase user. Create one manually in Supabase:

1. Supabase Dashboard → Authentication → Users
2. Add user
3. Use email/password
4. Confirm email manually if needed

## 6. GitHub push (manual)

The owner commits and pushes. Suggested commit chunks:

```bash
git add docs/process docs/specs docs/decisions docs/supabase AGENTS.md CLAUDE.md README.md
git commit -m "docs: add process docs and deployment runbook"

git add package.json package-lock.json next.config.ts src docs/supabase .github
git commit -m "feat: add Supabase blog admin and deployment CI"

git push origin main
```

Or one commit if preferred:

```bash
git add .
git commit -m "feat: ship portfolio blog admin MVP"
git push origin main
```

## 7. Vercel setup (manual)

1. Go to https://vercel.com/new
2. Import GitHub repo `darktheDE/darktheDE-web`
3. Framework preset: **Next.js**
4. Build command: `npm run build`
5. Output directory: leave default
6. Install command: `npm ci`
7. Add environment variables from `.env.local`
8. Deploy

## 8. Vercel environment variables

Set these in **Vercel Project → Settings → Environment Variables**:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_SITE_URL=https://darkthede.github.io
```

Set for: Production + Preview + Development (or at least Production + Preview).

## 9. Custom domain

1. Vercel Project → Settings → Domains
2. Add `darkthede.github.io` if using that as custom domain
3. Follow Vercel's DNS instructions
4. Wait for verification

If GitHub Pages currently owns `darkthede.github.io`, verify DNS / CNAME ownership before switching.

## 10. Production smoke test

After deploy:

| URL | Expected |
|---|---|
| `/` | portfolio home |
| `/blog` | blog index |
| `/admin` | redirects or auth-protected |
| `/not-real` | custom 404 |

Run Lighthouse after production URL is live:

- Home Performance target: > 85
- Blog post Performance target: > 90
- Accessibility target: > 95

## Troubleshooting

### `/blog` errors with Supabase missing env

Check Vercel env vars. Re-deploy after adding env vars.

### `/admin` redirects home even when logged in

Check Supabase Auth cookie config and site URL. Confirm user exists in Supabase Auth.

### Cloudinary upload returns 401

Check `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

### Build fails on Vercel but local passes

Run:

```bash
npm ci
npm run verify
```

Then compare Node version. CI uses Node 20.
