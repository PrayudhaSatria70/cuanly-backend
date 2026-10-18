# Rencana Implementasi Teknis Cuanly
Backend NestJS, Database PostgreSQL, dan Integrasi Frontend Cuanly

## 1. Analisis Kebutuhan & Triad Akun Autentikasi

Berdasarkan instruksi dan rancangan UX/UI Cuanly, terdapat **3 persona akun** dengan perilaku sistem yang terisolasi dengan jelas:

| Akun | Kredensial | Tipe Penyimpanan | Integrasi Backend & Database | Deskripsi & Hak Akses |
|---|---|---|---|---|
| **Demo User** | Username: `user` atau `user@cuanly.com`<br>PIN/Pass: `123456` atau `user123` | **In-Memory / LocalStorage Mock** | **TIDAK TERINTEGRASI** *(Tetap hardcoded di FE)* | Pengguna demo personal untuk showcase cepat (1-Click Login). Akses role `USER`, tier `FREE` (kuota 2 dompet, Canva gold crown badge aktif). |
| **Demo Admin** | Username: `admin` atau `admin@cuanly.com`<br>PIN/Pass: `999999` atau `admin123` *(via tombol 1-Click Demo)* | **In-Memory / LocalStorage Mock** | **TIDAK TERINTEGRASI** *(Tetap hardcoded di FE)* | Admin demo untuk showcase backoffice cepat (1-Click Login). Akses role `ADMIN`, tier `B2B` (Full feature, bypass kuota). |
| **Live Admin** *(Fungsional)* | Username: `admin`<br>Email: `admin@cuanly.com`<br>Password / PIN: `admin123` (bisa login via username/email dan password/pin) | **PostgreSQL Database** *(Hashed Bcrypt)* | **LIVE & TERINTEGRASI PENUH** *(NestJS + PostgreSQL)* | Akun backoffice sungguhan. Login melalui form manual menggunakan username `admin` atau email `admin@cuanly.com`, serta password/pin `admin123`. Memiliki JWT token asli, hak akses `@Roles('ADMIN')`, mengelola data mitra, keluhan (complaints), settings, dan seluruh pengguna live. |
| **Registered User** *(Fungsional)* | Dibuat melalui form registrasi frontend (`/register`) | **PostgreSQL Database** *(Hashed Bcrypt)* | **LIVE & TERINTEGRASI PENUH** *(NestJS + PostgreSQL)* | Pengguna publik yang mendaftar melalui form registrasi frontend. Bisa login via username ATAU email, serta password ATAU pin 6 digit. Data tersimpan di database Postgres, menerima JWT token valid, dan seluruh data transaksi, dompet, budget, profil, dan settings tersinkronisasi ke server. |

---

## 2. Fleksibilitas Login & Keamanan Kredensial

Sesuai instruksi:
- **Identifier**: Pengguna (Admin maupun Registered User) dapat login menggunakan **Username** ATAU **Email**.
- **Kredensial Pengaman**: Pengguna dapat login menggunakan **Password** ATAU **PIN** 6 digit.
- **Penyimpanan di Database**:
  - Kolom `password_hash`: Hash Bcrypt dari password/pin pengguna.
  - Kolom `pin_hash`: Hash Bcrypt opsional jika pengguna mengatur PIN transaksi terpisah dari password login.
  - Logika verifikasi: Saat login, sistem memverifikasi kredensial terhadap `password_hash` atau `pin_hash`. Jika salah satu cocok, login berhasil!

---

## 3. Fitur Update & Sinkronisasi Settings (`/settings`)

