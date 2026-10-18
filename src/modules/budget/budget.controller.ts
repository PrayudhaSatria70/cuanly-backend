import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from '../finance/finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Budget')
@Controller('api/v1/budget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BudgetController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get category budget limits (matching /budget)' })
  @ApiResponse({ status: 200, description: 'Budget limits retrieved' })
  async getBudgets(
    @CurrentUser('id') userId: string,
    @Query('period') period?: string,
  ) {
    return this.financeService.getBudgets(userId, period);
  }
}
