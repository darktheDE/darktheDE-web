# Cloudinary setup — step by step

## Overview

Cloudinary host blog cover images + uploaded assets. Free tier: 25 credits/month.
Project cần: **1 Cloudinary account**, **3 env vars**.

---

## Step 1: Tạo account

1. Vào https://cloudinary.com/users/register/free
2. Điền registration form:

| Field | Giá trị | Ghi chú |
|---|---|---|
| Email | Email thật | Dùng email chính |
| Password | Mạnh | Account Cloudinary |
| Account name | `darkthede` (hoặc `darktheDE`) | Tạo subdomain: `darkthede.cloudinary.com` |

3. Xác nhận email
4. Đăng nhập

---

## Step 2: Lấy Cloud Name

1. Dashboard → click **"Programmable Media"** ở sidebar
2. Click **"Dashboard"**
3. Tìm **"Product Environment"** section:

| Field | Giá trị | Env var name |
|---|---|---|
| **Cloud Name** | `darkthede` (hoặc khác) | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |

> Cloud name là public identifier. An toàn khi expose ở client.

---

## Step 3: Lấy API Key + Secret

1. Dashboard → **Settings** (⚙️ gear icon)
2. Click **"API Keys"** trong left sidebar
3. Nếu chưa có key → click **"Generate new API key"**

| Field trong dashboard | Copy value | Env var name |
|---|---|---|
| **API Key** | `123456789...` (numeric) | `CLOUDINARY_API_KEY` |
| **API Secret** | `AbCdEfGhIjKlMn...` (alphanumeric) | `CLOUDINARY_API_SECRET` |

> ⚠️ **API Secret là secret.** Không commit vào git. Chỉ dùng server-side (lib/cloudinary.ts).

---

## Step 4: Verify Cloudinary dashboard

Sau khi có keys, verify dashboard hiển thị đúng:

- **Product Environment** → Cloud Name hiển thị
- **API Keys** → API Key + API Secret tồn tại
- **Media Library** → trống (sẽ chứa images khi upload)

---

## Step 5: Free tier limits

25 credits/tháng. Mỗi credit:

| Operation | Cost per credit |
|---|---|
| 1 GB storage | 1 credit |
| 1 GB bandwidth | 1 credit |
| 1,000 transforms | 1 credit |

Portfolio blog: cover images ≈ 1-2MB mỗi ảnh. 25 credits ≈ 25GB storage/bandwidth — đủ cho blog nhỏ.

---

## Tổng kết

| Step | Hoàn thành? |
|---|---|
| Tạo Cloudinary account | ⬜ |
| Lấy Cloud Name | ⬜ |
| Lấy API Key | ⬜ |
| Lấy API Secret | ⬜ |
| Verify dashboard | ⬜ |
| Ghi env vars | ⬜ |

**Kết quả cuối:** Cloudinary account sẵn sàng. Next step: cấu hình `.env.local` trong project.
