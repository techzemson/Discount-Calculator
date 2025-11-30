
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
    targetPrice = 0,
    dealType = 'standard'
  } = input;

  let calculatedFinalPriceUnit = 0;
  let calculatedOriginalPriceUnit = 0;
  let calculatedDiscountAmount = 0;
  let calculatedSavings = 0;
  let effectiveRate = 0;
  let totalSubtotal = 0;

  // --- LOGIC BRANCHING BASED ON MODE ---

  if (mode === 'PRICE') {
    // Standard: Original -> Final
    calculatedOriginalPriceUnit = originalPrice;
    
    // Handle Deal Types
    if (dealType === 'bogo') {
      // Buy 1 Get 1 Free
      // If Quantity is 2, Pay for 1. If Qty 1, Pay 1. If Qty 3, Pay 2.
      // Formula: Paid Items = Math.ceil(quantity / 2)
      const paidItems = Math.ceil(quantity / 2);
      const freeItems = Math.floor(quantity / 2); // Actually for BOGO, usually it's pairs. Let's assume strict pairs or "Every 2nd is free".
      // Common Retail BOGO: Buy 1, Get 2nd Free.
      // If I buy 3, I pay for 2. (Pair + 1 single).
      
      const itemsToPay = Math.ceil(quantity / 2);
      totalSubtotal = itemsToPay * originalPrice;
      
      // Effective Unit Price
      calculatedFinalPriceUnit = totalSubtotal / quantity;
      calculatedDiscountAmount = originalPrice - calculatedFinalPriceUnit;

    } else if (dealType === 'b2g1') {
      // Buy 2 Get 1 Free
      // Groups of 3. Pay for 2.
      const groups = Math.floor(quantity / 3);
      const remainder = quantity % 3;
      const itemsToPay = (groups * 2) + remainder;
      
      totalSubtotal = itemsToPay * originalPrice;
      calculatedFinalPriceUnit = totalSubtotal / quantity;
      calculatedDiscountAmount = originalPrice - calculatedFinalPriceUnit;

    } else {
      // Standard Discount
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
      totalSubtotal = calculatedFinalPriceUnit * quantity;
    }

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
    totalSubtotal = calculatedFinalPriceUnit * quantity;

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
    totalSubtotal = calculatedFinalPriceUnit * quantity;
  }

  // --- COMMON TOTALS CALCULATION ---
  const taxAmount = totalSubtotal * (taxRate / 100);
  const totalCost = totalSubtotal + taxAmount + shippingCost;
  const totalSaving = (calculatedOriginalPriceUnit * quantity) - totalSubtotal;

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
