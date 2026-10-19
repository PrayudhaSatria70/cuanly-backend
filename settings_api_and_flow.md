# Cuanly Backend — Settings, API, and Flow Specifications

Dokumentasi arsitektur teknis, endpoint API, alur data (flow), skema database Neon PostgreSQL, dan keamanan untuk backend Cuanly (`cuanly-backend`). Dokumentasi ini disinkronkan secara presisi (1:1) dengan struktur folder dan fitur terbaru repo frontend (`cuanly-frontend`).

---

## 1. Alignment Struktur Folder (Frontend -> Backend Modules)

| Route / Folder Frontend (`cuanly-frontend/src/app`) | Module Backend (`cuanly-backend/src/modules`) | Controller Path Utama | Fungsi / Keterangan |
|---|---|---|---|
| `(auth)/login` | `modules/auth` | `POST /api/v1/auth/login` | Login via Username/Email + Password/PIN |
| `(auth)/register` | `modules/auth` | `POST /api/v1/auth/register` | Registrasi akun baru (Password/PIN Min. 4 karakter) |
| `(user)/beranda` | `modules/beranda` | `GET /api/v1/beranda` | Agregasi ringkasan kas, mutasi terakhir, dompet, & kategori |
| `(user)/transaksi` | `modules/transaksi`, `modules/transactions` | `GET, POST /api/v1/transaksi`, `GET /api/v1/transactions` | Daftar transaksi & filtering |
| `(user)/transaksi/[id]` | `modules/transaksi/[id]` | `GET, PUT, DELETE /api/v1/transaksi/:id` | Detail & mutasi transaksi individual |
| `(user)/transaksi/scan` | `modules/transaksi/scan`, `modules/ocr` | `POST /api/v1/transaksi/scan`, `POST /api/v1/ocr/scan` | Pemindaian struk berbasis Smart OCR |
| `(user)/transaksi/tambah` | `modules/transaksi/tambah` | `POST /api/v1/transaksi/tambah` | Endpoint khusus pembuatan transaksi baru |
| `(user)/budget` | `modules/budget`, `modules/finance` | `GET /api/v1/budget`, `GET, PUT /api/v1/budgets` | Monitoring batas pengeluaran kategori |
| `(user)/budget/[slug]` | `modules/budget/[slug]` | `GET, PUT /api/v1/budget/:slug` | Detail anggaran kategori spesifik & mutasi terkait |
| `(user)/profil` | `modules/profil`, `modules/auth` | `GET, PUT /api/v1/profil`, `POST /api/v1/profil/avatar` | Kelola profil, display name, avatar, & nomor telepon |
| `(user)/settings` | `modules/settings`, `modules/users` | `GET, PUT /api/v1/settings`, `GET, PUT /api/v1/users/settings` | Preferensi tema, bahasa, mata uang, allowance, & threshold |
| `pricing` | `modules/pricing` | `GET /api/v1/pricing`, `POST /api/v1/pricing/upgrade` | Tier langganan (FREE, SILVER, GOLD, B2B) & upgrade |
| `admin/dashboard` | `modules/admin/dashboard` | `GET /api/v1/admin/dashboard`, `GET /api/v1/admin/stats` | Metrik KPI platform & volume transaksi global |
| `admin/categories` | `modules/admin/categories` | `GET, POST /api/v1/admin/categories` | Manajemen kategori sistem & custom |
| `admin/transactions` | `modules/admin/transactions` | `GET /api/v1/admin/transactions` | Audit seluruh riwayat transaksi pengguna |
| `admin/users` | `modules/users` | `GET /api/v1/admin/users` | Direktori pengguna terdaftar |
| `admin/users/[id]` | `modules/admin/users/[id]` | `GET, PUT /api/v1/admin/users/:id/toggle-status` | Detail user & kontrol status aktif/nonaktif |
| `admin/verification` | `modules/admin/verification` | `GET /api/v1/admin/verification`, `GET /api/v1/admin/mitra` | Verifikasi berkas pengajuan mitra bisnis |
| `admin/verification/[id]` | `modules/admin/verification/[id]` | `GET, PUT /api/v1/admin/verification/:id/verify` | Approval & penolakan mitra beserta catatan |
| `admin/complaints` | `modules/admin/complaints` | `GET /api/v1/admin/complaints` | Tiket komplain, support, & sengketa transaksi |
| `admin/complaints/[id]` | `modules/admin/complaints/[id]` | `GET, PUT /api/v1/admin/complaints/:id/status` | Resolusi status tiket komplain |

