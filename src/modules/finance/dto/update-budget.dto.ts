import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBudgetDto {
  @ApiProperty({ example: 1500000, description: 'Budget limit amount' })
  @IsNotEmpty()
  @IsNumber()
  limitAmount: number;

  @ApiPropertyOptional({ example: '2026-10', description: 'Period format YYYY-MM' })
  @IsOptional()
  @IsString()
  period?: string;
}
