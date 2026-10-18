import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Debts & Receivables')
@Controller('api/v1/debts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user debts and receivables' })
  @ApiResponse({ status: 200, description: 'Debts list retrieved' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.debtsService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new debt or receivable' })
  @ApiResponse({ status: 201, description: 'Debt recorded successfully' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateDebtDto,
  ) {
    return this.debtsService.create(userId, dto);
  }

  @Put(':id/settle')
  @ApiOperation({ summary: 'Toggle settled status of debt or receivable' })
  @ApiResponse({ status: 200, description: 'Debt status updated' })
  async toggleSettle(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.debtsService.toggleSettle(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete debt or receivable record' })
  @ApiResponse({ status: 200, description: 'Debt record deleted' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.debtsService.remove(userId, id);
  }
}
