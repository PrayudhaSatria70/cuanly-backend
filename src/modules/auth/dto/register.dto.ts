import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Full Name of the user' })
  @IsNotEmpty({ message: 'Full Name is required' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'budi@example.com', description: 'Unique email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Valid email address is required' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Password or 6-digit transaction PIN' })
  @IsNotEmpty({ message: 'Password or PIN is required' })
  @IsString()
  @MinLength(4, { message: 'Password or PIN must be at least 4 characters' })
  password: string;

  @ApiPropertyOptional({ example: 'budisantoso', description: 'Custom username (optional)' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'Phone number (optional)' })
  @IsOptional()
  @IsString()
  phone?: string;
}
