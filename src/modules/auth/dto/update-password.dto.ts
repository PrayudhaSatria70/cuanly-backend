import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: '123456', description: 'Current password or PIN' })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newpass123', description: 'New password or PIN' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}
