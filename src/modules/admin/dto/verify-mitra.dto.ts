import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyMitraDto {
  @ApiProperty({ example: 'VERIFIED', enum: ['PENDING', 'VERIFIED', 'REJECTED'] })
  @IsNotEmpty()
  @IsIn(['PENDING', 'VERIFIED', 'REJECTED'])
  status: string;

  @ApiPropertyOptional({ example: 'Dokumen lengkap dan validasi berhasil' })
  @IsOptional()
  @IsString()
  notes?: string;
}
