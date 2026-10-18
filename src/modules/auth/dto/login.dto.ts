import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Username or Email of the user or admin',
  })
  @IsNotEmpty({ message: 'Username or Email is required' })
  @IsString()
  identifier: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Password or 6-digit PIN of the account',
  })
  @IsNotEmpty({ message: 'Password or PIN is required' })
  @IsString()
  password: string;
}
