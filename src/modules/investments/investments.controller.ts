import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Controller('api/v1/investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.investmentsService.findAll(req.user.id);
  }

  @Post()
  async create(@Request() req: any, @Body() dto: CreateInvestmentDto) {
    return this.investmentsService.create(req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.investmentsService.remove(req.user.id, id);
  }
}
