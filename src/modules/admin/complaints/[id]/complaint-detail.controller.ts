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
import { UpdateComplaintDto } from '../../dto/update-complaint.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Admin Complaints [id] (Dynamic Route)')
@Controller('api/v1/admin/complaints/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class ComplaintDetailController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get complaint detail by dynamic route :id' })
  @ApiResponse({ status: 200, description: 'Complaint ticket details retrieved' })
  @ApiResponse({ status: 404, description: 'Complaint ticket not found' })
  async findOne(@Param('id') id: string) {
    const complaints = await this.adminService.getComplaints();
    const complaint = complaints.find((c: any) => c.id === id || c.ticketNumber === id);
    if (!complaint) {
      throw new NotFoundException('Complaint ticket not found');
    }
    return {
      success: true,
      complaint,
    };
  }

  @Put()
  @ApiOperation({ summary: 'Update complaint resolution and status by dynamic route :id' })
  @ApiResponse({ status: 200, description: 'Complaint updated successfully' })
  async update(@Param('id') id: string, @Body() dto: UpdateComplaintDto) {
    return this.adminService.updateComplaint(id, dto);
  }

  @Put('status')
  @ApiOperation({ summary: 'Update complaint status by dynamic route :id/status' })
  @ApiResponse({ status: 200, description: 'Complaint status updated' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateComplaintDto) {
    return this.adminService.updateComplaint(id, dto);
  }
}
