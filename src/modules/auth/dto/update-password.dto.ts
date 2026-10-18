import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: '123456', description: 'Current password or PIN' })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newpass123', description: 'New password or PIN' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(4, { message: 'New password or PIN must be at least 4 characters or digits' })
  newPassword: string;

  @ApiPropertyOptional({ example: 'newpass123', description: 'Confirm new password or PIN' })
  @IsOptional()
  @IsString()
  confirmPassword?: string;
}
