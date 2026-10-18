import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Profil (User Profile)')
@Controller('api/v1/profil')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile (matching /profil route)' })
  @ApiResponse({ status: 200, description: 'Profile details retrieved' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update profile details (Name, Username, Email, Phone, Avatar)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(userId, dto);
  }

  @Post('avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload or update profile picture via Base64 or URL' })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
  async uploadAvatar(
    @CurrentUser('id') userId: string,
    @Body() body: { avatarUrl?: string; dataUrl?: string },
  ) {
    const avatar = body.avatarUrl || body.dataUrl;
    return this.authService.updateProfile(userId, { avatarUrl: avatar });
  }
}
