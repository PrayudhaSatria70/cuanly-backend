import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({ example: 'RECEIVABLE', enum: ['DEBT', 'RECEIVABLE'] })
  @IsIn(['DEBT', 'RECEIVABLE'])
  type: string;

  @ApiProperty({ example: 'Rian Pratama', description: 'Name of the person' })
  @IsNotEmpty()
  @IsString()
  personName: string;

  @ApiProperty({ example: 350000, description: 'Amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2026-10-25', description: 'Due date string' })
  @IsNotEmpty()
  @IsString()
  dueDate: string;

  @ApiPropertyOptional({ example: 'Pinjaman patungan tiket konser' })
  @IsOptional()
  @IsString()
  notes?: string;
}
