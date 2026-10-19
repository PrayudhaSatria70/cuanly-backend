import { Module } from '@nestjs/common';
import { BankSyncService } from './bank-sync.service';
import { BankSyncController } from './bank-sync.controller';

@Module({
  controllers: [BankSyncController],
  providers: [BankSyncService],
  exports: [BankSyncService],
})
export class BankSyncModule {}
