import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Username or Email of the user or admin',
  })
  @IsNotEmpty({ message: 'Username or Email is required' })
  @IsString()
  identifier: string;

  @ApiPropertyOptional({
    example: 'admin123',
    description: 'Password or PIN of the account',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: '1234',
    description: 'Alternative PIN field',
  })
  @IsOptional()
  @IsString()
  pin?: string;
}
