
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { DiscountInput, CalculatorMode, CalculationResult } from './types';
import { calculateDiscount } from './services/calculatorService';
import { analyzeDeal } from './services/aiService';
import { Calculator, RefreshCw } from 'lucide-react';

// Default Initial State
const defaultInput: DiscountInput = {
  originalPrice: 100,
  discountValue: 20,
  discountType: 'percent',
  quantity: 1,
  taxRate: 0,
  shippingCost: 0,
  additionalCoupon: 0,
  currency: 'USD',
  targetPrice: 0,
  dealType: 'standard'
};

function App() {
  const [mode, setMode] = useState<CalculatorMode>('PRICE');
  const [inputs, setInputs] = useState<DiscountInput>(defaultInput);
  
  // Results are now manual
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // AI State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle Input Changes
  const handleInputChange = useCallback((key: keyof DiscountInput, value: string | number) => {
      setInputs(prev => ({ ...prev, [key]: value }));
      // Clear result on specific changes if we want to force recalculation? 
      // User requested manual Calculate button, so we keep result until button clicked or we can clear it.
      // Let's keep the result to compare, but maybe clear AI advice.
      setAiAdvice(null);
  }, []);

  const handleCalculate = () => {
    const calcResult = calculateDiscount(inputs, mode);
    setResult(calcResult);
    // Smooth scroll to result on mobile?
    const resultElement = document.getElementById('result-section');
    if (resultElement && window.innerWidth < 1024) {
      resultElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setInputs({...defaultInput, currency: inputs.currency});
    setResult(null);
    setAiAdvice(null);
  };

  // AI Analysis Handler
  const handleAnalyze = async () => {
    if (!result) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    setAiAdvice(null);

    // Simulate progress for UX
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return 90;
        return p + Math.floor(Math.random() * 10);
      });
    }, 150);

    try {
      const advice = await analyzeDeal(inputs, result);
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setAiAdvice(advice);
        setIsAnalyzing(false);
      }, 500); 

    } catch (e) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setAiAdvice("Failed to analyze. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 pb-20 font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-md">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Discount Calculator
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-7 space-y-6">
              
              <InputForm 
                values={inputs} 
                onChange={handleInputChange} 
                mode={mode}
                onModeChange={(m) => { setMode(m); setResult(null); }}
              />
              
              {/* Primary Actions */}
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={handleCalculate}
                   className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                 >
                   Calculate Result
                 </button>
                 
                 <button 
                   onClick={handleReset} 
                   className="w-full py-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-slate-500 font-medium"
                 >
                   <RefreshCw className="w-4 h-4" /> Reset
                 </button>
              </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-5" id="result-section">
            <div className="sticky top-24">
              <ResultCard 
                  result={result} 
                  input={inputs} 
                  aiAdvice={aiAdvice}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  progress={progress}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
