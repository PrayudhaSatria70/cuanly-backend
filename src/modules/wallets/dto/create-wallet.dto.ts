import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ example: 'Rekening Bank BCA', description: 'Wallet or Account Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'BANK', enum: ['CASH', 'BANK', 'E_WALLET', 'SAVINGS'] })
  @IsIn(['CASH', 'BANK', 'E_WALLET', 'SAVINGS'])
  type: string;

  @ApiPropertyOptional({ example: '123-456-7890' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiPropertyOptional({ example: '#2563EB' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isShared?: boolean;
}
