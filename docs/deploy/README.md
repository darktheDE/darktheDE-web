# Deployment runbook

Manual steps the project owner runs. Agent handles code, docs, tests, and verification; owner handles external accounts, secrets, and deployment permissions.

## Service-specific guides

| Service | Guide | Fields filled | Time est. |
|---|---|---|---|
| Supabase | [supabase-setup.md](supabase-setup.md) | Org, name, password, region + 3 env vars + SQL | 10 min |
| Cloudinary | [cloudinary-setup.md](cloudinary-setup.md) | Account, cloud name, API key, API secret | 5 min |
| Vercel | [vercel-setup.md](vercel-setup.md) | Import repo, 8 env vars, custom domain | 10 min |

## Quick checklist

- [ ] Local verify green: `npm run verify`
- [ ] Supabase project created → [guide](supabase-setup.md)
- [ ] `docs/supabase/001-posts.sql` executed
- [ ] Cloudinary account configured → [guide](cloudinary-setup.md)
- [ ] `.env.local` filled locally
- [ ] Local `npm run dev` smoke test
- [ ] Commit + push to GitHub
- [ ] Vercel project imported → [guide](vercel-setup.md)
- [ ] Vercel env vars set (8 vars)
- [ ] Production deploy green
- [ ] Custom domain configured

## Local setup

```bash
cp .env.local.example .env.local
```

Fill `.env.local` with values from Supabase + Cloudinary setup guides.

```bash
npm run verify   # typecheck + build
npm run dev      # local dev server → http://localhost:3000
```

### Smoke test URLs

| URL | Expected |
|---|---|
| http://localhost:3000 | Portfolio home |
| http://localhost:3000/blog | Blog index (empty state) |
| http://localhost:3000/admin | Redirects home (not logged in) |
| http://localhost:3000/not-real | Custom 404 page |

### Create admin user (required for blog admin)

1. Supabase Dashboard → Authentication → Users → Add user
2. Enter email + password
3. Check "Auto Confirm Email"
4. Create user
5. Login at `/admin`

## GitHub push

```bash
git add .
git commit -m "feat: ship portfolio + blog + admin MVP"
git push origin main
```

CI pipeline (`.github/workflows/ci.yml`) runs `typecheck` + `build` automatically on push.

## Troubleshooting

### `/blog` errors with "missing env"

Check Vercel env vars. Re-deploy after adding.

### `/admin` redirects home when logged in

1. Check Supabase Auth → Users → user exists
2. Check cookie in browser DevTools → Application → Cookies → `sb-*-auth-token` present
3. Check `NEXT_PUBLIC_SITE_URL` matches deployed URL

### Build fails on Vercel but local passes

```bash
npm ci
npm run verify
```

Compare Node version (CI uses Node 20).

### Cloudinary upload returns 401

Check `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in Vercel env vars.
