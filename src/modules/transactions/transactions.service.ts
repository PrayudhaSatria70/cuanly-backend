import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionsService {
  private inMemoryTransactions = new Map<string, any[]>();

  constructor(private prisma: PrismaService) {}

  private serializeTx(tx: any) {
    if (!tx) return null;
    return {
      id: tx.id,
      userId: tx.userId,
      type: tx.type,
      amount: Number(tx.amount),
      currency: tx.currency || 'IDR',
      currencySymbol: tx.currencySymbol || 'Rp',
      categoryId: tx.categoryId,
      categoryName: tx.categoryName,
      categorySlug: tx.categorySlug,
      date: tx.date instanceof Date ? tx.date.toISOString() : tx.date,
      notes: tx.notes || undefined,
      receipt: tx.receipt || undefined,
      walletId: tx.walletId || undefined,
      createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
    };
  }

  async findAll(userId: string, filter?: FilterTransactionDto) {
    const where: any = { userId };

    if (filter?.type) {
      where.type = filter.type;
    }

    if (filter?.category) {
      where.OR = [
        { categoryId: filter.category },
        { categorySlug: filter.category },
      ];
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      where.OR = [
        ...(where.OR || []),
        { notes: { contains: q, mode: 'insensitive' } },
        { categoryName: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (filter?.period) {
      // period is 'YYYY-MM'
      const [yearStr, monthStr] = filter.period.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      if (!isNaN(year) && !isNaN(month)) {
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));
        where.date = {
          gte: startDate,
          lt: endDate,
        };
      }
    }

    try {
      const items = await this.prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
      });

      return items.map((tx) => this.serializeTx(tx));
    } catch {
      let list = this.inMemoryTransactions.get(userId) || [];
      if (filter?.type) list = list.filter(t => t.type === filter.type);
      return list.map(tx => this.serializeTx(tx));
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const tx = await this.prisma.transaction.findFirst({
        where: { id, userId },
      });

      if (!tx) {
        throw new NotFoundException('Transaction not found');
      }

      return this.serializeTx(tx);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      const list = this.inMemoryTransactions.get(userId) || [];
      const found = list.find(t => t.id === id);
      if (!found) throw new NotFoundException('Transaction not found');
      return this.serializeTx(found);
    }
  }

  async create(userId: string, dto: CreateTransactionDto) {
    const id = `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const amountBigInt = BigInt(Math.round(dto.amount));
    const txDate = new Date(dto.date);

    try {
      const tx = await this.prisma.transaction.create({
        data: {
          id,
          userId,
          type: dto.type,
          amount: amountBigInt,
          categoryId: dto.categoryId,
          categoryName: dto.categoryName,
          categorySlug: dto.categorySlug,
          date: txDate,
          notes: dto.notes || null,
          currency: dto.currency || 'IDR',
          currencySymbol: dto.currencySymbol || 'Rp',
          walletId: dto.walletId || null,
          receipt: dto.receipt || null,
        },
      });

      // Optionally update wallet balance if walletId provided
      if (dto.walletId) {
        try {
          const delta = dto.type === 'INCOME' ? amountBigInt : -amountBigInt;
          await this.prisma.wallet.update({
            where: { id: dto.walletId },
            data: { balance: { increment: delta } },
          });
        } catch (err) {
          console.warn('Could not update wallet balance:', err.message);
        }
      }

      return this.serializeTx(tx);
    } catch {
      const fallbackTx = {
        id,
        userId,
        type: dto.type,
        amount: amountBigInt,
        categoryId: dto.categoryId,
        categoryName: dto.categoryName,
        categorySlug: dto.categorySlug,
        date: txDate,
        notes: dto.notes || null,
        currency: dto.currency || 'IDR',
        currencySymbol: dto.currencySymbol || 'Rp',
        walletId: dto.walletId || null,
        receipt: dto.receipt || null,
        createdAt: new Date().toISOString(),
      };
      const list = this.inMemoryTransactions.get(userId) || [];
      list.unshift(fallbackTx);
      this.inMemoryTransactions.set(userId, list);
      return this.serializeTx(fallbackTx);
    }
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    const dataToUpdate: any = {};
    if (dto.type !== undefined) dataToUpdate.type = dto.type;
    if (dto.amount !== undefined) dataToUpdate.amount = BigInt(Math.round(dto.amount));
    if (dto.categoryId !== undefined) dataToUpdate.categoryId = dto.categoryId;
    if (dto.categoryName !== undefined) dataToUpdate.categoryName = dto.categoryName;
    if (dto.categorySlug !== undefined) dataToUpdate.categorySlug = dto.categorySlug;
    if (dto.date !== undefined) dataToUpdate.date = new Date(dto.date);
    if (dto.notes !== undefined) dataToUpdate.notes = dto.notes;
    if (dto.currency !== undefined) dataToUpdate.currency = dto.currency;
    if (dto.currencySymbol !== undefined) dataToUpdate.currencySymbol = dto.currencySymbol;
    if (dto.walletId !== undefined) dataToUpdate.walletId = dto.walletId;
    if (dto.receipt !== undefined) dataToUpdate.receipt = dto.receipt;

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: dataToUpdate,
    });

    return this.serializeTx(updated);
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    await this.prisma.transaction.delete({
      where: { id },
    });

    return {
      success: true,
      id,
    };
  }
}
