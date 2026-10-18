import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'EXPENSE', enum: ['EXPENSE', 'INCOME'] })
  @IsIn(['EXPENSE', 'INCOME'])
  type: string;

  @ApiProperty({ example: 148500, description: 'Transaction monetary amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'cat_shopping', description: 'Category identifier' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Belanja', description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @ApiProperty({ example: 'belanja', description: 'Category slug' })
  @IsNotEmpty()
  @IsString()
  categorySlug: string;

  @ApiProperty({ example: '2026-10-17T14:20:00Z', description: 'ISO date string' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiPropertyOptional({ example: 'Belanja mingguan di Superindo' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'IDR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'Rp' })
  @IsOptional()
  @IsString()
  currencySymbol?: string;

  @ApiPropertyOptional({ example: 'wlt_cash' })
  @IsOptional()
  @IsString()
  walletId?: string;

  @ApiPropertyOptional({ description: 'Parsed smart OCR receipt data' })
  @IsOptional()
  receipt?: any;
}
