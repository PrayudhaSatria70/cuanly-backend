import { Module } from '@nestjs/common';
import { TransaksiController } from './transaksi.controller';
import { TransaksiDetailController } from './[id]/transaksi-detail.controller';
import { TransaksiScanController } from './scan/transaksi-scan.controller';
import { TransaksiTambahController } from './tambah/transaksi-tambah.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [TransactionsModule, OcrModule],
  controllers: [
    TransaksiController,
    TransaksiDetailController,
    TransaksiScanController,
    TransaksiTambahController,
  ],
})
export class TransaksiModule {}
