
import { DiscountInput, CalculationResult, CalculatorMode } from '../types';

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
];

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
};

export const calculateDiscount = (input: DiscountInput, mode: CalculatorMode): CalculationResult => {
  const {
    originalPrice,
    discountValue,
    discountType,
    quantity,
    taxRate,
    shippingCost,
    additionalCoupon,
    targetPrice = 0
  } = input;

  let calculatedFinalPriceUnit = 0;
  let calculatedOriginalPriceUnit = 0;
  let calculatedDiscountAmount = 0;
  let calculatedSavings = 0;
  let effectiveRate = 0;

  // --- LOGIC BRANCHING BASED ON MODE ---

  if (mode === 'PRICE') {
    // Standard: Original -> Final
    calculatedOriginalPriceUnit = originalPrice;
    
    let basePrice = originalPrice;
    if (discountType === 'percent') {
      calculatedDiscountAmount = originalPrice * (discountValue / 100);
      basePrice = originalPrice - calculatedDiscountAmount;
    } else {
      calculatedDiscountAmount = discountValue;
      basePrice = Math.max(0, originalPrice - discountValue);
    }
    
    // Apply extra coupon
    let extraDiscount = 0;
    if (additionalCoupon > 0) {
      extraDiscount = basePrice * (additionalCoupon / 100);
      basePrice = basePrice - extraDiscount;
      calculatedDiscountAmount += extraDiscount;
    }

    calculatedFinalPriceUnit = basePrice;
    calculatedSavings = calculatedDiscountAmount;
    effectiveRate = originalPrice > 0 ? (calculatedSavings / originalPrice) * 100 : 0;
  
  } else if (mode === 'DISCOUNT') {
    // Reverse: Original + Final -> Discount
    calculatedOriginalPriceUnit = originalPrice;
    calculatedFinalPriceUnit = targetPrice;
    
    calculatedSavings = Math.max(0, calculatedOriginalPriceUnit - calculatedFinalPriceUnit);
    effectiveRate = calculatedOriginalPriceUnit > 0 ? (calculatedSavings / calculatedOriginalPriceUnit) * 100 : 0;
    
    // We update the "calculatedDiscountAmount" to match savings
    calculatedDiscountAmount = calculatedSavings;

  } else if (mode === 'ORIGINAL') {
    // Reverse: Final + Discount -> Original
    let derivedOriginal = 0;
    
    if (discountType === 'percent') {
        const rateDecimal = discountValue / 100;
        if (rateDecimal < 1) {
            derivedOriginal = targetPrice / (1 - rateDecimal);
        } else {
            derivedOriginal = targetPrice; // Fallback
        }
    } else {
        derivedOriginal = targetPrice + discountValue;
    }
    
    calculatedOriginalPriceUnit = derivedOriginal;
    calculatedFinalPriceUnit = targetPrice;
    calculatedSavings = calculatedOriginalPriceUnit - calculatedFinalPriceUnit;
    effectiveRate = calculatedOriginalPriceUnit > 0 ? (calculatedSavings / calculatedOriginalPriceUnit) * 100 : 0;
  }

  // --- COMMON TOTALS CALCULATION ---
  const subtotal = calculatedFinalPriceUnit * quantity;
  const taxAmount = subtotal * (taxRate / 100);
  const totalCost = subtotal + taxAmount + shippingCost;
  const totalSaving = (calculatedOriginalPriceUnit - calculatedFinalPriceUnit) * quantity;

  return {
    finalPrice: calculatedFinalPriceUnit,
    totalCost,
    totalSaving,
    taxAmount,
    pricePerUnit: totalCost / quantity,
    effectiveDiscountRate: effectiveRate,
    calculationMode: mode
  };
};
