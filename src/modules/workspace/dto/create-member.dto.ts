import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ example: 'Rian Pratama', description: 'Member full name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'rian@tokocuan.com', description: 'Member email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'MEMBER', enum: ['OWNER', 'ADMIN', 'MEMBER'] })
  @IsOptional()
  @IsString()
  role?: string;
}
