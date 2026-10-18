import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAllowanceDto {
  @ApiProperty({ example: 7500000, description: 'Monthly budget allowance' })
  @IsNotEmpty()
  @IsNumber()
  monthlyAllowance: number;
}
