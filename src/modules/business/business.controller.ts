import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BusinessService } from './business.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('api/v1/business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.businessService.getProfile(req.user.id);
  }

  @Post('profile')
  async updateProfile(@Request() req: any, @Body() dto: UpdateBusinessDto) {
    return this.businessService.updateProfile(req.user.id, dto);
  }

  @Get('cashflow')
  async getCashflow(@Request() req: any) {
    return this.businessService.getCashflow(req.user.id);
  }

  @Get('tax-report')
  async getTaxReport(@Request() req: any) {
    return this.businessService.getTaxReport(req.user.id);
  }
}
