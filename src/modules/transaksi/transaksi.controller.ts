import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { FilterTransactionDto } from '../transactions/dto/filter-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Transaksi')
@Controller('api/v1/transaksi')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransaksiController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of transactions (matching /transaksi)' })
  @ApiResponse({ status: 200, description: 'Transactions array retrieved' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() filter: FilterTransactionDto,
  ) {
    return this.transactionsService.findAll(userId, filter);
  }

  @Post()
  @ApiOperation({ summary: 'Create new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, dto);
  }
}
