-- ============================================================================
-- CUANLY DATABASE SEED DATA (POSTGRESQL)
-- Includes Live Admin Financial Ecosystem, 9 Categories, Wallets, Transactions,
-- Debts, Workspace, Investments, Bank Connections, Mitra, Complaints, & Notifs.
-- ============================================================================

-- 1. SEED LIVE ADMIN ACCOUNT (Username: admin, Email: admin@cuanly.com, Password/PIN: admin123)
-- Bcrypt Hash for admin123: $2a$10$wK4m6O1JzMvV0pD2L7c1r.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa
INSERT INTO users (id, name, username, email, phone, role, password_hash, pin_hash, avatar_url, subscription_tier, is_active, created_at, updated_at)
VALUES (
    'usr_live_admin',
    'Administrator Cuanly',
    'admin',
    'admin@cuanly.com',
    '0811-9876-5432',
    'ADMIN',
    '$2a$10$wK4m6O1JzMvV0pD2L7c1r.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa',
    '$2a$10$wK4m6O1JzMvV0pD2L7c1r.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'B2B',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    role = 'ADMIN',
    subscription_tier = 'B2B',
    is_active = true;

-- Seed Admin Settings
INSERT INTO user_settings (user_id, theme, locale, active_currency, monthly_allowance, spending_warning_threshold, ocr_speed, ocr_auto_cat, ocr_review, session_timeout_ms, custom_currencies, notifications_enabled, sound_enabled, updated_at)
VALUES (
    'usr_live_admin',
    'light',
    'en',
    'IDR',
    10000000,
    80,
    'standard',
    true,
    true,
    180000,
    '[]'::jsonb,
    true,
    true,
    CURRENT_TIMESTAMP
)
ON CONFLICT (user_id) DO NOTHING;

-- 2. SEED DEFAULT 9 SYSTEM CATEGORIES (Hick's Law: 6 Expense + 3 Income)
INSERT INTO categories (id, slug, name_key, fallback_name, icon, color, type, is_system, user_id, created_at)
VALUES
    ('cat_food', 'makanan', 'cat_food', 'Makanan & Minuman', 'Utensils', '#F97316', 'EXPENSE', true, NULL, CURRENT_TIMESTAMP),
    ('cat_transport', 'transportasi', 'cat_transport', 'Transportasi', 'Car', '#0EA5E9', 'EXPENSE', true, NULL, CURRENT_TIMESTAMP),
    ('cat_shopping', 'belanja', 'cat_shopping', 'Belanja', 'ShoppingBag', '#8B5CF6', 'EXPENSE', true, NULL, CURRENT_TIMESTAMP),
    ('cat_entertainment', 'hiburan', 'cat_entertainment', 'Hiburan', 'Film', '#EC4899', 'EXPENSE', true, NULL, CURRENT_TIMESTAMP),
    ('cat_health', 'kesehatan', 'cat_health', 'Kesehatan', 'HeartPulse', '#10B981', 'EXPENSE', true, NULL, CURRENT_TIMESTAMP),
    ('cat_other', 'lainnya', 'cat_other', 'Lainnya', 'MoreHorizontal', '#6B7072', 'EXPENSE', true, NULL, CURRENT_TIMESTAMP),
    ('cat_salary', 'gaji', 'cat_salary', 'Gaji Bulanan', 'Wallet', '#059669', 'INCOME', true, NULL, CURRENT_TIMESTAMP),
    ('cat_freelance', 'freelance', 'cat_freelance', 'Freelance & Bisnis', 'Briefcase', '#2563EB', 'INCOME', true, NULL, CURRENT_TIMESTAMP),
    ('cat_investment', 'investasi', 'cat_investment', 'Investasi & Bunga', 'TrendingUp', '#D97706', 'INCOME', true, NULL, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name_key = EXCLUDED.name_key,
    fallback_name = EXCLUDED.fallback_name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    type = EXCLUDED.type;

-- 3. SEED WALLETS FOR LIVE ADMIN
INSERT INTO wallets (id, user_id, name, type, account_number, balance, color, is_shared, shared_role, created_at, updated_at)
VALUES
    ('wal_admin_cash', 'usr_live_admin', 'Dompet Tunai Kas Kecil', 'CASH', NULL, 3850000, '#10B981', false, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('wal_admin_bca', 'usr_live_admin', 'BCA Prioritas Bisnis', 'BANK', '8820192831', 54200000, '#0284C7', false, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('wal_admin_mandiri', 'usr_live_admin', 'Mandiri Giro Operasional', 'BANK', '1370018291028', 28650000, '#2563EB', false, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('wal_admin_gopay', 'usr_live_admin', 'GoPay Merchant & OVO Bisnis', 'E_WALLET', '0811-9876-5432', 4750000, '#06B6D4', false, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('wal_admin_shared', 'usr_live_admin', 'Shared Treasury Workspace Tim', 'BANK', '7190281990', 95000000, '#8B5CF6', true, 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    balance = EXCLUDED.balance,
    name = EXCLUDED.name,
    updated_at = CURRENT_TIMESTAMP;

-- 4. SEED BUDGET LIMITS FOR LIVE ADMIN
INSERT INTO budget_limits (id, user_id, category_id, category_slug, limit_amount, period, created_at, updated_at)
VALUES
    ('bud_admin_food', 'usr_live_admin', 'cat_food', 'makanan', 4500000, '2026-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('bud_admin_transport', 'usr_live_admin', 'cat_transport', 'transportasi', 2500000, '2026-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('bud_admin_shopping', 'usr_live_admin', 'cat_shopping', 'belanja', 6000000, '2026-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('bud_admin_entertainment', 'usr_live_admin', 'cat_entertainment', 'hiburan', 3000000, '2026-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('bud_admin_health', 'usr_live_admin', 'cat_health', 'kesehatan', 2000000, '2026-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('bud_admin_other', 'usr_live_admin', 'cat_other', 'lainnya', 1500000, '2026-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id, category_id, period) DO UPDATE SET
    limit_amount = EXCLUDED.limit_amount,
    updated_at = CURRENT_TIMESTAMP;

-- 5. SEED RANDOM TRANSACTIONS FOR LIVE ADMIN
INSERT INTO transactions (id, user_id, wallet_id, category_id, category_name, category_slug, type, amount, currency, currency_symbol, date, notes, receipt, created_at, updated_at)
VALUES
    ('tx_admin_01', 'usr_live_admin', 'wal_admin_bca', 'cat_salary', 'Gaji Bulanan', 'gaji', 'INCOME', 35000000, 'IDR', 'Rp', '2026-10-01T08:00:00Z'::timestamp, 'Gaji Eksekutif & Tunjangan Direksi Cuanly Oktober 2026', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_02', 'usr_live_admin', 'wal_admin_mandiri', 'cat_freelance', 'Freelance & Bisnis', 'freelance', 'INCOME', 24500000, 'IDR', 'Rp', '2026-10-04T10:30:00Z'::timestamp, 'Retainer Konsultasi Arsitektur FinTech PT Nusantara', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_03', 'usr_live_admin', 'wal_admin_bca', 'cat_investment', 'Investasi & Bunga', 'investasi', 'INCOME', 4850000, 'IDR', 'Rp', '2026-10-06T14:15:00Z'::timestamp, 'Dividen Saham BBCA Q3 2026 (60 Lot)', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_04', 'usr_live_admin', 'wal_admin_shared', 'cat_freelance', 'Freelance & Bisnis', 'freelance', 'INCOME', 18000000, 'IDR', 'Rp', '2026-10-08T11:00:00Z'::timestamp, 'Pembayaran Lisensi Paket B2B 5 Client Baru', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_05', 'usr_live_admin', 'wal_admin_bca', 'cat_investment', 'Investasi & Bunga', 'investasi', 'INCOME', 1250000, 'IDR', 'Rp', '2026-10-12T09:00:00Z'::timestamp, 'Yield Bulanan Reksadana Sucorinvest Stable Fund', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_06', 'usr_live_admin', 'wal_admin_bca', 'cat_shopping', 'Belanja', 'belanja', 'EXPENSE', 28500000, 'IDR', 'Rp', '2026-10-03T13:45:00Z'::timestamp, 'Pengadaan Laptop Apple MacBook Pro M3 untuk Tech Lead', '{"merchant":"iBox Grand Indonesia","date":"2026-10-03","totalAmount":28500000,"receiptImageUrl":"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80","lineItems":[{"id":"item_ibox_1","name":"MacBook Pro 14\" M3 Pro 18GB/512GB","price":28500000,"quantity":1}],"confidenceScore":99}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_07', 'usr_live_admin', 'wal_admin_mandiri', 'cat_other', 'Lainnya', 'lainnya', 'EXPENSE', 4500000, 'IDR', 'Rp', '2026-10-02T10:00:00Z'::timestamp, 'Sewa Private Office Coworking BSD City Oktober 2026', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_08', 'usr_live_admin', 'wal_admin_bca', 'cat_other', 'Lainnya', 'lainnya', 'EXPENSE', 2450000, 'IDR', 'Rp', '2026-10-05T02:00:00Z'::timestamp, 'Billing AWS Cloud & Neon PostgreSQL Serverless Cluster', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_09', 'usr_live_admin', 'wal_admin_cash', 'cat_food', 'Makanan & Minuman', 'makanan', 'EXPENSE', 1250000, 'IDR', 'Rp', '2026-10-07T13:00:00Z'::timestamp, 'Lunch Meeting dengan Potential Venture Partner di Osteria Gia', '{"merchant":"Osteria Gia Plaza Indonesia","date":"2026-10-07","totalAmount":1250000,"receiptImageUrl":"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80","lineItems":[{"id":"item_osteria_1","name":"Truffle Carbonara & Ribeye Steak","price":950000,"quantity":1},{"id":"item_osteria_2","name":"San Pellegrino & Dessert Panna Cotta","price":300000,"quantity":1}],"confidenceScore":98}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_10', 'usr_live_admin', 'wal_admin_gopay', 'cat_food', 'Makanan & Minuman', 'makanan', 'EXPENSE', 680000, 'IDR', 'Rp', '2026-10-09T18:30:00Z'::timestamp, 'Makan malam tim sprint review di Sushi Tei', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_11', 'usr_live_admin', 'wal_admin_bca', 'cat_transport', 'Transportasi', 'transportasi', 'EXPENSE', 600000, 'IDR', 'Rp', '2026-10-10T07:15:00Z'::timestamp, 'Tiket Kereta Cepat Whoosh Executive PP Jakarta-Bandung (Kunjungan Klien)', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_12', 'usr_live_admin', 'wal_admin_cash', 'cat_transport', 'Transportasi', 'transportasi', 'EXPENSE', 850000, 'IDR', 'Rp', '2026-10-11T16:00:00Z'::timestamp, 'Bensin Shell V-Power & Saldo e-Toll Operasional', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_13', 'usr_live_admin', 'wal_admin_mandiri', 'cat_health', 'Kesehatan', 'kesehatan', 'EXPENSE', 1750000, 'IDR', 'Rp', '2026-10-13T10:00:00Z'::timestamp, 'Medical Check-up & Vitamin C Booster Tim', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_14', 'usr_live_admin', 'wal_admin_bca', 'cat_shopping', 'Belanja', 'belanja', 'EXPENSE', 1950000, 'IDR', 'Rp', '2026-10-14T15:20:00Z'::timestamp, 'Monitor Dell UltraSharp 27" 4K untuk Dashboard Monitoring', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_15', 'usr_live_admin', 'wal_admin_gopay', 'cat_entertainment', 'Hiburan', 'hiburan', 'EXPENSE', 1450000, 'IDR', 'Rp', '2026-10-15T19:00:00Z'::timestamp, 'Team Bonding Bowling & Dinner di Spincity BSD', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_16', 'usr_live_admin', 'wal_admin_cash', 'cat_food', 'Makanan & Minuman', 'makanan', 'EXPENSE', 420000, 'IDR', 'Rp', '2026-10-16T11:30:00Z'::timestamp, 'Stok Kopi Specialty Beans & Susu Oat Pantry Kantor', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_17', 'usr_live_admin', 'wal_admin_bca', 'cat_other', 'Lainnya', 'lainnya', 'EXPENSE', 1200000, 'IDR', 'Rp', '2026-10-17T08:30:00Z'::timestamp, 'Langganan ChatGPT Team & GitHub Enterprise Suite', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_18', 'usr_live_admin', 'wal_admin_mandiri', 'cat_transport', 'Transportasi', 'transportasi', 'EXPENSE', 280000, 'IDR', 'Rp', '2026-10-17T17:15:00Z'::timestamp, 'Bluebird Silver Bird Bandara ke Headquarter', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_19', 'usr_live_admin', 'wal_admin_cash', 'cat_shopping', 'Belanja', 'belanja', 'EXPENSE', 580000, 'IDR', 'Rp', '2026-10-18T14:00:00Z'::timestamp, 'Perlengkapan Kebersihan & ATK Superindo', '{"merchant":"Superindo Supermarket","date":"2026-10-18","totalAmount":580000,"receiptImageUrl":"https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80","lineItems":[{"id":"item_sup_1","name":"Paper Towel & Hand Sanitizer","price":240000,"quantity":2},{"id":"item_sup_2","name":"Coffee Refill & Mineral Water Galon","price":340000,"quantity":1}],"confidenceScore":97}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tx_admin_20', 'usr_live_admin', 'wal_admin_bca', 'cat_food', 'Makanan & Minuman', 'makanan', 'EXPENSE', 350000, 'IDR', 'Rp', '2026-10-19T12:00:00Z'::timestamp, 'Makan Siang Soto Betawi & Jus Alpukat bersama tim developer', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    notes = EXCLUDED.notes,
    date = EXCLUDED.date,
    updated_at = CURRENT_TIMESTAMP;

-- 6. SEED DEBTS & RECEIVABLES FOR LIVE ADMIN
INSERT INTO debts (id, user_id, type, person_name, amount, due_date, notes, is_settled, tenor_months, interest_rate, installment_amount, paid_amount, created_at, updated_at)
VALUES
    ('debt_admin_01', 'usr_live_admin', 'RECEIVABLE', 'PT Sinar Digital Abadi (Client Enterprise)', 18000000, '2026-11-20', 'Piutang Termin 2 Jasa Pengembangan Backend & PostgreSQL Optimization', false, 3, 0, 6000000, 6000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('debt_admin_02', 'usr_live_admin', 'RECEIVABLE', 'Hendro Wijaya (Owner Kopi Kenangan Jaya)', 5500000, '2026-10-31', 'Talangan Bridging Mesin POS Kasir & Tablet Kasir Cabang 2', false, 2, 0, 2750000, 2750000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('debt_admin_03', 'usr_live_admin', 'RECEIVABLE', 'Dr. Maria Ulfa (Apotek Sehat Sentosa)', 7800000, '2026-11-15', 'Invoice Layanan Custom Budgeting & Auto-Sync Transaksi Farmasi', false, 1, 0, 7800000, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('debt_admin_04', 'usr_live_admin', 'DEBT', 'Vendor IT Distributor Jaya Sentosa', 12000000, '2026-12-10', 'Cicilan Pengadaan Server Rack Backup & UPS Kantor', false, 6, 5, 2100000, 4200000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('debt_admin_05', 'usr_live_admin', 'DEBT', 'Bank Mandiri (Kredit Modal Kerja Bisnis)', 25000000, '2026-11-25', 'Fasilitas Modal Kerja Operasional B2B Multi-Tenant Platform', false, 12, 6, 2208333, 11041665, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('debt_admin_06', 'usr_live_admin', 'DEBT', 'Kantor Pajak Pratama (PPh Final UMKM PP 23)', 1450000, '2026-10-25', 'Kewajiban Setoran PPh Final Masa Pajak September 2026', false, 1, 0, 1450000, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    is_settled = EXCLUDED.is_settled,
    paid_amount = EXCLUDED.paid_amount,
    updated_at = CURRENT_TIMESTAMP;

-- 7. SEED WORKSPACE MEMBERS (B2B SHARED WORKSPACE)
INSERT INTO workspace_members (id, owner_id, name, email, role, avatar_url, status, created_at)
VALUES
    ('mem_admin_01', 'usr_live_admin', 'Administrator Cuanly (Anda)', 'admin@cuanly.com', 'OWNER', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'ACTIVE', CURRENT_TIMESTAMP),
    ('mem_admin_02', 'usr_live_admin', 'Siti Rahmawati, S.E. (Head of Finance)', 'siti.rahma@cuanly.com', 'ADMIN', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'ACTIVE', CURRENT_TIMESTAMP),
    ('mem_admin_03', 'usr_live_admin', 'Dimas Arya Prasetya (VP Business Dev)', 'dimas.arya@cuanly.com', 'ADMIN', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'ACTIVE', CURRENT_TIMESTAMP),
    ('mem_admin_04', 'usr_live_admin', 'Nadia Safitri (Treasury Specialist)', 'nadia.safitri@cuanly.com', 'MEMBER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'ACTIVE', CURRENT_TIMESTAMP),
    ('mem_admin_05', 'usr_live_admin', 'Kevin Sanjaya, CPA (External Auditor)', 'kevin.sanjaya@mitracuan.id', 'MEMBER', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'INVITED', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    status = EXCLUDED.status;

-- 8. SEED INVESTMENT ASSETS FOR LIVE ADMIN
INSERT INTO investment_assets (id, user_id, name, category, quantity, buy_price, current_price, notes, created_at, updated_at)
VALUES
    ('ast_admin_01', 'usr_live_admin', 'PT Bank Central Asia Tbk (BBCA)', 'SAHAM', 6000, 8850, 10350, '60 Lot Saham Bluechip Dividen Konsisten', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ast_admin_02', 'usr_live_admin', 'Sucorinvest Stable Fund', 'REKSADANA', 18500, 2150, 2410, 'Reksadana Pendapatan Tetap Alokasi Kas Siaga', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ast_admin_03', 'usr_live_admin', 'Logam Mulia Emas Antam CertiCard', 'EMAS', 50, 1180000, 1490000, '50 Gram Emas Batangan Fisik Brankas Kantor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ast_admin_04', 'usr_live_admin', 'Bitcoin (BTC) Reserve', 'CRYPTO', 0.25, 820000000, 1080000000, 'Cadangan Aset Kripto Cold Hardware Wallet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ast_admin_05', 'usr_live_admin', 'Ruko Komersial 2 Lantai BSD Sinarmas', 'PROPERTI', 1, 1350000000, 1580000000, 'Aset Properti Komersial Disewakan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    current_price = EXCLUDED.current_price,
    quantity = EXCLUDED.quantity,
    updated_at = CURRENT_TIMESTAMP;

-- 9. SEED BANK CONNECTIONS (AUTOMATED BANK SYNC)
INSERT INTO bank_connections (id, user_id, institution, account_number, account_name, sync_status, last_sync_at, auto_sync, created_at)
VALUES
    ('bnk_admin_01', 'usr_live_admin', 'BCA', '8820192831', 'PT Cuanly Inovasi Digital', 'CONNECTED', CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP),
    ('bnk_admin_02', 'usr_live_admin', 'MANDIRI', '1370018291028', 'PT Cuanly Inovasi Digital', 'CONNECTED', CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP),
    ('bnk_admin_03', 'usr_live_admin', 'BRI', '020601002918302', 'PT Cuanly Inovasi Digital', 'CONNECTED', CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP),
    ('bnk_admin_04', 'usr_live_admin', 'GOPAY', '0811-9876-5432', 'Cuanly Official Store', 'CONNECTED', CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    sync_status = EXCLUDED.sync_status,
    last_sync_at = CURRENT_TIMESTAMP;

-- 10. SEED BUSINESS PROFILE (BISNIS & PAJAK UMKM)
INSERT INTO business_profiles (id, user_id, business_name, npwp, period, annual_revenue, operating_expense, cash_runway_months, tax_rate, created_at, updated_at)
VALUES
    ('biz_admin_01', 'usr_live_admin', 'PT Cuanly Inovasi Finansial', '01.234.567.8-012.000', '2026', 580000000, 215000000, 22.4, 0.005, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO UPDATE SET
    annual_revenue = EXCLUDED.annual_revenue,
    operating_expense = EXCLUDED.operating_expense,
    cash_runway_months = EXCLUDED.cash_runway_months,
    updated_at = CURRENT_TIMESTAMP;

-- 11. SEED MITRA PARTNER APPLICATIONS (FOR ADMIN VERIFICATION)
INSERT INTO mitra (id, business_name, owner_name, email, phone, category, verification_status, submission_date, document_type, document_number, notes, created_at, updated_at)
VALUES
    ('mitra_01', 'Warung Kopi Kenangan Jaya', 'Hendro Wijaya', 'hendro@kopikenangan.id', '0813-2233-4455', 'Kuliner / F&B', 'PENDING', CURRENT_TIMESTAMP - INTERVAL '2 days', 'NIB & SIUP', '9120001234567', 'Menunggu review izin edar & rekening perusahaan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('mitra_02', 'Apotek Sehat Sentosa', 'Dr. Maria Ulfa', 'maria@apoteksehat.com', '0812-9988-7766', 'Kesehatan & Farmasi', 'VERIFIED', CURRENT_TIMESTAMP - INTERVAL '5 days', 'SIA & SIPA', '440/123/DISKES/2026', 'Dokumen lengkap dan validasi Kemenkes berhasil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('mitra_03', 'Bengkel Cepat Makmur', 'Agus Subagyo', 'agus@bengkelmakmur.co.id', '0815-4433-2211', 'Jasa Otomotif', 'REJECTED', CURRENT_TIMESTAMP - INTERVAL '7 days', 'KTP & NPWP', '3201123456780001', 'Foto SIUP buram dan alamat KTP tidak sinkron', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('mitra_04', 'Laundry Bersih Kilat', 'Dewi Lestari', 'dewi@bersihkilat.id', '0819-7766-5544', 'Jasa Rumah Tangga', 'PENDING', CURRENT_TIMESTAMP - INTERVAL '1 days', 'NIB Usaha Mikro', '1205009876543', 'Permohonan baru masuk kemarin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 12. SEED COMPLAINTS & TICKETS (FOR ADMIN RESOLUTION)
INSERT INTO complaints (id, ticket_id, user_id, user_name, user_email, title, description, priority, status, resolution_note, created_at, updated_at)
VALUES
    ('cmp_01', 'TCK-2026-089', 'usr_02', 'Rian Pratama', 'rian@gmail.com', 'Gagal scan struk nota Indomaret', 'Foto nota saya tidak terbaca nominal totalnya, sistem OCR menampilkan angka 0.', 'MEDIUM', 'IN_PROGRESS', 'Tim teknis sedang meningkatkan toleransi kontras pada OCR scan struk termal.', CURRENT_TIMESTAMP - INTERVAL '1 days', CURRENT_TIMESTAMP),
    ('cmp_02', 'TCK-2026-088', 'usr_03', 'Anisa Kusuma', 'anisa.k@outlook.com', 'Notifikasi budget lewat batas tidak berdering', 'Pengeluaran makanan saya sudah 90% tapi belum ada notifikasi pop-up di layar.', 'HIGH', 'OPEN', NULL, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP),
    ('cmp_03', 'TCK-2026-085', 'usr_04', 'Farhan Dwi', 'farhan.dwi@yahoo.co.id', 'Permintaan ekspor data format CSV bulanan', 'Apakah bisa ditambahkan kolom kategori slug pada file CSV yang diekspor?', 'LOW', 'RESOLVED', 'Fitur ekspor CSV sudah diperbarui menyertakan kolom Kategori dan ID Transaksi.', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 13. SEED NOTIFICATIONS FOR LIVE ADMIN
INSERT INTO notifications (id, user_id, title, title_en, message, message_en, type, is_read, link, created_at)
VALUES
    ('notif_admin_01', 'usr_live_admin', 'Dividen Saham BBCA Berhasil Masuk', 'BBCA Stock Dividend Received', 'Dividen sebesar Rp 4.850.000 telah masuk ke rekening BCA Prioritas Bisnis Anda.', 'Dividend of Rp 4,850,000 has been credited to your BCA Prioritas account.', 'SUCCESS', false, '/investasi', CURRENT_TIMESTAMP),
    ('notif_admin_02', 'usr_live_admin', 'Pelunasan Invoice Klien PT Sinar Digital', 'Client Invoice Paid by PT Sinar Digital', 'Pembayaran invoice termin kedua Rp 6.000.000 berhasil diterima di kas perusahaan.', 'Second milestone payment of Rp 6,000,000 successfully received.', 'SUCCESS', false, '/debts', CURRENT_TIMESTAMP),
    ('notif_admin_03', 'usr_live_admin', 'Kalkulasi Estimasi Pajak UMKM 2026', 'SME Tax Estimate 2026', 'Omzet kumulatif tahun 2026 mencapai Rp 580 Juta. Estimasi PPh Final PP 23 adalah Rp 2.900.000.', 'Cumulative 2026 revenue is Rp 580M. Estimated Final Income Tax is Rp 2,900,000.', 'INFO', true, '/bisnis', CURRENT_TIMESTAMP),
    ('notif_admin_04', 'usr_live_admin', 'Auto-Sync Bank BCA & Mandiri Aktif', 'BCA & Mandiri Auto-Sync Active', 'Sistem auto-sync berhasil memvalidasi 24 mutasi terbaru secara otomatis tanpa jeda.', 'Auto-sync engine successfully validated 24 fresh mutations automatically.', 'INFO', true, '/bank-sync', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
