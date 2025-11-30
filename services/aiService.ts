
import { GoogleGenAI } from "@google/genai";
import { DiscountInput, CalculationResult } from "../types";

// Helper to safely get the API key
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const analyzeDeal = async (
  input: DiscountInput,
  result: CalculationResult
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "AI Analysis unavailable: API Key not configured.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze this shopping deal and provide a short, witty, and helpful verdict in 2-3 sentences.
    
    Original Price: ${input.currency} ${input.originalPrice}
    Discount: ${input.discountType === 'percent' ? input.discountValue + '%' : input.discountValue + ' flat'} off
    Additional Coupon: ${input.additionalCoupon}%
    Final Total Cost (inc tax/shipping): ${input.currency} ${result.totalCost.toFixed(2)}
    Total Savings: ${input.currency} ${result.totalSaving.toFixed(2)} (${result.effectiveDiscountRate.toFixed(1)}%)
    
    Is this a good deal? Should the user buy it? 
    Don't mention you are an AI. Just give the advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not analyze deal at this time.";
  } catch (error) {
    console.error("AI Analysis failed", error);
    return "Unable to connect to deal analyzer.";
  }
};
