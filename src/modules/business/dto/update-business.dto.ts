import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateBusinessDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsOptional()
  npwp?: string;

  @IsNumber()
  @IsOptional()
  annualRevenue?: number;

  @IsNumber()
  @IsOptional()
  operatingExpense?: number;
}
