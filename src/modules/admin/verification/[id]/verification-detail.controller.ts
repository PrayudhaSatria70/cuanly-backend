import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../../admin.service';
import { VerifyMitraDto } from '../../dto/verify-mitra.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Admin Verification [id] (Dynamic Route)')
@Controller('api/v1/admin/verification/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class VerificationDetailController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get partner verification details by dynamic route :id' })
  @ApiResponse({ status: 200, description: 'Partner verification details retrieved' })
  @ApiResponse({ status: 404, description: 'Partner verification record not found' })
  async findOne(@Param('id') id: string) {
    const list = await this.adminService.getMitraList();
    const mitra = list.find((m: any) => m.id === id);
    if (!mitra) {
      throw new NotFoundException('Partner verification record not found');
    }
    return {
      success: true,
      mitra,
    };
  }

  @Put('verify')
  @ApiOperation({ summary: 'Verify or reject partner application by dynamic route :id' })
  @ApiResponse({ status: 200, description: 'Verification status updated' })
  async verifyMitra(@Param('id') id: string, @Body() dto: VerifyMitraDto) {
    return this.adminService.verifyMitra(id, dto);
  }
}
