import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

export interface PricingPlan {
  id: 'FREE' | 'SILVER' | 'GOLD' | 'B2B';
  name: string;
  targetUser: string;
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
        targetUser: 'Pengguna kasual / pemula',
        tagline: 'Pencatatan manual dasar dan mutasi kas harian',
        priceMonthly: 0,
        priceAnnual: 0,
        priceMonthlyFormatted: 'Rp0 (Selamanya)',
        priceAnnualFormatted: 'Rp0',
        walletLimit: 2,
        features: [
          'Pencatatan manual dasar',
          'Maksimal 2 dompet',
          'Laporan bulanan standar',
          'Iklan minor',
        ],
      },
      {
        id: 'SILVER',
        name: 'Silver Plan',
        targetUser: 'Pengguna aktif / budgeter personal',
        tagline: 'Manajemen anggaran tanpa batas & ekspor data lengkap',
        priceMonthly: 10000,
        priceAnnual: 89000,
        priceMonthlyFormatted: 'Rp10.000 / bulan',
        priceAnnualFormatted: 'Rp89.000 / tahun',
        walletLimit: 'UNLIMITED',
        isPopular: true,
        badge: 'PALING POPULER',
        features: [
          'Kuota dompet tak terbatas',
          'Ekspor data (CSV & Excel)',
          'Budgeting multi-kategori',
          'Tanpa iklan (Ad-free)',
          'Pencadangan otomatis',
        ],
      },
      {
        id: 'GOLD',
        name: 'Gold Plan',
        targetUser: 'Power user / investor / pelaku usaha mikro',
        tagline: 'Otomasi Bank Sync, pelacakan aset investasi & analitik AI',
        priceMonthly: 25000,
        priceAnnual: 199000,
        priceMonthlyFormatted: 'Rp25.000 / bulan',
        priceAnnualFormatted: 'Rp199.000 / tahun',
        walletLimit: 'UNLIMITED',
        badge: 'BEST VALUE',
        features: [
          'Semua fitur Silver Plan',
          'Bank Sync otomatis (BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana)',
          'Pelacakan aset/investasi (Reksadana, Saham, Emas, Crypto, Properti)',
          'Laporan analitik AI (Health Score, Deteksi Anomali, Runway Forecast)',
          'Pengelolaan utang/piutang mendalam (Cicilan, Tenor, & Bunga)',
        ],
      },
      {
        id: 'B2B',
        name: 'B2B Plan',
        targetUser: 'UMKM, tim kecil, atau keuangan keluarga',
        tagline: 'Kolaborasi kas tim multi-user & kepatuhan pajak usaha',
        priceMonthly: 59000,
        priceAnnual: 566400,
        priceMonthlyFormatted: 'Rp59.000 / bulan (Maks. 3-5 akun)',
        priceAnnualFormatted: 'Rp566.400 / tahun',
        walletLimit: 'UNLIMITED',
        badge: 'TIM & BISNIS',
        features: [
          'Semua fitur Gold Plan',
          'Shared Wallet (multi-user)',
          'Manajemen arus kas bisnis (Operating, Investing, Financing & Runway)',
          'Laporan pajak sederhana (PPh Final UMKM 0.5% PP 23/2018)',
          'Dasbor admin tim (Permission Matrix & Audit Activity Log)',
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
