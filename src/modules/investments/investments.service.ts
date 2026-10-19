import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Injectable()
export class InvestmentsService {
  private inMemoryAssets = new Map<string, any[]>();

  constructor(private prisma: PrismaService) {}

  private serialize(a: any) {
    if (!a) return null;
    const buyPrice = Number(a.buyPrice);
    const currentPrice = Number(a.currentPrice);
    const quantity = Number(a.quantity || 1);
    const totalBuy = buyPrice * quantity;
    const totalCurrent = currentPrice * quantity;
    const gainLossAmount = totalCurrent - totalBuy;
    const gainLossPercent = totalBuy > 0 ? (gainLossAmount / totalBuy) * 100 : 0;

    return {
      id: a.id,
      userId: a.userId,
      name: a.name,
      category: a.category,
      quantity,
      buyPrice,
      currentPrice,
      totalBuy,
      totalCurrent,
      gainLossAmount,
      gainLossPercent: Number(gainLossPercent.toFixed(2)),
      notes: a.notes || undefined,
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
    };
  }

  async findAll(userId: string) {
    let rawList: any[] = [];
    try {
      rawList = await this.prisma.investmentAsset.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      rawList = this.inMemoryAssets.get(userId) || [];
    }

    const items = rawList.map((a) => this.serialize(a));
    const totalInvested = items.reduce((acc, cur) => acc + cur.totalBuy, 0);
    const totalCurrentValue = items.reduce((acc, cur) => acc + cur.totalCurrent, 0);
    const totalGainLoss = totalCurrentValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    // Category breakdown
    const categoryBreakdown: Record<string, { value: number; count: number }> = {};
    items.forEach((item) => {
      if (!categoryBreakdown[item.category]) {
        categoryBreakdown[item.category] = { value: 0, count: 0 };
      }
      categoryBreakdown[item.category].value += item.totalCurrent;
      categoryBreakdown[item.category].count += 1;
    });

    return {
      success: true,
      items,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalGainLoss,
        totalGainLossPercent: Number(totalGainLossPercent.toFixed(2)),
        assetCount: items.length,
        categoryBreakdown,
      },
    };
  }

  async create(userId: string, dto: CreateInvestmentDto) {
    const id = `asset_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const buyPriceBigInt = BigInt(Math.round(dto.buyPrice));
    const currentPriceBigInt = BigInt(Math.round(dto.currentPrice));
    const quantity = dto.quantity !== undefined ? dto.quantity : 1;

    try {
      const asset = await this.prisma.investmentAsset.create({
        data: {
          id,
          userId,
          name: dto.name.trim(),
          category: dto.category.toUpperCase(),
          quantity,
          buyPrice: buyPriceBigInt,
          currentPrice: currentPriceBigInt,
          notes: dto.notes?.trim() || null,
        },
      });
      return { success: true, asset: this.serialize(asset) };
    } catch {
      const fallback = {
        id,
        userId,
        name: dto.name.trim(),
        category: dto.category.toUpperCase(),
        quantity,
        buyPrice: buyPriceBigInt,
        currentPrice: currentPriceBigInt,
        notes: dto.notes?.trim() || null,
        createdAt: new Date().toISOString(),
      };
      const list = this.inMemoryAssets.get(userId) || [];
      list.push(fallback);
      this.inMemoryAssets.set(userId, list);
      return { success: true, asset: this.serialize(fallback) };
    }
  }

  async remove(userId: string, id: string) {
    try {
      await this.prisma.investmentAsset.deleteMany({
        where: { id, userId },
      });
    } catch {
      const list = this.inMemoryAssets.get(userId) || [];
      this.inMemoryAssets.set(userId, list.filter((a) => a.id !== id));
    }
    return { success: true, id };
  }
}
