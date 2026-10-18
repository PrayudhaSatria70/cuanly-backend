import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'makanan', description: 'Category unique slug identifier' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'cat_food', description: 'i18n translation key' })
  @IsNotEmpty()
  @IsString()
  nameKey: string;

  @ApiProperty({ example: 'Makanan & Minuman', description: 'Fallback display name' })
  @IsNotEmpty()
  @IsString()
  fallbackName: string;

  @ApiProperty({ example: 'Utensils', description: 'Lucide icon name' })
  @IsNotEmpty()
  @IsString()
  icon: string;

  @ApiProperty({ example: '#F97316', description: 'Hex color swatch' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({ example: 'EXPENSE', enum: ['EXPENSE', 'INCOME'] })
  @IsIn(['EXPENSE', 'INCOME'])
  type: string;
}
