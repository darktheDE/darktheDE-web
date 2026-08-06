# Supabase setup — step by step

## Overview

Supabase cung cấp Postgres database + Auth + RLS cho blog system.
Project của bạn cần: **1 project Supabase**, **1 migration SQL**, **3 env vars**.

---

## Step 1: Tạo project

1. Vào https://supabase.com/dashboard
2. Click **"New project"** (hoặc "Create a new project")
3. Điền từng field:

### Organization

| Field | Giá trị | Ghi chú |
|---|---|---|
| Organization | `darktheDE's Org` | Chọn org có sẵn, hoặc tạo mới nếu chưa có. Đây là "team" chứa project. |

> Nếu chưa có organization → click "Create a new organization" → nhập tên → tạo xong chọn lại.

### GitHub (optional)

| Field | Giá trị | Ghi chú |
|---|---|---|
| Connect GitHub | **Bỏ qua** (unchecked) | Tùy chọn này dùng cho Supabase CI/CD pipeline (push schema changes tự deploy). Không cần cho project này — migration chạy SQL thủ công. |

### Project name

| Field | Giá trị | Ghi chú |
|---|---|---|
| Project name | `darktheDE-web` | Đúng tên repo. Dễ quản lý nếu có nhiều projects. |

### Database password

| Field | Giá trị | Ghi chú |
|---|---|---|
| Database password | **Click "Generate a password"** | Tự tạo password mạnh. **Copy ngay** — sẽ không hiển thị lại. Lưu vào password manager. |

> ⚠️ **KHÔNG dùng password dễ nhớ.** Supabase Postgres password là superuser password — mất = phải reset qua Supabase dashboard. Click "Copy" icon ngay sau khi generate.

### Region

| Field | Giá trị | Ghi chú |
|---|---|---|
| Region | **Asia-Pacific (Singapore)** | Chọn `Asia-Pacific` → `Singapore`. Gần nhất với user base Việt Nam. Nếu Singapore không có, chọn `Southeast Asia`. |

> Region ảnh hưởng latency. Với user ở Việt Nam: Singapore (≈50ms) tốt hơn US East (≈200ms).

---

## Step 2: Đợi project provisioning

Sau khi click **"Create new project"**:
- Supabase sẽ tạo Postgres instance + API endpoints
- Thời gian: 1-2 phút
- Bạn sẽ nhận notification khi xong

---

## Step 3: Lấy API keys

Sau khi project sẵn sàng:

1. Dashboard → **Project Settings** (⚙️ icon) → **API**
2. Tìm 2 keys:

### NEXT_PUBLIC_SUPABASE_URL

| Field trong dashboard | Copy value | Env var name |
|---|---|---|
| **Project URL** | `https://xxxxx.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |

### NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

| Field trong dashboard | Copy value | Env var name |
|---|---|---|
| **Publishable key** (trước đây là anon key) | `eyJhbG...` (JWT token) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

> Publishable key là public key — an toàn khi expose ở client. RLS policies kiểm soát data access.

### SUPABASE_SERVICE_ROLE_KEY

| Field trong dashboard | Copy value | Env var name |
|---|---|---|
| **service_role** key | `eyJhbG...` (JWT token) | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **service_role key bypasses RLS.** KHÔNG bao giờ commit vào git, KHÔNG expose ở client. Chỉ dùng server-side (middleware.ts, Server Actions).

---

## Step 4: Chạy migration SQL

1. Dashboard → **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Mở file `docs/supabase/001-posts.sql` trong project
4. Copy toàn bộ nội dung
5. Paste vào SQL Editor
6. Click **"Run"** (hoặc Ctrl+Enter / Cmd+Enter)

### Verify migration thành công

```sql
-- Kiểm tra table tồn tại
select column_name, data_type, is_nullable
from information_schema.columns
where table_name = 'posts';
```

Kết quả mong đợi:

| column_name | data_type | is_nullable |
|---|---|---|
| id | uuid | NO |
| slug | text | NO |
| title | text | NO |
| excerpt | text | YES |
| cover_url | text | YES |
| body_mdx | text | NO |
| status | text | NO |
| published_at | timestamptz | YES |
| created_at | timestamptz | YES |
| updated_at | timestamptz | YES |

```sql
-- Kiểm tra policies tồn tại
select policyname, cmd, roles
from pg_policies
where tablename = 'posts';
```

Kết quả mong đợi:

| policyname | cmd | roles |
|---|---|---|
| Public reads published posts | SELECT | anon |
| Authenticated reads/writes all posts | ALL | authenticated |

---

## Step 5: Tạo admin user (để test)

Blog admin cần ít nhất 1 Supabase Auth user.

1. Dashboard → **Authentication** → **Users**
2. Click **"Add user"**
3. Điền:

| Field | Giá trị | Ghi chú |
|---|---|---|
| Email | `admin@darkthede.com` | Email bất kỳ hợp lệ. Dùng email thật nếu muốn nhận magic link. |
| Password | Tạo password mạnh | Dùng cho đăng nhập admin |
| Auto Confirm Email | ✅ Checked | Bỏ qua email verification trong dev |

4. Click **"Create user"**
5. Mở `http://localhost:3000/login` (hoặc `/admin`) để đăng nhập và bắt đầu viết bài.

---

## Step 6: Ghi lại env vars

Ghi lại 3 values từ Step 3:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

Đây là input cho file `.env.local` (xem `.env.local.example` trong project root).

---

## Tổng kết

| Step | Hoàn thành? |
|---|---|
| Tạo project (org, name, password, region) | ⬜ |
| Lấy 3 API keys | ⬜ |
| Chạy migration SQL | ⬜ |
| Verify table + policies | ⬜ |
| Tạo admin user | ⬜ |
| Ghi env vars | ⬜ |

**Kết quả cuối:** Supabase project `darktheDE-web` sẵn sàng với `posts` table, RLS policies, và 1 admin user. Next step: cấu hình `.env.local` trong project.
