import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Cuanly database seeding...');

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
    {
      id: 'cat_food',
      slug: 'makanan',
      nameKey: 'cat_food',
      fallbackName: 'Makanan & Minuman',
      icon: 'Utensils',
      color: '#F97316',
      type: 'EXPENSE',
    },
    {
      id: 'cat_transport',
      slug: 'transportasi',
      nameKey: 'cat_transport',
      fallbackName: 'Transportasi',
      icon: 'Car',
      color: '#0EA5E9',
      type: 'EXPENSE',
    },
    {
      id: 'cat_shopping',
      slug: 'belanja',
      nameKey: 'cat_shopping',
      fallbackName: 'Belanja',
      icon: 'ShoppingBag',
      color: '#8B5CF6',
      type: 'EXPENSE',
    },
    {
      id: 'cat_entertainment',
      slug: 'hiburan',
      nameKey: 'cat_entertainment',
      fallbackName: 'Hiburan',
      icon: 'Film',
      color: '#EC4899',
      type: 'EXPENSE',
    },
    {
      id: 'cat_health',
      slug: 'kesehatan',
      nameKey: 'cat_health',
      fallbackName: 'Kesehatan',
      icon: 'HeartPulse',
      color: '#10B981',
      type: 'EXPENSE',
    },
    {
      id: 'cat_other',
      slug: 'lainnya',
      nameKey: 'cat_other',
      fallbackName: 'Lainnya',
      icon: 'MoreHorizontal',
      color: '#6B7072',
      type: 'EXPENSE',
    },
    {
      id: 'cat_salary',
      slug: 'gaji',
      nameKey: 'cat_salary',
      fallbackName: 'Gaji Bulanan',
      icon: 'Wallet',
      color: '#059669',
      type: 'INCOME',
    },
    {
      id: 'cat_freelance',
      slug: 'freelance',
      nameKey: 'cat_freelance',
      fallbackName: 'Freelance & Bisnis',
      icon: 'Briefcase',
      color: '#2563EB',
      type: 'INCOME',
    },
    {
      id: 'cat_investment',
      slug: 'investasi',
      nameKey: 'cat_investment',
      fallbackName: 'Investasi & Bunga',
      icon: 'TrendingUp',
      color: '#D97706',
      type: 'INCOME',
    },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: {
        ...cat,
        isSystem: true,
      },
    });
  }
  console.log('✅ 9 System Categories seeded.');

  // 3. Mitra applications
  const mitraList = [
    {
      id: 'mitra_01',
      businessName: 'Warung Kopi Kenangan Jaya',
      ownerName: 'Hendro Wijaya',
      email: 'hendro@kopikenangan.id',
      phone: '0813-2233-4455',
      category: 'Kuliner / F&B',
      verificationStatus: 'PENDING',
      documentType: 'NIB & SIUP',
      documentNumber: '9120001234567',
      notes: 'Menunggu review izin edar & rekening perusahaan',
    },
    {
      id: 'mitra_02',
      businessName: 'Apotek Sehat Sentosa',
      ownerName: 'Dr. Maria Ulfa',
      email: 'maria@apoteksehat.com',
      phone: '0812-9988-7766',
      category: 'Kesehatan & Farmasi',
      verificationStatus: 'VERIFIED',
      documentType: 'SIA & SIPA',
      documentNumber: '440/123/DISKES/2026',
      notes: 'Dokumen lengkap dan validasi Kemenkes berhasil',
    },
    {
      id: 'mitra_03',
      businessName: 'Bengkel Cepat Makmur',
      ownerName: 'Agus Subagyo',
      email: 'agus@bengkelmakmur.co.id',
      phone: '0815-4433-2211',
      category: 'Jasa Otomotif',
      verificationStatus: 'REJECTED',
      documentType: 'KTP & NPWP',
      documentNumber: '3201123456780001',
      notes: 'Foto SIUP buram dan alamat KTP tidak sinkron',
    },
    {
      id: 'mitra_04',
      businessName: 'Laundry Bersih Kilat',
      ownerName: 'Dewi Lestari',
      email: 'dewi@bersihkilat.id',
      phone: '0819-7766-5544',
      category: 'Jasa Rumah Tangga',
      verificationStatus: 'PENDING',
      documentType: 'NIB Usaha Mikro',
      documentNumber: '1205009876543',
      notes: 'Permohonan baru masuk kemarin',
    },
  ];

  for (const m of mitraList) {
    await prisma.mitra.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log('✅ Mitra partners seeded.');

  // 4. Complaints
  const complaints = [
    {
      id: 'cmp_01',
      ticketId: 'TCK-2026-089',
      userId: 'usr_02',
      userName: 'Rian Pratama',
      userEmail: 'rian@gmail.com',
      title: 'Gagal scan struk nota Indomaret',
      description: 'Foto nota saya tidak terbaca nominal totalnya, sistem OCR menampilkan angka 0.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      resolutionNote: 'Tim teknis sedang meningkatkan toleransi kontras pada OCR scan struk termal.',
    },
    {
      id: 'cmp_02',
      ticketId: 'TCK-2026-088',
      userId: 'usr_03',
      userName: 'Anisa Kusuma',
      userEmail: 'anisa.k@outlook.com',
      title: 'Notifikasi budget lewat batas tidak berdering',
      description: 'Pengeluaran makanan saya sudah 90% tapi belum ada notifikasi pop-up di layar.',
      priority: 'HIGH',
      status: 'OPEN',
    },
    {
      id: 'cmp_03',
      ticketId: 'TCK-2026-085',
      userId: 'usr_04',
      userName: 'Farhan Dwi',
      userEmail: 'farhan.dwi@yahoo.co.id',
      title: 'Permintaan ekspor data format CSV bulanan',
      description: 'Apakah bisa ditambahkan kolom kategori slug pada file CSV yang diekspor?',
      priority: 'LOW',
      status: 'RESOLVED',
      resolutionNote: 'Fitur ekspor CSV sudah diperbarui menyertakan kolom Kategori dan ID Transaksi.',
    },
  ];

  for (const c of complaints) {
    await prisma.complaint.upsert({
      where: { ticketId: c.ticketId },
      update: c,
      create: c,
    });
  }
  console.log('✅ Complaints seeded.');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
