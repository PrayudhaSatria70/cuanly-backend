import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { VerifyMitraDto } from './dto/verify-mitra.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin Operations')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Admin: Get high-level platform KPI statistics' })
  @ApiResponse({ status: 200, description: 'Platform stats' })
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('mitra')
  @ApiOperation({ summary: 'Admin: Get all business partner verification requests' })
  @ApiResponse({ status: 200, description: 'Mitra applications list' })
  async getMitraList() {
    return this.adminService.getMitraList();
  }

  @Put('mitra/:id/verify')
  @ApiOperation({ summary: 'Admin: Verify or reject a partner document' })
  @ApiResponse({ status: 200, description: 'Mitra verification updated' })
  async verifyMitra(
    @Param('id') id: string,
    @Body() dto: VerifyMitraDto,
  ) {
    return this.adminService.verifyMitra(id, dto);
  }

  @Get('complaints')
  @ApiOperation({ summary: 'Admin: Get list of user dispute tickets & support complaints' })
  @ApiResponse({ status: 200, description: 'Complaints list' })
  async getComplaints() {
    return this.adminService.getComplaints();
  }

  @Put('complaints/:id/status')
  @ApiOperation({ summary: 'Admin: Update resolution status and note on support complaint' })
  @ApiResponse({ status: 200, description: 'Complaint updated' })
  async updateComplaint(
    @Param('id') id: string,
    @Body() dto: UpdateComplaintDto,
  ) {
    return this.adminService.updateComplaint(id, dto);
  }
}
