import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: 'dark', description: 'Active theme (light or dark)' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ example: 'en', description: 'Active locale (en or id)' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ example: 'IDR', description: 'Active primary currency code' })
  @IsOptional()
  @IsString()
  activeCurrency?: string;

  @ApiPropertyOptional({ example: 7500000, description: 'Overall monthly budget allowance' })
  @IsOptional()
  @IsNumber()
  monthlyAllowance?: number;

  @ApiPropertyOptional({ example: 80, description: 'Spending warning threshold percentage (70-90)' })
  @IsOptional()
  @IsNumber()
  spendingWarningThreshold?: number;

  @ApiPropertyOptional({ example: 'standard', description: 'Smart OCR processing speed' })
  @IsOptional()
  @IsString()
  ocrSpeed?: string;

  @ApiPropertyOptional({ example: true, description: 'OCR auto categorization toggle' })
  @IsOptional()
  @IsBoolean()
  ocrAutoCat?: boolean;

  @ApiPropertyOptional({ example: true, description: 'OCR review screen toggle before saving' })
  @IsOptional()
  @IsBoolean()
  ocrReview?: boolean;

  @ApiPropertyOptional({ example: 180000, description: 'Inactivity session timeout in ms' })
  @IsOptional()
  @IsNumber()
  sessionTimeoutMs?: number;

  @ApiPropertyOptional({ description: 'Custom user-created currencies list' })
  @IsOptional()
  customCurrencies?: any;

  @ApiPropertyOptional({ example: true, description: 'System notifications enabled toggle' })
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Notification sound enabled toggle' })
  @IsOptional()
  @IsBoolean()
  soundEnabled?: boolean;
}
