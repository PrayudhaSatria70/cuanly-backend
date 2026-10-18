import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Finance & Budgets')
@Controller('api/v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('finance/summary')
  @ApiOperation({ summary: 'Get overall financial summary (balance, expenses, limits, allowance)' })
  @ApiResponse({ status: 200, description: 'Financial summary' })
  async getSummary(@CurrentUser('id') userId: string) {
    return this.financeService.getSummary(userId);
  }

  @Get('budgets')
  @ApiOperation({ summary: 'Get monthly budget limits per category' })
  @ApiResponse({ status: 200, description: 'Budget limits array' })
  async getBudgets(
    @CurrentUser('id') userId: string,
    @Query('period') period?: string,
  ) {
    return this.financeService.getBudgets(userId, period);
  }

  @Put('budgets/:categoryId')
  @ApiOperation({ summary: 'Set category budget limit' })
  @ApiResponse({ status: 200, description: 'Budget updated successfully' })
  async updateBudget(
    @CurrentUser('id') userId: string,
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.financeService.updateBudget(userId, categoryId, dto);
  }

  @Put('finance/allowance')
  @ApiOperation({ summary: 'Update monthly total budget allowance' })
  @ApiResponse({ status: 200, description: 'Allowance updated successfully' })
  async updateAllowance(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAllowanceDto,
  ) {
    return this.financeService.updateAllowance(userId, dto.monthlyAllowance);
  }
}
