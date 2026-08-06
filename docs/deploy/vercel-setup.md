# Vercel setup — step by step

## Overview

Vercel deploy Next.js app + custom domain. Free tier (Hobby): 100GB bandwidth.
Project cần: **1 Vercel project**, **env vars**, **custom domain**.

---

## Step 1: Import repo

1. Vào https://vercel.com/new
2. Click **"Import Git Repository"**
3. Nếu chưa kết nối GitHub → click **"Connect GitHub"** → authorize
4. Tìm repo `darktheDE/darkthede-web` → click **"Import"**

---

## Step 2: Configure project

Trên form "Configure Project":

| Field | Giá trị | Ghi chú |
|---|---|---|
| **Framework Preset** | `Next.js` | Auto-detected từ package.json |
| **Root Directory** | `./` | Để default. Repo không dùng monorepo. |
| **Build Command** | `npm run build` | Auto-detected |
| **Output Directory** | `.next` | Auto-detected (Next.js default) |
| **Install Command** | `npm ci` | Auto-detected |

> Nếu auto-detect sai → nhấn pencil icon để edit. Nhưng通常 Next.js auto-detect đúng.

---

## Step 3: Environment Variables

Trước khi deploy, cần add env vars. Click **"Environment Variables"** section:

### Supabase vars

| Field | Giá trị | Environment |
|---|---|---|
| **Name** | `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| **Value** | `https://xxxxx.supabase.co` | Từ Supabase dashboard (Step 3 của supabase-setup.md) |
| **Name** | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production, Preview, Development |
| **Value** | `eyJhbG...` | Từ Supabase dashboard (Publishable key) |
| **Name** | `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development |
| **Value** | `eyJhbG...` | Từ Supabase dashboard — ⚠️ **server-only** |

### Cloudinary vars

| Field | Giá trị | Environment |
|---|---|---|
| **Name** | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Production, Preview, Development |
| **Value** | `darkthede` | Từ Cloudinary dashboard (Step 2 của cloudinary-setup.md) |
| **Name** | `CLOUDINARY_API_KEY` | Production, Preview, Development |
| **Value** | `123456789...` | Từ Cloudinary dashboard |
| **Name** | `CLOUDINARY_API_SECRET` | Production, Preview, Development |
| **Value** | `AbCdEf...` | Từ Cloudinary dashboard — ⚠️ **server-only** |

### Site URL var

| Field | Giá trị | Environment |
|---|---|---|
| **Name** | `NEXT_PUBLIC_SITE_URL` | Production, Preview, Development |
| **Value** | `https://darkthede.github.io` | URL sau khi custom domain setup xong |

### Add vars

Với mỗi var:
1. Nhập Name + Value
2. Chọn Environment: ✅ Production, ✅ Preview, ✅ Development
3. Click **"Add"**

Tổng cộng: **8 env vars** cần thêm.

---

## Step 4: Deploy

Sau khi env vars xong:
1. Click **"Deploy"** button
2. Đợi build + deploy (~1-2 phút cho第一次)
3. Vercel sẽ tạo URL preview: `darkthede-web-xxx.vercel.app`

---

## Step 5: Verify deploy

Mở URL preview trong browser:

| URL path | Expected |
|---|---|
| `/` | Portfolio home hiển thị |
| `/blog` | Blog index (empty hoặc có posts) |
| `/admin` | Redirect về `/` (chưa login) |
| `/not-real` | Custom 404 page hiển thị |

---

## Step 6: Custom domain

1. Vercel Project → **Settings** → **Domains**
2. Nhập domain: `darkthede.github.io`
3. Click **"Add"**

### Nếu dùng GitHub Pages domain (`darkthede.github.io`)

Vercel sẽ hiển thị DNS instructions. Cần:

| Field | Giá trị | Ghi chú |
|---|---|---|
| **Type** | CNAME | Nếu dùng subdomain |
| **Name** | `@` hoặc `darkthede` | Root domain |
| **Value** | `cname.vercel-dns.com` | Vercel DNS target |

### Nếu dùng custom domain riêng

| Field | Giá trị | Ghi chú |
|---|---|---|
| **Type** | A record | Nếu apex domain |
| **Name** | `@` | Root domain |
| **Value** | `76.76.21.21` | Vercel IP |

Sau khi DNS propagated (1-5 phút), Vercel sẽ verify tự động.

---

## Step 7: Production verify

Sau khi custom domain active:

1. Mở `https://darkthede.github.io` (hoặc custom domain)
2. Verify tất cả routes hoạt động
3. Check Lighthouse (Performance > 85 home, > 90 blog)

---

## Tổng kết

| Step | Hoàn thành? |
|---|---|
| Import GitHub repo | ⬜ |
| Configure project (framework, build) | ⬜ |
| Thêm 8 env vars | ⬜ |
| Deploy lần đầu | ⬜ |
| Verify preview URL | ⬜ |
| Config custom domain | ⬜ |
| DNS propagation | ⬜ |
| Production verify | ⬜ |

**Kết quả cuối:** Portfolio deployed tại `darkthede.github.io`. Next step: monitoring + maintenance.
