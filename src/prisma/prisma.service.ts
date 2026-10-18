import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to PostgreSQL database');
    } catch (err) {
      console.warn('⚠️ Warning: Could not connect to PostgreSQL database immediately. Will retry on request.', err.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