Semua akun live (Admin maupun Pengguna Terdaftar) dapat melihat, mengedit, dan menyimpan pengaturan di halaman `/settings`:
- **Appearance**: Tema (`light` / `dark`).
- **Localization**: Bahasa (`en` / `id`), Mata Uang Utama (`IDR`, `USD`, `EUR`, dll.), serta daftar mata uang kustom.
- **Budget & Allowance**: Anggaran belanja bulanan (*monthly allowance*), ambang batas peringatan pengeluaran (*spending warning threshold* 70%-90%), dan custom threshold alert.
- **Smart OCR Scanner**: Kecepatan scan (`fast`, `standard`, `thorough`), klasifikasi otomatis (*auto-categorization*), dan konfirmasi sebelum simpan (*review before saving*).
- **Security & Timeout**: Durasi timeout inaktivitas sesi (1, 3, 5, 10 menit), pergantian password akun dan PIN.
- **Notifications**: Pengaturan peringatan pengeluaran, peringatan overbudget, suara notifikasi.
- **Account & Profile**: Pengubahan Nama Lengkap, Username, Email, Nomor Telepon, dan Foto Avatar.

Endpoint API yang disediakan:
- `GET /api/v1/users/settings`: Mengambil konfigurasi preferensi pengguna aktif.
- `PUT /api/v1/users/settings`: Memperbarui seluruh konfigurasi preferensi pengguna aktif secara atomik.

---

## 4. Arsitektur Komponen

### 4.1 Repositori Database: `cuanly-database`
Lokasi: `C:\Users\muhas\Desktop\WORK Projects\cuanly-database`
- **Prisma Schema (`prisma/schema.prisma`)**: Skema model relasional terpadu yang dapat digunakan langsung dengan Prisma CLI.
- **SQL Migration Script (`migrations/01_init.sql`)**: Skrip DDL standar PostgreSQL (kompatibel dengan Vercel Postgres, Neon, Supabase, Cloud SQL, atau Docker).
- **SQL Seed Script (`seeds/seed.sql`)**: Data awal akun live admin (`admin` / `admin123`), 9 kategori default Hick's Law, data awal mitra dan komplain.
- **`docker-compose.yml`**: Konfigurasi opsional bagi pengguna yang ingin menjalankan PostgreSQL lokal di masa mendatang.
- **Dokumentasi Deployment Vercel / Cloud**: Panduan menghubungkan database ke provider cloud PostgreSQL (seperti Vercel Postgres / Neon / Supabase).

### 4.2 Repositori Backend Service: `cuanly-backend`
Lokasi: `C:\Users\muhas\Desktop\WORK Projects\cuanly-backend`
- Framework: **NestJS** (Modular Architecture)
- ORM: **Prisma ORM**
- Modul-modul:
  - `auth`: Login (Username/Email + Password/PIN), Register, Me, Password Update, Profile Update.
  - `users`: Profil, Pengaturan (`/users/settings`), Admin User Management.
  - `transactions`: CRUD transaksi, filter rentang tanggal, search, kategori.
  - `categories`: Kategori default & kustom.
  - `finance`: Perhitungan ringkasan keuangan (*summary*), limit budget per kategori, allowance bulanan.
  - `wallets`: Multi-wallet CRUD dan validasi kuota tier.
  - `debts`: Manajemen utang & piutang (Gold+).
  - `workspace`: Anggota tim shared workspace (B2B).
  - `ocr`: Endpoint simulasi scanner nota belanja.
  - `admin`: Statistik platform, verifikasi mitra, komplain pengguna.
- Keamanan: Hashing Bcrypt, Stateless JWT Guard, Role-Based Access Control (`@Roles('ADMIN')`), Class-Validator Pipes, CORS terproteksi.
- Dokumentasi API: Swagger OpenAPI di `/api/docs`.

