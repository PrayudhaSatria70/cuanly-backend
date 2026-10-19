import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class ConnectBankDto {
  @IsString()
  @IsNotEmpty()
  institution: string; // BCA, MANDIRI, BRI, BNI, GOPAY, OVO, DANA

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsBoolean()
  @IsOptional()
  autoSync?: boolean;
}
