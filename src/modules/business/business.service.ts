import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  private inMemoryProfiles = new Map<string, any>();

  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    let profile: any = null;
    try {
      profile = await this.prisma.businessProfile.findUnique({
        where: { userId },
      });
    } catch {
      profile = this.inMemoryProfiles.get(userId);
    }

    if (!profile) {
      profile = {
        userId,
        businessName: 'Bisnis Saya',
        npwp: '00.000.000.0-000.000',
        period: '2026',
        annualRevenue: 120000000,
        operatingExpense: 75000000,
        cashRunwayMonths: 9.6,
        taxRate: 0.005, // 0.5% PPh Final UMKM
      };
    } else {
      profile = {
        id: profile.id,
        userId: profile.userId,
        businessName: profile.businessName,
        npwp: profile.npwp || '00.000.000.0-000.000',
        period: profile.period,
        annualRevenue: Number(profile.annualRevenue),
        operatingExpense: Number(profile.operatingExpense),
        cashRunwayMonths: Number(profile.cashRunwayMonths),
        taxRate: Number(profile.taxRate),
      };
    }

    return {
      success: true,
      profile,
    };
  }

  async updateProfile(userId: string, dto: UpdateBusinessDto) {
    const revenue = dto.annualRevenue !== undefined ? dto.annualRevenue : 120000000;
    const expense = dto.operatingExpense !== undefined ? dto.operatingExpense : 75000000;
    const monthlyBurn = Math.max(1, expense / 12);
    const netCash = Math.max(0, revenue - expense);
    const runway = Number((netCash / monthlyBurn).toFixed(1));

    const dataObj = {
      businessName: dto.businessName.trim(),
      npwp: dto.npwp?.trim() || null,
      annualRevenue: BigInt(Math.round(revenue)),
      operatingExpense: BigInt(Math.round(expense)),
      cashRunwayMonths: runway,
      taxRate: 0.005,
    };

    try {
      const updated = await this.prisma.businessProfile.upsert({
        where: { userId },
        update: dataObj,
        create: {
          id: `biz_${Date.now()}`,
          userId,
          ...dataObj,
        },
      });

      return {
        success: true,
        profile: {
          ...updated,
          annualRevenue: Number(updated.annualRevenue),
          operatingExpense: Number(updated.operatingExpense),
        },
      };
    } catch {
      const fallback = {
        userId,
        businessName: dto.businessName.trim(),
        npwp: dto.npwp?.trim() || '00.000.000.0-000.000',
        period: '2026',
        annualRevenue: revenue,
        operatingExpense: expense,
        cashRunwayMonths: runway,
        taxRate: 0.005,
      };
      this.inMemoryProfiles.set(userId, fallback);
      return { success: true, profile: fallback };
    }
  }

  async getCashflow(userId: string) {
    const profRes = await this.getProfile(userId);
    const p = profRes.profile;

    const operatingCashIn = p.annualRevenue;
    const operatingCashOut = p.operatingExpense;
    const netOperating = operatingCashIn - operatingCashOut;

    const investingCash = -15000000; // Pembelian perlengkapan/aset bisnis
    const financingCash = 10000000;  // Modal pemilik / suntikan kas

    const netCashflow = netOperating + investingCash + financingCash;

    return {
      success: true,
      cashflow: {
        period: p.period,
        operating: {
          cashIn: operatingCashIn,
          cashOut: operatingCashOut,
          net: netOperating,
        },
        investing: {
          net: investingCash,
        },
        financing: {
          net: financingCash,
        },
        netCashflow,
        runwayMonths: p.cashRunwayMonths,
        monthlyBurnRate: Math.round(operatingCashOut / 12),
      },
    };
  }

  async getTaxReport(userId: string) {
    const profRes = await this.getProfile(userId);
    const p = profRes.profile;

    // Indonesian PPh Final UMKM (PP 23/2018 & UU HPP 0.5%)
    // Omzet s.d Rp 500.000.000 untuk Wajib Pajak Orang Pribadi tidak dikenai PPh Final
    const thresholdExempt = 500000000;
    const taxableRevenue = Math.max(0, p.annualRevenue - thresholdExempt);
    const taxDue = Math.round(taxableRevenue * p.taxRate);

    return {
      success: true,
      taxReport: {
        period: p.period,
        businessName: p.businessName,
        npwp: p.npwp,
        grossRevenue: p.annualRevenue,
        exemptThreshold: thresholdExempt,
        taxableRevenue,
        taxRate: p.taxRate,
        taxRateFormatted: '0.5% (PPh Final UMKM PP 23/2018)',
        taxDue,
        status: taxDue === 0 ? 'BEBAS PAJAK (Omzet < Rp 500 Juta)' : 'TERUTANG',
        legalReference: 'PP 23 Tahun 2018 & UU No. 7 Tahun 2021 (Harmonisasi Peraturan Perpajakan)',
      },
    };
  }
}
