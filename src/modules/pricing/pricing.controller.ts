import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Pricing & Subscriptions')
@Controller('api/v1/pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public pricing subscription tiers (matching /pricing route)' })
  @ApiResponse({ status: 200, description: 'List of pricing plans and tiers' })
  getPlans() {
    return {
      success: true,
      plans: this.pricingService.getPlans(),
    };
  }

  @Get('my-plan')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active subscription plan, limits, and benefits of authenticated user' })
  @ApiResponse({ status: 200, description: 'Active plan details' })
  async getMyPlan(@CurrentUser('id') userId: string) {
    return this.pricingService.getMyPlan(userId);
  }

  @Post('upgrade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upgrade or change user subscription plan (FREE, SILVER, GOLD, B2B)' })
  @ApiResponse({ status: 200, description: 'Plan updated successfully' })
  async upgrade(
    @CurrentUser('id') userId: string,
    @Body() body: { plan?: string; tier?: string },
  ) {
    const target = body.plan || body.tier || 'FREE';
    return this.pricingService.upgradePlan(userId, target);
  }

  @Put('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe or change user tier (alias of upgrade)' })
  @ApiResponse({ status: 200, description: 'Plan updated successfully' })
  async subscribe(
    @CurrentUser('id') userId: string,
    @Body() body: { plan?: string; tier?: string },
  ) {
    const target = body.plan || body.tier || 'FREE';
    return this.pricingService.upgradePlan(userId, target);
  }
}
