
import React, { useState, useMemo, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { DiscountInput, HistoryItem, CalculatorMode } from './types';
import { calculateDiscount, formatCurrency } from './services/calculatorService';
import { analyzeDeal } from './services/aiService';
import { Calculator, History, Trash2, RefreshCw, BadgePercent } from 'lucide-react';

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
  itemName: '',
  targetPrice: 0
};

function App() {
  const [mode, setMode] = useState<CalculatorMode>('PRICE');
  const [inputs, setInputs] = useState<DiscountInput>(defaultInput);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('discount_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  // AI State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Derived Results
  const result = useMemo(() => calculateDiscount(inputs, mode), [inputs, mode]);

  // Handle Input Changes
  const handleInputChange = useCallback((key: keyof DiscountInput, value: string | number) => {
      setInputs(prev => ({ ...prev, [key]: value }));
      // Reset AI advice when inputs change significantly
      if (['originalPrice', 'discountValue', 'discountType', 'additionalCoupon', 'targetPrice'].includes(key)) {
         setAiAdvice(null); 
      }
  }, []);

  const addToHistory = (input: DiscountInput, resultCalc: any) => {
    const newItem: HistoryItem = {
      ...input,
      ...resultCalc,
      id: Date.now().toString(),
      timestamp: Date.now(),
      aiAdvice: aiAdvice || undefined
    };
    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('discount_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('discount_history');
  };

  // AI Analysis Handler
  const handleAnalyze = async () => {
    // Basic validation
    if (mode === 'PRICE' && inputs.originalPrice <= 0) return;
    if (mode === 'DISCOUNT' && (inputs.originalPrice <= 0 || (inputs.targetPrice || 0) <= 0)) return;
    
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
        addToHistory(inputs, result); // Auto save analyzed deals
      }, 500); 

    } catch (e) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setAiAdvice("Failed to analyze. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">
                Discount Calculator
              </h1>
              <p className="text-xs text-slate-500 font-medium">Smart Savings Tool</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-7 space-y-6">
              
              {/* Introduction Text (SEO friendly keywords visually) */}
              <div className="flex flex-wrap gap-2 mb-2">
                 {['Discount Price', 'Sale Calculator', 'Percentage Off', 'Rate Finder'].map(tag => (
                   <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-slate-200">
                     {tag}
                   </span>
                 ))}
              </div>

              <InputForm 
                values={inputs} 
                onChange={handleInputChange} 
                mode={mode}
                onModeChange={setMode}
              />
              
              <div className="flex gap-4">
                 <button onClick={() => setInputs({...defaultInput, currency: inputs.currency})} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-slate-600 font-medium shadow-sm">
                   <RefreshCw className="w-4 h-4" /> Reset Form
                 </button>
              </div>

              {/* History Section */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                   <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                     <History className="w-4 h-4 text-blue-500" /> Recent Calculations
                   </h3>
                   {history.length > 0 && (
                     <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors">
                       <Trash2 className="w-3 h-3" /> Clear All
                     </button>
                   )}
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {history.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center gap-3">
                      <div className="p-3 bg-slate-50 rounded-full">
                        <BadgePercent className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm">Your calculation history will appear here.</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {history.map((item) => (
                        <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center group cursor-default">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            <div>
                              <div className="font-medium text-slate-800 text-sm">{item.itemName || 'Untitled Item'}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {item.calculationMode === 'PRICE' ? (
                                   <>Orig: {formatCurrency(item.originalPrice, item.currency)} → Final: {formatCurrency(item.totalCost, item.currency)}</>
                                ) : (
                                   <>Found: {item.effectiveDiscountRate.toFixed(1)}% Off</>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-600 font-bold text-sm">
                               {item.calculationMode === 'DISCOUNT' ? item.effectiveDiscountRate.toFixed(1) + '%' : '-' + formatCurrency(item.totalSaving, item.currency)}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-6">
              <ResultCard 
                  result={result} 
                  input={inputs} 
                  aiAdvice={aiAdvice}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  progress={progress}
              />
              
              {/* Feature Highlights / Trust signals */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs font-bold text-slate-700">Instant Result</div>
                 </div>
                 <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="text-2xl mb-1">📱</div>
                    <div className="text-xs font-bold text-slate-700">Mobile Ready</div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
