import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OcrService } from './ocr.service';
import { ScanReceiptDto } from './dto/scan-receipt.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Smart OCR Scanner')
@Controller('api/v1/ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('scan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process receipt image or sample ID and extract structured line items' })
  @ApiResponse({ status: 200, description: 'Receipt parsed successfully' })
  async scanReceipt(@Body() dto: ScanReceiptDto) {
    return this.ocrService.scanReceipt(dto);
  }
}
