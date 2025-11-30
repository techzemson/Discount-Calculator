
export type CalculatorMode = 'PRICE' | 'DISCOUNT' | 'ORIGINAL';

export interface DiscountInput {
  originalPrice: number;
  discountValue: number;
  discountType: 'percent' | 'fixed';
  quantity: number;
  taxRate: number;
  shippingCost: number;
  additionalCoupon: number; // Percentage
  currency: string;
  itemName: string;
  targetPrice?: number; // Used when calculating Discount Rate or Reverse
}

export interface CalculationResult {
  finalPrice: number;
  totalSaving: number;
  taxAmount: number;
  pricePerUnit: number;
  effectiveDiscountRate: number;
  totalCost: number; // Including shipping and tax
  calculationMode: CalculatorMode;
}

export interface HistoryItem extends DiscountInput, CalculationResult {
  id: string;
  timestamp: number;
  aiAdvice?: string;
}

export interface CurrencyOption {
  symbol: string;
  code: string;
  name: string;
  locale: string;
}
