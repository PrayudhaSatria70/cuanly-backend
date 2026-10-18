import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

const DEFAULT_FALLBACK_CATEGORIES = [
  { id: 'cat_food', slug: 'makanan', nameKey: 'cat_food', fallbackName: 'Makanan & Minuman', icon: 'Utensils', color: '#F97316', type: 'EXPENSE', isSystem: true },
  { id: 'cat_transport', slug: 'transportasi', nameKey: 'cat_transport', fallbackName: 'Transportasi', icon: 'Car', color: '#0EA5E9', type: 'EXPENSE', isSystem: true },
  { id: 'cat_shopping', slug: 'belanja', nameKey: 'cat_shopping', fallbackName: 'Belanja', icon: 'ShoppingBag', color: '#8B5CF6', type: 'EXPENSE', isSystem: true },
  { id: 'cat_entertainment', slug: 'hiburan', nameKey: 'cat_entertainment', fallbackName: 'Hiburan', icon: 'Film', color: '#EC4899', type: 'EXPENSE', isSystem: true },
  { id: 'cat_health', slug: 'kesehatan', nameKey: 'cat_health', fallbackName: 'Kesehatan', icon: 'HeartPulse', color: '#10B981', type: 'EXPENSE', isSystem: true },
  { id: 'cat_other', slug: 'lainnya', nameKey: 'cat_other', fallbackName: 'Lainnya', icon: 'MoreHorizontal', color: '#6B7072', type: 'EXPENSE', isSystem: true },
  { id: 'cat_salary', slug: 'gaji', nameKey: 'cat_salary', fallbackName: 'Gaji Bulanan', icon: 'Wallet', color: '#059669', type: 'INCOME', isSystem: true },
  { id: 'cat_freelance', slug: 'freelance', nameKey: 'cat_freelance', fallbackName: 'Freelance & Bisnis', icon: 'Briefcase', color: '#2563EB', type: 'INCOME', isSystem: true },
  { id: 'cat_investment', slug: 'investasi', nameKey: 'cat_investment', fallbackName: 'Investasi & Bunga', icon: 'TrendingUp', color: '#D97706', type: 'INCOME', isSystem: true },
];

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId?: string) {
    try {
      const categories = await this.prisma.category.findMany({
        where: {
          OR: [
            { isSystem: true },
            userId ? { userId } : { isSystem: true },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });

      if (categories.length > 0) {
        return categories;
      }
    } catch (err) {
      console.warn('Prisma error fetching categories:', err.message);
    }

    return DEFAULT_FALLBACK_CATEGORIES;
  }

  async create(userId: string, dto: CreateCategoryDto) {
    const id = `cat_${Date.now()}`;
    const cleanSlug = dto.slug.toLowerCase().replace(/[^a-z0-9_]/g, '-');

    const created = await this.prisma.category.create({
      data: {
        id,
        slug: cleanSlug,
        nameKey: dto.nameKey,
        fallbackName: dto.fallbackName,
        icon: dto.icon,
        color: dto.color,
        type: dto.type,
        isSystem: false,
        userId,
      },
    });

    return created;
  }
}
