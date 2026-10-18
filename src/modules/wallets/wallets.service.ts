import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletsService {
  private inMemoryWallets = new Map<string, any[]>();

  constructor(private prisma: PrismaService) {}

  private serializeWallet(w: any) {
    if (!w) return null;
    return {
      id: w.id,
      userId: w.userId,
      name: w.name,
      type: w.type,
      accountNumber: w.accountNumber || undefined,
      balance: Number(w.balance),
      color: w.color || '#4D8DBA',
      isShared: Boolean(w.isShared),
      createdAt: w.createdAt instanceof Date ? w.createdAt.toISOString() : w.createdAt,
    };
  }

  async findAll(userId: string) {
    try {
      const wallets = await this.prisma.wallet.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      return wallets.map((w) => this.serializeWallet(w));
    } catch {
      const list = this.inMemoryWallets.get(userId) || [];
      return list.map((w) => this.serializeWallet(w));
    }
  }

  async create(userId: string, dto: CreateWalletDto) {
    let existingCount = 0;
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const isFreeTier = !user || user.subscriptionTier === 'FREE';
      const isAdmin = user?.role === 'ADMIN';

      if (isFreeTier && !isAdmin) {
        existingCount = await this.prisma.wallet.count({
          where: { userId },
        });
        if (existingCount >= 2) {
          throw new ForbiddenException(
            'Free Plan accounts can have a maximum of 2 wallets. Upgrade to Silver Plan for unlimited wallets.'
          );
        }
      }
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      // In-memory quota check
      const memList = this.inMemoryWallets.get(userId) || [];
      if (memList.length >= 2) {
        throw new ForbiddenException(
          'Free Plan accounts can have a maximum of 2 wallets. Upgrade to Silver Plan for unlimited wallets.'
        );
      }
    }

    const id = `wlt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const balanceBigInt = dto.balance !== undefined ? BigInt(Math.round(dto.balance)) : BigInt(0);

    try {
      const wallet = await this.prisma.wallet.create({
        data: {
          id,
          userId,
          name: dto.name.trim(),
          type: dto.type,
          accountNumber: dto.accountNumber?.trim() || null,
          balance: balanceBigInt,
          color: dto.color || '#4D8DBA',
          isShared: dto.isShared ?? false,
        },
      });

      return {
        success: true,
        wallet: this.serializeWallet(wallet),
      };
    } catch {
      const fallbackWallet = {
        id,
        userId,
        name: dto.name.trim(),
        type: dto.type,
        accountNumber: dto.accountNumber?.trim() || null,
        balance: balanceBigInt,
        color: dto.color || '#4D8DBA',
        isShared: dto.isShared ?? false,
        createdAt: new Date().toISOString(),
      };
      const currentList = this.inMemoryWallets.get(userId) || [];
      currentList.push(fallbackWallet);
      this.inMemoryWallets.set(userId, currentList);

      return {
        success: true,
        wallet: this.serializeWallet(fallbackWallet),
      };
    }
  }

  async remove(userId: string, id: string) {
    try {
      const wallet = await this.prisma.wallet.findFirst({
        where: { id, userId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      await this.prisma.wallet.delete({
        where: { id },
      });

      return {
        success: true,
        id,
      };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      const list = this.inMemoryWallets.get(userId) || [];
      this.inMemoryWallets.set(
        userId,
        list.filter((w) => w.id !== id)
      );
      return {
        success: true,
        id,
      };
    }
  }
}
