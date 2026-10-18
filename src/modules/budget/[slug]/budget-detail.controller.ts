import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from '../../finance/finance.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { UpdateBudgetDto } from '../../finance/dto/update-budget.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Budget [slug] (Dynamic Route)')
@Controller('api/v1/budget/:slug')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BudgetDetailController {
  constructor(
    private readonly financeService: FinanceService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get category budget and transactions by dynamic route :slug' })
  @ApiResponse({ status: 200, description: 'Category budget details and transactions retrieved' })
  async findCategoryBudget(
    @CurrentUser('id') userId: string,
    @Param('slug') slug: string,
  ) {
    const budgets = await this.financeService.getBudgets(userId);
    const budget = budgets.find((b: any) => b.categorySlug === slug || b.categoryId === slug);
    const transactions = await this.transactionsService.findAll(userId, { category: slug });
    return {
      success: true,
      slug,
      budget: budget || null,
      transactions,
    };
  }

  @Put()
  @ApiOperation({ summary: 'Update category budget limit by dynamic route :slug' })
  @ApiResponse({ status: 200, description: 'Budget limit updated successfully' })
  async updateBudget(
    @CurrentUser('id') userId: string,
    @Param('slug') slug: string,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.financeService.updateBudget(userId, slug, dto);
  }
}
