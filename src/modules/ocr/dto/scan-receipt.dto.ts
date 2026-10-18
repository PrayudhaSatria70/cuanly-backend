import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ScanReceiptDto {
  @ApiPropertyOptional({ example: 'sample_supermarket', description: 'Sample receipt preset ID' })
  @IsOptional()
  @IsString()
  sampleId?: string;

  @ApiPropertyOptional({ example: 'https://...', description: 'Direct image URL or base64 string' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