---

## 2. Settings

- **Default Environment Variables (`.env`):**
  - `DATABASE_URL`: Connection pooler string Neon PostgreSQL (`...pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`)
  - `DIRECT_URL`: Direct unpooled connection string Neon PostgreSQL (`...aws.neon.tech/neondb?sslmode=require`)
  - `JWT_SECRET`: Secret key signing token JWT
  - `JWT_EXPIRES_IN`: Masa berlaku token (`7d`)
  - `PORT`: Port server lokal (`5000`)
- **User Settings Defaults (`user_settings` table):**
  - `theme`: `"light"`
  - `locale`: `"en"`
  - `activeCurrency`: `"IDR"`
  - `monthlyAllowance`: `6700000` (BigInt)
  - `spendingWarningThreshold`: `80` (%)
  - `sessionTimeoutMs`: `180000` (3 menit timeout)
  - `ocrSpeed`: `"standard"`
  - `ocrAutoCat`: `true`
  - `ocrReview`: `true`
  - `notificationsEnabled`: `true`
  - `soundEnabled`: `true`

---

## 3. API Endpoints

### 3.1 Authentication & Profile
- **`POST /api/v1/auth/login`**
  - Body: `{ "identifier": "...", "password": "...", "pin"?: "..." }`
  - Response: `{ "success": true, "token": "jwt_...", "user": { ... } }`
- **`POST /api/v1/auth/register`**
  - Body: `{ "name": "...", "email": "...", "password": "...", "pin"?: "...", "username"?: "...", "phone"?: "..." }`
  - Validation: Password atau PIN minimal 4 karakter/digit.
  - Response (201): `{ "success": true, "token": "jwt_...", "user": { ... } }`
- **`GET /api/v1/auth/me` & `GET /api/v1/profil`**
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "success": true, "user": { ... } }`
- **`PUT /api/v1/auth/profile` & `PUT /api/v1/profil`**
  - Body: `{ "name"?: "...", "username"?: "...", "email"?: "...", "phone"?: "...", "avatarUrl"?: "...", "subscriptionTier"?: "..." }`
  - Response: `{ "success": true, "user": { ... } }`
- **`POST /api/v1/auth/avatar` & `POST /api/v1/profil/avatar`**
  - Body: `{ "avatarUrl"?: "...", "dataUrl"?: "..." }` (Mendukung base64 data URL hingga 10MB)
  - Response: `{ "success": true, "user": { ... } }`
- **`PUT /api/v1/auth/password`**
  - Body: `{ "oldPassword": "...", "newPassword": "...", "confirmPassword"?: "..." }`
  - Validation: Minimal 4 karakter/digit
  - Response: `{ "success": true, "message": "Password updated successfully" }`
- **`PUT /api/v1/auth/subscription`**
  - Body: `{ "tier": "FREE" | "SILVER" | "GOLD" | "B2B" }`
  - Response: `{ "success": true, "user": { ... } }`

### 3.2 Beranda & Dashboard
- **`GET /api/v1/beranda`**
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "success": true, "summary": FinancialSummary, "recentTransactions": Transaction[], "wallets": Wallet[], "categories": Category[] }`

### 3.3 Transaksi & OCR
- **`GET /api/v1/transaksi` & `GET /api/v1/transactions`**
  - Query: `type`, `category`, `search`, `period`
- **`POST /api/v1/transaksi` & `POST /api/v1/transaksi/tambah` & `POST /api/v1/transactions`**
  - Body: `{ "type": "EXPENSE" | "INCOME", "amount": 50000, "categoryId": "...", "date": "...", "walletId"?: "..." }`
- **`POST /api/v1/transaksi/scan` & `POST /api/v1/ocr/scan`**
  - Body: `{ "sampleId"?: "...", "imageUrl"?: "..." }`
  - Response: Parsed OCR receipt dengan merchant, items, tanggal, total, & kategori saran.

### 3.4 Pricing & Subscription
- **`GET /api/v1/pricing`** (Publik): Daftar paket & benefit (FREE, SILVER, GOLD, B2B)
- **`GET /api/v1/pricing/my-plan`** (Bearer Auth): Info paket aktif user & limit kuota dompet
- **`POST /api/v1/pricing/upgrade`** (Bearer Auth): Body `{ "plan": "GOLD" }` -> Mengubah paket langganan di DB

---

## 4. Flow

