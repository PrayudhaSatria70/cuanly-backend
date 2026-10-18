import { Injectable } from '@nestjs/common';
import { ScanReceiptDto } from './dto/scan-receipt.dto';

const SAMPLE_RECEIPTS = [
  {
    id: 'sample_supermarket',
    name: 'Superindo Supermarket',
    merchant: 'PT Lion Super Indo',
    date: '2026-10-17',
    totalAmount: 148500,
    suggestedCategoryId: 'cat_shopping',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554415707-9e49016a3505?w=600&auto=format&fit=crop&q=80',
    lineItems: [
      { id: 'item_1', name: 'Beras Premium Ramos 5kg', price: 74000, quantity: 1 },
      { id: 'item_2', name: 'Minyak Goreng Sania 2L', price: 38500, quantity: 1 },
      { id: 'item_3', name: 'Telur Ayam Negeri 1kg', price: 36000, quantity: 1 },
    ],
    confidenceScore: 98,
  },
  {
    id: 'sample_coffee',
    name: 'Starbucks Coffee Reserve',
    merchant: 'Starbucks Grand Indonesia',
    date: '2026-10-16',
    totalAmount: 85000,
    suggestedCategoryId: 'cat_food',
    receiptImageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    lineItems: [
      { id: 'item_1', name: 'Caffe Latte Grande Oatmilk', price: 58000, quantity: 1 },
      { id: 'item_2', name: 'Butter Croissant Warm', price: 27000, quantity: 1 },
    ],
    confidenceScore: 95,
  },
  {
    id: 'sample_gas',
    name: 'SPBU Pertamina 31.129',
    merchant: 'Pertamina Retail Rasuna Said',
    date: '2026-10-15',
    totalAmount: 250000,
    suggestedCategoryId: 'cat_transport',
    receiptImageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=600&auto=format&fit=crop&q=80',
    lineItems: [
      { id: 'item_1', name: 'Pertamax Green 95 (18.2L)', price: 250000, quantity: 1 },
    ],
    confidenceScore: 99,
  },
];

@Injectable()
export class OcrService {
  async scanReceipt(dto: ScanReceiptDto) {
    if (dto.sampleId) {
      const found = SAMPLE_RECEIPTS.find((s) => s.id === dto.sampleId);
      if (found) {
        return found;
      }
    }

    // Default parsed receipt
    const today = new Date().toISOString().split('T')[0];
    return {
      merchant: 'PT Lion Super Indo',
      date: today,
      totalAmount: 148500,
      receiptImageUrl:
        dto.imageUrl ||
        'https://images.unsplash.com/photo-1554415707-9e49016a3505?w=600&auto=format&fit=crop&q=80',
      lineItems: [
        { id: 'item_1', name: 'Beras Premium Ramos 5kg', price: 74000, quantity: 1 },
        { id: 'item_2', name: 'Minyak Goreng Sania 2L', price: 38500, quantity: 1 },
        { id: 'item_3', name: 'Telur Ayam Negeri 1kg', price: 36000, quantity: 1 },
      ],
      suggestedCategoryId: 'cat_shopping',
      confidenceScore: 98,
    };
  }
}
