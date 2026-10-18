import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from '../finance/finance.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { CategoriesService } from '../categories/categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Beranda (Dashboard)')
@Controller('api/v1/beranda')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BerandaController {
  constructor(
    private readonly financeService: FinanceService,
    private readonly transactionsService: TransactionsService,
    private readonly walletsService: WalletsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get aggregated dashboard data for Beranda' })
  @ApiResponse({ status: 200, description: 'Beranda aggregated summary and recent items' })
  async getBerandaData(@CurrentUser('id') userId: string) {
    const [summary, recentTransactions, wallets, categories] = await Promise.all([
      this.financeService.getSummary(userId),
      this.transactionsService.findAll(userId),
      this.walletsService.findAll(userId),
      this.categoriesService.getAll(),
    ]);

    return {
      success: true,
      summary,
      recentTransactions: recentTransactions.slice(0, 5),
      wallets,
      categories,
    };
  }
}
