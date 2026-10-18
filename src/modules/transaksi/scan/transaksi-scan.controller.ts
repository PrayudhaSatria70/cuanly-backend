import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OcrService } from '../../ocr/ocr.service';
import { ScanReceiptDto } from '../../ocr/dto/scan-receipt.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Transaksi Scan (OCR)')
@Controller('api/v1/transaksi/scan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransaksiScanController {
  constructor(private readonly ocrService: OcrService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Scan receipt receipt image via OCR (matching /transaksi/scan route)' })
  @ApiResponse({ status: 200, description: 'Receipt scanned and parsed successfully' })
  async scanReceipt(@Body() dto: ScanReceiptDto) {
    return this.ocrService.scanReceipt(dto);
  }
}
