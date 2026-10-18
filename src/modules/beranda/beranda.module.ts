import { Module } from '@nestjs/common';
import { BerandaController } from './beranda.controller';
import { FinanceModule } from '../finance/finance.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletsModule } from '../wallets/wallets.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [FinanceModule, TransactionsModule, WalletsModule, CategoriesModule],
  controllers: [BerandaController],
})
export class BerandaModule {}
