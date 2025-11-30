
export type CalculatorMode = 'PRICE' | 'DISCOUNT' | 'ORIGINAL';

export type DealType = 'standard' | 'bogo' | 'b2g1';

export interface DiscountInput {
  originalPrice: number;
  discountValue: number;
  discountType: 'percent' | 'fixed';
  quantity: number;
  taxRate: number;
  shippingCost: number;
  additionalCoupon: number; // Percentage
  currency: string;
  targetPrice?: number; // Used when calculating Discount Rate or Reverse
  dealType: DealType;
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

export interface CurrencyOption {
  symbol: string;
  code: string;
  name: string;
  locale: string;
}
