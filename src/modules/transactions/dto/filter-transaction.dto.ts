import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterTransactionDto {
  @ApiPropertyOptional({ example: 'EXPENSE', enum: ['EXPENSE', 'INCOME'] })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'cat_shopping', description: 'Category id or slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'superindo', description: 'Keyword search query' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '2026-10', description: 'Period in format YYYY-MM' })
  @IsOptional()
  @IsString()
  period?: string;
}
