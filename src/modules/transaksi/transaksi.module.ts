import { Module } from '@nestjs/common';
import { TransaksiController } from './transaksi.controller';
import { TransaksiDetailController } from './[id]/transaksi-detail.controller';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [TransaksiController, TransaksiDetailController],
})
export class TransaksiModule {}
