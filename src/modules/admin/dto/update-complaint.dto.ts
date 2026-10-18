import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateComplaintDto {
  @ApiProperty({ example: 'RESOLVED', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'] })
  @IsNotEmpty()
  @IsIn(['OPEN', 'IN_PROGRESS', 'RESOLVED'])
  status: string;

  @ApiPropertyOptional({ example: 'Keluhan telah ditindaklanjuti dan diselesaikan oleh tim teknis' })
  @IsOptional()
  @IsString()
  resolutionNote?: string;
}
