import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BankSyncService } from './bank-sync.service';
import { ConnectBankDto } from './dto/connect-bank.dto';

@Controller('api/v1/bank-sync')
@UseGuards(JwtAuthGuard)
export class BankSyncController {
  constructor(private readonly bankSyncService: BankSyncService) {}

  @Get('connections')
  async findAll(@Request() req: any) {
    return this.bankSyncService.findAll(req.user.id);
  }

  @Post('connect')
  async connect(@Request() req: any, @Body() dto: ConnectBankDto) {
    return this.bankSyncService.connect(req.user.id, dto);
  }

  @Post('sync/:id')
  async syncNow(@Request() req: any, @Param('id') id: string) {
    return this.bankSyncService.syncNow(req.user.id, id);
  }

  @Delete(':id')
  async disconnect(@Request() req: any, @Param('id') id: string) {
    return this.bankSyncService.disconnect(req.user.id, id);
  }
}