### 4.3 Integrasi Frontend: `cuanly-frontend`
Lokasi: `C:\Users\muhas\Desktop\WORK Projects\cuanly-frontend`
- **`src/services/apiClient.ts`**: HTTP client berbasis Axios / Fetch dengan interceptor token JWT dan penanganan error 401.
- **`src/services/api.ts`**: Kumpulan typed API client functions untuk semua modul backend.
- **`src/contexts/AuthContext.tsx`**: Logika hybrid cerdas:
  - Tombol 1-Click Demo User & Demo Admin tetap 100% menggunakan mock lokal.
  - Form Login manual mendukung login akun live admin (`admin` / `admin123`) dan akun registrasi via backend API.
  - Form Registrasi `/register` mengirimkan data ke database PostgreSQL melalui backend.
  - Pergantian password & profil langsung tersinkronisasi ke server.
- **`src/app/(user)/settings/page.tsx`**: Tersinkronisasi dengan endpoint `PUT /api/v1/users/settings` saat pengguna live menyimpan opsi pengaturan apapun.
- **`src/contexts/FinanceContext.tsx` & `AdminContext.tsx`**: Tersinkronisasi langsung dengan data live backend saat pengguna live login.

---

## 5. Rencana Tahapan Eksekusi

1. **Tahap 1**: Membangun skema DDL, Prisma schema, seeder data (Live Admin `admin`/`admin123`), dan docker-compose di `cuanly-database`.
2. **Tahap 2**: Menginisialisasi project NestJS, Prisma ORM, konfigurasi environment, dan Swagger docs di `cuanly-backend`.
3. **Tahap 3**: Mengimplementasikan seluruh modul backend (`auth`, `users`, `settings`, `transactions`, `categories`, `finance`, `wallets`, `debts`, `ocr`, `admin`).
4. **Tahap 4**: Menguji build dan endpoint backend secara menyeluruh.
5. **Tahap 5**: Membangun client API di `cuanly-frontend` dan menghubungkan form login, registrasi, settings, finance, dan admin.
6. **Tahap 6**: Verifikasi end-to-end, update dokumentasi `settings_api_and_flow.md`, dan penyelesaian akhir.

### 3.3 Dynamic Routing Folder Paritas dengan Frontend Next.js
Modul backend diatur dengan folder berstruktur dynamic routing yang identik 100% dengan frontend:
- `src/modules/transaksi/[id]/` ──► Menangani `GET`, `PUT`, `DELETE /api/v1/transaksi/:id`
- `src/modules/budget/[slug]/` ──► Menangani `GET`, `PUT /api/v1/budget/:slug`
- `src/modules/admin/complaints/[id]/` ──► Menangani `GET`, `PUT /api/v1/admin/complaints/:id`
- `src/modules/admin/users/[id]/` ──► Menangani `GET`, `PUT /api/v1/admin/users/:id/toggle-status`
- `src/modules/admin/verification/[id]/` ──► Menangani `GET`, `PUT /api/v1/admin/verification/:id/verify`

### 9. Profile Pictures & Neon / Vercel Cloud Deployment
- [x] **Edit, Upload, Save, and Update Profile Pictures (`avatarUrl`):**
  - Backend `POST /api/v1/auth/avatar` and `PUT /api/v1/auth/profile` handle Base64 Data URLs and image URLs.
  - Express body parser configured with `10mb` payload limit in both `src/main.ts` and `api/index.ts`.
  - Frontend interactive camera upload overlay added directly on `/profil` and file picker on `/settings?tab=account`.
  - Automatic real-time synchronization across `TopHeader`, `ProfilPage`, `SettingsPage`, and backend database.
- [x] **Neon Cloud PostgreSQL Integration:**
  - Dual connection strings supported: pooled `DATABASE_URL` (for serverless lambdas) and direct `DIRECT_URL` (for schema migrations).
  - Updated `prisma/schema.prisma` with `directUrl = env("DIRECT_URL")`.
  - Updated `.env.example` in both backend and database with complete Neon setup guides.
- [x] **Vercel Serverless Backend Deployment:**
  - Serverless entrypoint created at `api/index.ts`.
  - Vercel routing configuration created at `vercel.json`.
  - Build lifecycle scripts configured: `"vercel-build": "prisma generate && nest build"` and `"postinstall": "prisma generate"`.
