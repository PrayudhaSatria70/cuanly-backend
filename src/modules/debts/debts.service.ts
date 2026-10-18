import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDebtDto } from './dto/create-debt.dto';

@Injectable()
export class DebtsService {
  constructor(private prisma: PrismaService) {}

  private serializeDebt(d: any) {
    if (!d) return null;
    return {
      id: d.id,
      userId: d.userId,
      type: d.type,
      personName: d.personName,
      amount: Number(d.amount),
      dueDate: d.dueDate,
      notes: d.notes || undefined,
      isSettled: Boolean(d.isSettled),
      createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : d.createdAt,
    };
  }

  async findAll(userId: string) {
    const items = await this.prisma.debt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((d) => this.serializeDebt(d));
  }

  async create(userId: string, dto: CreateDebtDto) {
    const id = `debt_${Date.now()}`;
    const amountBigInt = BigInt(Math.round(dto.amount));

    const created = await this.prisma.debt.create({
      data: {
        id,
        userId,
        type: dto.type,
        personName: dto.personName.trim(),
        amount: amountBigInt,
        dueDate: dto.dueDate,
        notes: dto.notes?.trim() || null,
        isSettled: false,
      },
    });

    return {
      success: true,
      debt: this.serializeDebt(created),
    };
  }

  async toggleSettle(userId: string, id: string) {
    const debt = await this.prisma.debt.findFirst({
      where: { id, userId },
    });

    if (!debt) {
      throw new NotFoundException('Debt record not found');
    }

    const updated = await this.prisma.debt.update({
      where: { id },
      data: { isSettled: !debt.isSettled },
    });

    return {
      success: true,
      debt: this.serializeDebt(updated),
    };
  }

  async remove(userId: string, id: string) {
    const debt = await this.prisma.debt.findFirst({
      where: { id, userId },
    });

    if (!debt) {
      throw new NotFoundException('Debt record not found');
    }

    await this.prisma.debt.delete({
      where: { id },
    });

    return {
      success: true,
      id,
    };
  }
}
