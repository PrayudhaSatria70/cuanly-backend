import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetDetailController } from './[slug]/budget-detail.controller';
import { FinanceModule } from '../finance/finance.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [FinanceModule, TransactionsModule],
  controllers: [BudgetController, BudgetDetailController],
})
export class BudgetModule {}
