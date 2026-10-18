import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Budi Santoso', description: 'Updated display name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'budisantoso', description: 'Updated username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'budi@example.com', description: 'Updated email address' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'Updated phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://...', description: 'Updated avatar URL or base64 photo' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'GOLD', description: 'Subscription tier (FREE, SILVER, GOLD, B2B)' })
  @IsOptional()
  @IsString()
  subscriptionTier?: string;

  @ApiPropertyOptional({ example: 'GOLD', description: 'Subscription plan alias (FREE, SILVER, GOLD, B2B)' })
  @IsOptional()
  @IsString()
  subscriptionPlan?: string;
}
