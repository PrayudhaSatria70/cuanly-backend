import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AiAnalyticsService } from './ai-analytics.service';

@Controller('api/v1/ai-analytics')
@UseGuards(JwtAuthGuard)
export class AiAnalyticsController {
  constructor(private readonly aiAnalyticsService: AiAnalyticsService) {}

  @Get('insights')
  async getInsights(@Request() req: any) {
    return this.aiAnalyticsService.getInsights(req.user.id);
  }
}
