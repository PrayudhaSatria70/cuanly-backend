import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FinanceModule } from './modules/finance/finance.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { DebtsModule } from './modules/debts/debts.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { OcrModule } from './modules/ocr/ocr.module';
import { AdminModule } from './modules/admin/admin.module';
import { TransaksiModule } from './modules/transaksi/transaksi.module';
import { BudgetModule } from './modules/budget/budget.module';
import { BerandaModule } from './modules/beranda/beranda.module';
import { ProfilModule } from './modules/profil/profil.module';
import { SettingsModule } from './modules/settings/settings.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { BankSyncModule } from './modules/bank-sync/bank-sync.module';
import { AiAnalyticsModule } from './modules/ai-analytics/ai-analytics.module';
import { BusinessModule } from './modules/business/business.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    TransaksiModule,
    CategoriesModule,
    FinanceModule,
    BudgetModule,
    WalletsModule,
    DebtsModule,
    WorkspaceModule,
    OcrModule,
    AdminModule,
    BerandaModule,
    ProfilModule,
    SettingsModule,
    PricingModule,
    InvestmentsModule,
    BankSyncModule,
    AiAnalyticsModule,
    BusinessModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
