import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../../../users/users.service';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Admin Users [id] (Dynamic Route)')
@Controller('api/v1/admin/users/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class UserDetailController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user details by dynamic route :id' })
  @ApiResponse({ status: 200, description: 'User details retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const res = await this.usersService.getAllUsers();
    const user = res.users.find((u: any) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      user,
    };
  }

  @Put('toggle-status')
  @ApiOperation({ summary: 'Toggle user active/inactive status by dynamic route :id' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleUserStatus(id);
  }
}
