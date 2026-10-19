import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

export interface PricingPlan {
  id: 'FREE' | 'SILVER' | 'GOLD' | 'B2B';
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  priceMonthlyFormatted: string;
  priceAnnualFormatted: string;
  badge?: string;
  walletLimit: number | 'UNLIMITED';
  features: string[];
  isPopular?: boolean;
}

@Injectable()
export class PricingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  getPlans(): PricingPlan[] {
    return [
      {
        id: 'FREE',
        name: 'Basic (Free)',
        tagline: 'Solusi dasar pencatatan arus kas dan transaksi harian',
        priceMonthly: 0,
        priceAnnual: 0,
        priceMonthlyFormatted: 'Rp0',
        priceAnnualFormatted: 'Rp0',
        walletLimit: 2,
        features: [
          'Maksimal 2 Dompet (Wallets)',
          'Pencatatan Pemasukan & Pengeluaran',
          'Smart OCR Scan Struk Belanja',
          'Statistik & Analisis Keuangan Dasar',
          'Dukungan Multi-Mata Uang & Bahasa',
        ],
      },
      {
        id: 'SILVER',
        name: 'Personal Pro (Silver)',
        tagline: 'Manajemen keuangan tanpa batas dengan ekspor data leluasa',
        priceMonthly: 10000,
        priceAnnual: 89000,
        priceMonthlyFormatted: 'Rp10.000 / bulan',
        priceAnnualFormatted: 'Rp89.000 / tahun',
        walletLimit: 'UNLIMITED',
        isPopular: true,
        badge: 'PALING POPULER',
        features: [
          'Semua Fitur Basic (Free)',
          'Dompet Kas & Bank Tanpa Batas (Unlimited Wallets)',
          'Ekspor Laporan Keuangan ke format CSV & Excel',
          'Filter Grafik & Transaksi Rentang Tanggal Kustom',
          'Pengalaman Aplikasi Bersih Bebas Iklan',
        ],
      },
      {
        id: 'GOLD',
        name: 'Financial Expert (Gold)',
        tagline: 'Kontrol finansial menyeluruh dengan monitoring utang & custom alert',
        priceMonthly: 25000,
        priceAnnual: 199000,
        priceMonthlyFormatted: 'Rp25.000 / bulan',
        priceAnnualFormatted: 'Rp199.000 / tahun',
        walletLimit: 'UNLIMITED',
        badge: 'FITUR TERLENGKAP',
        features: [
          'Semua Fitur Personal Pro (Silver)',
          'Manajemen Utang & Piutang Lengkap dengan Tanggal Jatuh Tempo',
          'Ambang Batas Peringatan Pengeluaran Kustom (Custom Threshold)',
          'Prioritas Sinkronisasi Cloud Backup Otomatis',
          'Laporan Kategori Anggaran Mendalam',
        ],
      },
      {
        id: 'B2B',
        name: 'Team & Enterprise (B2B)',
        tagline: 'Kolaborasi kas tim multi-pengguna untuk UMKM dan bisnis modern',
        priceMonthly: 59000,
        priceAnnual: 566400,
        priceMonthlyFormatted: 'Rp59.000 / bulan',
        priceAnnualFormatted: 'Rp566.400 / tahun (Hemat 20%)',
        walletLimit: 'UNLIMITED',
        badge: 'UNTUK TIM & BISNIS',
        features: [
          'Semua Fitur Financial Expert (Gold)',
          'Shared Workspace Tim (Multi-Pengguna hingga 3-5 Akun)',
          'Satu Database Kas Dompet Bersama Real-Time',
          'Role Permissions & Access Control (Owner, Admin, Member)',
          'Dukungan Pelanggan Prioritas 24/7',
        ],
      },
    ];
  }

  async getMyPlan(userId: string) {
    const userRes = await this.authService.getMe(userId);
    const user = userRes.user;
    const currentTier = (user.subscriptionTier || 'FREE').toUpperCase();
    const plans = this.getPlans();
    const activePlan = plans.find((p) => p.id === currentTier) || plans[0];

    const isAdmin = user.role === 'ADMIN';

    return {
      success: true,
      currentTier: isAdmin ? 'B2B' : currentTier,
      effectivePlan: isAdmin ? plans.find((p) => p.id === 'B2B') : activePlan,
      isAdmin,
      allPlans: plans,
    };
  }

  async upgradePlan(userId: string, targetPlan: string) {
    const validTier = targetPlan.toUpperCase();
    if (!['FREE', 'SILVER', 'GOLD', 'B2B'].includes(validTier)) {
      throw new BadRequestException('Invalid plan tier. Choose from: FREE, SILVER, GOLD, B2B');
    }

    const res = await this.authService.updateProfile(userId, { subscriptionTier: validTier });
    return {
      success: true,
      message: `Successfully updated subscription plan to ${validTier}`,
      tier: validTier,
      user: res.user,
    };
  }
}