### 4.1 Registrasi & Login Sinkron (Password / PIN)
```
Frontend Register Page (/register)
  │
  ├── User input nama, email, username (opsional), dan password/PIN (min. 4 karakter)
  │
  ▼
POST /api/v1/auth/register
  │
  ├── Backend AuthController menerima payload
  ├── RegisterDto memvalidasi (MinLength: 4)
  ├── AuthService hash credential dengan bcrypt (10 rounds)
  ├── Prisma membuat record User + UserSettings default
  │
  ▼
Response (201 Created)
  └── Kembalikan { token, user: { ...safeUser, subscriptionPlan: "FREE" } }
```

### 4.2 Upgrade Paket Langganan (Pricing Flow)
```
User navigasi ke /pricing atau klik fitur terkunci (Gold / Silver / B2B)
  │
  ├── Klik tombol "Pilih Paket"
  │
  ▼
POST /api/v1/pricing/upgrade
  │
  ├── PricingController memverifikasi token JWT
  ├── PricingService memperbarui kolom `users.subscription_tier` di Neon PostgreSQL
  │
  ▼
Response (200 OK)
  └── Frontend SubscriptionContext & AuthContext memperbarui state tier & kuota dompet secara instan
```

---

## 5. Security Controls

- **Autentikasi:** JWT Bearer tokens dengan HMAC-SHA256.
- **Autorisasi:** Role-Based Access Control (`RolesGuard` memisahkan `USER` dan `ADMIN`).
- **Input Validation:** Global `ValidationPipe` dengan `whitelist: true` dan DTO class-validator.
- **Keamanan Password:** Hashing salted bcrypt (`saltRounds: 10`).
- **Rate Limiting:** `ThrottlerGuard` membatasi 120 requests/menit untuk memitigasi Brute Force & DoS.
- **Keamanan Header HTTP (OWASP):**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - Penekanan header `X-Powered-By`

---

## 6. Operations

- **Platform:** Vercel Serverless Function (`api/index.ts`)
- **Database:** Neon Serverless PostgreSQL (`ap-southeast-1` Singapore)
- **OpenAPI / Swagger:** `https://cuanly-backend.vercel.app/api/docs`
- **Build Script:** `npm run vercel-build` (`prisma generate && nest build`)

---

## 7. Tri-Repository Synchronization & Wiring Status

Dokumentasi sinkronisasi tri-repo (`cuanly-database`, `cuanly-backend`, `cuanly-frontend`):
- **Skema Prisma**: Sinkron 1:1 antara `cuanly-database/prisma/schema.prisma` dan `cuanly-backend/prisma/schema.prisma` (14 model dan 9 enum). Validasi `prisma validate` berhasil.
- **Seeding & Data Live**: `prisma/seed.ts` dan berkas seed (`seeds/admin_financial_data.json`, `seeds/admin_live_data.sql`, `seeds/seed.sql`) telah disalin dan disinkronkan dari `cuanly-database` ke `cuanly-backend`.
- **Port & Network Wiring**:
  - Backend aktif pada port `5000` (`http://localhost:5000/api/v1`).
  - CORS dikonfigurasi mengizinkan `http://localhost:3000` dan `http://127.0.0.1:3000`.
  - Frontend terhubung melalui `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1`.
  - Database terhubung ke PostgreSQL lokal `postgresql://postgres:postgres@localhost:5432/cuanly_db?schema=public`.
- **Kompilasi & Build Backend**:
  - `tsc --noEmit`: **0 errors** (PASSED).
  - `nest build`: **dist/ bundle compiled** (PASSED).

---

## 8. Subscription Features Full-Page Navigation & Paywall Logic

Dokumentasi arsitektur routing frontend yang terhubung ke backend:
- **Paritas Halaman Penuh (Full Page)**: Seluruh 7 fitur langganan (`/wallets`, `/debts`, `/workspace`, `/bank-sync`, `/investasi`, `/analitik-ai`, `/bisnis`) beroperasi sebagai halaman penuh setara dengan User Menu (`/beranda`, `/transaksi`, `/budget`) dan Admin Backoffice (`/admin/*`).
- **Eliminasi Modal untuk Akun Sesuai Plan**: Akun dengan plan yang sesuai (Silver/Gold/B2B/Admin) masuk langsung ke halaman penuh tanpa ada popup modal atau tombol redundant "Open Quick Modal".
- **Modal Paywall Khusus Free Plan**: Akun Free plan (atau belum memenuhi plan) secara otomatis memunculkan `openUpgradeModal` saat mengakses halaman fitur terkunci, serta menampilkan kartu CTA upgrade yang dapat diklik untuk menuju checkout.
