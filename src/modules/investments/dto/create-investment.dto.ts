import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string; // REKSADANA, SAHAM, EMAS, CRYPTO, PROPERTI

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsNotEmpty()
  buyPrice: number;

  @IsNumber()
  @IsNotEmpty()
  currentPrice: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
