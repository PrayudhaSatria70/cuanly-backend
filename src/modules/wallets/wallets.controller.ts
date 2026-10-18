import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Wallets')
@Controller('api/v1/wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user wallets and accounts' })
  @ApiResponse({ status: 200, description: 'Wallets list' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.walletsService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new wallet or bank account' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  @ApiResponse({ status: 400, description: 'Quota exceeded for Free plan' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateWalletDto,
  ) {
    return this.walletsService.create(userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete wallet by ID' })
  @ApiResponse({ status: 200, description: 'Wallet deleted' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.walletsService.remove(userId, id);
  }
}
