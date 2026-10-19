import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Cuanly database seeding with Live Admin Financial Ecosystem...');

  // 1. Live Admin Account (Username: admin, Email: admin@cuanly.com, Password/PIN: admin123)
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash,
      pinHash: passwordHash,
      role: 'ADMIN',
      subscriptionTier: 'B2B',
      isActive: true,
    },
    create: {
      id: 'usr_live_admin',
      name: 'Administrator Cuanly',
      username: 'admin',
      email: 'admin@cuanly.com',
      phone: '0811-9876-5432',
      role: 'ADMIN',
      passwordHash,
      pinHash: passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      subscriptionTier: 'B2B',
      isActive: true,
    },
  });

  // Seed Admin Settings
  await prisma.userSettings.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      theme: 'light',
      locale: 'en',
      activeCurrency: 'IDR',
      monthlyAllowance: BigInt(10000000),
      spendingWarningThreshold: 80,
      ocrSpeed: 'standard',
      ocrAutoCat: true,
      ocrReview: true,
      sessionTimeoutMs: 180000,
      notificationsEnabled: true,
      soundEnabled: true,
    },
  });

  console.log(`✅ Live Admin created/updated: ${admin.username} (${admin.email})`);

  // 2. Default 9 System Categories (Hick's Law: 6 Expense + 3 Income)
  const defaultCategories = [
    { id: 'cat_food', slug: 'makanan', nameKey: 'cat_food', fallbackName: 'Makanan & Minuman', icon: 'Utensils', color: '#F97316', type: 'EXPENSE' },
    { id: 'cat_transport', slug: 'transportasi', nameKey: 'cat_transport', fallbackName: 'Transportasi', icon: 'Car', color: '#0EA5E9', type: 'EXPENSE' },
    { id: 'cat_shopping', slug: 'belanja', nameKey: 'cat_shopping', fallbackName: 'Belanja', icon: 'ShoppingBag', color: '#8B5CF6', type: 'EXPENSE' },
    { id: 'cat_entertainment', slug: 'hiburan', nameKey: 'cat_entertainment', fallbackName: 'Hiburan', icon: 'Film', color: '#EC4899', type: 'EXPENSE' },
    { id: 'cat_health', slug: 'kesehatan', nameKey: 'cat_health', fallbackName: 'Kesehatan', icon: 'HeartPulse', color: '#10B981', type: 'EXPENSE' },
    { id: 'cat_other', slug: 'lainnya', nameKey: 'cat_other', fallbackName: 'Lainnya', icon: 'MoreHorizontal', color: '#6B7072', type: 'EXPENSE' },
    { id: 'cat_salary', slug: 'gaji', nameKey: 'cat_salary', fallbackName: 'Gaji Bulanan', icon: 'Wallet', color: '#059669', type: 'INCOME' },
    { id: 'cat_freelance', slug: 'freelance', nameKey: 'cat_freelance', fallbackName: 'Freelance & Bisnis', icon: 'Briefcase', color: '#2563EB', type: 'INCOME' },
    { id: 'cat_investment', slug: 'investasi', nameKey: 'cat_investment', fallbackName: 'Investasi & Bunga', icon: 'TrendingUp', color: '#D97706', type: 'INCOME' },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: { ...cat, isSystem: true },
    });
  }
  console.log('✅ 9 System Categories seeded.');

  // Load Seed Dataset
  const seedDataPath = path.join(__dirname, '../seeds/admin_financial_data.json');
  const adminData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

  // 3. Wallets
  for (const w of adminData.wallets) {
    await prisma.wallet.upsert({
      where: { id: w.id },
      update: { balance: BigInt(w.balance), name: w.name },
      create: {
        id: w.id,
        userId: admin.id,
        name: w.name,
        type: w.type,
        accountNumber: w.accountNumber,
        balance: BigInt(w.balance),
        color: w.color,
        isShared: w.isShared,
        sharedRole: w.sharedRole || 'ADMIN',
      },
    });
  }
  console.log(`✅ ${adminData.wallets.length} Wallets seeded.`);

  // 4. Budget Limits
  for (const b of adminData.budgetLimits) {
    await prisma.budgetLimit.upsert({
      where: {
        uq_user_cat_period: {
          userId: admin.id,
          categoryId: b.categoryId,
          period: b.period,
        },
      },
      update: { limitAmount: BigInt(b.limitAmount) },
      create: {
        id: b.id,
        userId: admin.id,
        categoryId: b.categoryId,
        categorySlug: b.categorySlug,
        limitAmount: BigInt(b.limitAmount),
        period: b.period,
      },
    });
  }
  console.log(`✅ ${adminData.budgetLimits.length} Budget limits seeded.`);

  // 5. Transactions
  for (const t of adminData.transactions) {
    await prisma.transaction.upsert({
      where: { id: t.id },
      update: { amount: BigInt(t.amount), notes: t.notes },
      create: {
        id: t.id,
        userId: admin.id,
        walletId: t.walletId,
        categoryId: t.categoryId,
        categoryName: t.categoryName,
        categorySlug: t.categorySlug,
        type: t.type,
        amount: BigInt(t.amount),
        currency: 'IDR',
        currencySymbol: 'Rp',
        date: new Date(t.date),
        notes: t.notes,
        receipt: t.receipt || undefined,
      },
    });
  }
  console.log(`✅ ${adminData.transactions.length} Transactions seeded.`);

  // 6. Debts & Receivables
  for (const d of adminData.debts) {
    await prisma.debt.upsert({
      where: { id: d.id },
      update: { amount: BigInt(d.amount), paidAmount: BigInt(d.paidAmount || 0), isSettled: d.isSettled },
      create: {
        id: d.id,
        userId: admin.id,
        type: d.type,
        personName: d.personName,
        amount: BigInt(d.amount),
        dueDate: d.dueDate,
        notes: d.notes,
        isSettled: d.isSettled,
        tenorMonths: d.tenorMonths,
        interestRate: d.interestRate,
        installmentAmount: d.installmentAmount ? BigInt(d.installmentAmount) : null,
        paidAmount: BigInt(d.paidAmount || 0),
      },
    });
  }
  console.log(`✅ ${adminData.debts.length} Debts & Receivables seeded.`);

  // 7. Workspace Members
  for (const m of adminData.workspaceMembers) {
    await prisma.workspaceMember.upsert({
      where: { id: m.id },
      update: { role: m.role, status: m.status },
      create: {
        id: m.id,
        ownerId: admin.id,
        name: m.name,
        email: m.email,
        role: m.role,
        avatarUrl: m.avatarUrl,
        status: m.status,
      },
    });
  }
  console.log(`✅ ${adminData.workspaceMembers.length} Workspace Members seeded.`);

  // 8. Investment Assets
  for (const a of adminData.investmentAssets) {
    await prisma.investmentAsset.upsert({
      where: { id: a.id },
      update: { currentPrice: BigInt(a.currentPrice), quantity: a.quantity },
      create: {
        id: a.id,
        userId: admin.id,
        name: a.name,
        category: a.category,
        quantity: a.quantity,
        buyPrice: BigInt(a.buyPrice),
        currentPrice: BigInt(a.currentPrice),
        notes: a.notes,
      },
    });
  }
  console.log(`✅ ${adminData.investmentAssets.length} Investment Assets seeded.`);

  // 9. Bank Connections
  for (const b of adminData.bankConnections) {
    await prisma.bankConnection.upsert({
      where: { id: b.id },
      update: { syncStatus: b.syncStatus },
      create: {
        id: b.id,
        userId: admin.id,
        institution: b.institution,
        accountNumber: b.accountNumber,
        accountName: b.accountName,
        syncStatus: b.syncStatus,
        lastSyncAt: new Date(),
        autoSync: b.autoSync,
      },
    });
  }
  console.log(`✅ ${adminData.bankConnections.length} Bank Connections seeded.`);

  // 10. Business Profile
  const bp = adminData.businessProfile;
  await prisma.businessProfile.upsert({
    where: { userId: admin.id },
    update: { annualRevenue: BigInt(bp.annualRevenue), operatingExpense: BigInt(bp.operatingExpense) },
    create: {
      id: bp.id,
      userId: admin.id,
      businessName: bp.businessName,
      npwp: bp.npwp,
      period: bp.period,
      annualRevenue: BigInt(bp.annualRevenue),
      operatingExpense: BigInt(bp.operatingExpense),
      cashRunwayMonths: bp.cashRunwayMonths,
      taxRate: bp.taxRate,
    },
  });
  console.log('✅ Business Profile seeded.');

  // 11. Mitra
  const mitraList = [
    { id: 'mitra_01', businessName: 'Warung Kopi Kenangan Jaya', ownerName: 'Hendro Wijaya', email: 'hendro@kopikenangan.id', phone: '0813-2233-4455', category: 'Kuliner / F&B', verificationStatus: 'PENDING', documentType: 'NIB & SIUP', documentNumber: '9120001234567', notes: 'Menunggu review izin edar & rekening perusahaan' },
    { id: 'mitra_02', businessName: 'Apotek Sehat Sentosa', ownerName: 'Dr. Maria Ulfa', email: 'maria@apoteksehat.com', phone: '0812-9988-7766', category: 'Kesehatan & Farmasi', verificationStatus: 'VERIFIED', documentType: 'SIA & SIPA', documentNumber: '440/123/DISKES/2026', notes: 'Dokumen lengkap dan validasi Kemenkes berhasil' },
    { id: 'mitra_03', businessName: 'Bengkel Cepat Makmur', ownerName: 'Agus Subagyo', email: 'agus@bengkelmakmur.co.id', phone: '0815-4433-2211', category: 'Jasa Otomotif', verificationStatus: 'REJECTED', documentType: 'KTP & NPWP', documentNumber: '3201123456780001', notes: 'Foto SIUP buram dan alamat KTP tidak sinkron' },
    { id: 'mitra_04', businessName: 'Laundry Bersih Kilat', ownerName: 'Dewi Lestari', email: 'dewi@bersihkilat.id', phone: '0819-7766-5544', category: 'Jasa Rumah Tangga', verificationStatus: 'PENDING', documentType: 'NIB Usaha Mikro', documentNumber: '1205009876543', notes: 'Permohonan baru masuk kemarin' },
  ];

  for (const m of mitraList) {
    await prisma.mitra.upsert({ where: { id: m.id }, update: m, create: m });
  }
  console.log('✅ Mitra partners seeded.');

  // 12. Complaints
  const complaints = [
    { id: 'cmp_01', ticketId: 'TCK-2026-089', userId: 'usr_02', userName: 'Rian Pratama', userEmail: 'rian@gmail.com', title: 'Gagal scan struk nota Indomaret', description: 'Foto nota saya tidak terbaca nominal totalnya, sistem OCR menampilkan angka 0.', priority: 'MEDIUM', status: 'IN_PROGRESS', resolutionNote: 'Tim teknis sedang meningkatkan toleransi kontras pada OCR scan struk termal.' },
    { id: 'cmp_02', ticketId: 'TCK-2026-088', userId: 'usr_03', userName: 'Anisa Kusuma', userEmail: 'anisa.k@outlook.com', title: 'Notifikasi budget lewat batas tidak berdering', description: 'Pengeluaran makanan saya sudah 90% tapi belum ada notifikasi pop-up di layar.', priority: 'HIGH', status: 'OPEN' },
    { id: 'cmp_03', ticketId: 'TCK-2026-085', userId: 'usr_04', userName: 'Farhan Dwi', userEmail: 'farhan.dwi@yahoo.co.id', title: 'Permintaan ekspor data format CSV bulanan', description: 'Apakah bisa ditambahkan kolom kategori slug pada file CSV yang diekspor?', priority: 'LOW', status: 'RESOLVED', resolutionNote: 'Fitur ekspor CSV sudah diperbarui menyertakan kolom Kategori dan ID Transaksi.' },
  ];

  for (const c of complaints) {
    await prisma.complaint.upsert({ where: { ticketId: c.ticketId }, update: c, create: c });
  }
  console.log('✅ Complaints seeded.');

  // 13. Notifications
  for (const n of adminData.notifications) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: { isRead: n.isRead },
      create: {
        id: n.id,
        userId: admin.id,
        title: n.title,
        titleEn: n.titleEn,
        message: n.message,
        messageEn: n.messageEn,
        type: n.type,
        isRead: n.isRead,
        link: n.link,
      },
    });
  }
  console.log(`✅ ${adminData.notifications.length} Notifications seeded.`);
  console.log('🎉 Live Admin financial ecosystem seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
