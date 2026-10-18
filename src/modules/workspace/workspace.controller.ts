import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspaceService } from './workspace.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Workspace (B2B)')
@Controller('api/v1/workspace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('members')
  @ApiOperation({ summary: 'Get all members in user shared workspace' })
  @ApiResponse({ status: 200, description: 'Workspace members list' })
  async getMembers(@CurrentUser('id') userId: string) {
    return this.workspaceService.findAll(userId);
  }

  @Post('members')
  @ApiOperation({ summary: 'Invite or add new member to team workspace' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  async addMember(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMemberDto,
  ) {
    return this.workspaceService.addMember(userId, dto);
  }
}
