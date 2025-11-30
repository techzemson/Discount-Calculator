
import React from 'react';
import { CalculationResult, DiscountInput } from '../types';
import { formatCurrency } from '../services/calculatorService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowDown, TrendingUp, Sparkles } from 'lucide-react';

interface ResultCardProps {
  result: CalculationResult | null;
  input: DiscountInput;
  aiAdvice: string | null;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  progress: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  input, 
  aiAdvice, 
  onAnalyze, 
  isAnalyzing,
  progress 
}) => {
  
  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center p-10 text-center opacity-60">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
           <TrendingUp className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-400 font-medium">Enter details and click Calculate to see results.</p>
      </div>
    );
  }

  // Prepare Chart Data
  const chartData = [
    { name: 'Net Cost', value: result.totalCost - result.taxAmount - input.shippingCost, color: '#3b82f6' }, // Blue
    { name: 'Tax', value: result.taxAmount, color: '#f59e0b' }, // Amber
    { name: 'Shipping', value: input.shippingCost, color: '#64748b' }, // Slate
  ].filter(item => item.value > 0);

  const hasData = chartData.length > 0;

  // Determine Main Display based on Mode
  let mainLabel = "Final Price";
  let mainValue = formatCurrency(result.totalCost, input.currency);
  let subValue = "Total to pay";
  
  if (result.calculationMode === 'DISCOUNT') {
    mainLabel = "You Saved";
    mainValue = `${result.effectiveDiscountRate.toFixed(2)}%`;
    subValue = `(${formatCurrency(result.totalSaving, input.currency)} off)`;
  } else if (result.calculationMode === 'ORIGINAL') {
    mainLabel = "Original Price";
    mainValue = formatCurrency(result.finalPrice + result.totalSaving, input.currency);
    subValue = "Before discount";
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full relative">
      
      {/* Header / Main Result */}
      <div className="p-8 bg-blue-600 text-white relative overflow-hidden">
        <h2 className="text-lg font-medium opacity-90 flex items-center gap-2 relative z-10">
          {mainLabel}
        </h2>
        <div className="mt-2 flex items-baseline gap-3 relative z-10">
           <span className="text-5xl font-bold tracking-tight">
             {mainValue}
           </span>
        </div>
        <div className="mt-1 text-blue-100 text-sm font-medium relative z-10">
            {subValue}
        </div>

        {/* Badge Row */}
        <div className="mt-6 flex flex-wrap gap-2 relative z-10">
          {result.calculationMode === 'PRICE' && result.totalSaving > 0 && (
             <div className="px-3 py-1 bg-white/20 rounded-full flex items-center text-sm backdrop-blur-md border border-white/10 shadow-sm">
                <ArrowDown className="w-4 h-4 mr-1" />
                You Save: {formatCurrency(result.totalSaving, input.currency)}
             </div>
          )}
          {result.calculationMode === 'DISCOUNT' && (
             <div className="px-3 py-1 bg-white/20 rounded-full flex items-center text-sm backdrop-blur-md border border-white/10 shadow-sm">
                <ArrowDown className="w-4 h-4 mr-1" />
                Saved: {formatCurrency(result.totalSaving, input.currency)}
             </div>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        
        {/* Simple Details */}
        <div className="space-y-3">
           {result.calculationMode === 'PRICE' && (
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Unit Price (After Discount)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(result.finalPrice, input.currency)}</span>
             </div>
           )}
           {result.calculationMode === 'DISCOUNT' && (
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Original Price</span>
                <span className="font-semibold text-slate-800">{formatCurrency(input.originalPrice, input.currency)}</span>
             </div>
           )}
           <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500 text-sm">Total Cost</span>
              <span className="font-semibold text-slate-800">{formatCurrency(result.totalCost, input.currency)}</span>
           </div>
        </div>

        {/* Chart - Simplified without centered text to avoid overlap */}
        {hasData && result.calculationMode === 'PRICE' && (
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => [formatCurrency(value, input.currency), 'Amount']}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Analysis Section */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          {isAnalyzing ? (
             <div className="space-y-3">
               <div className="flex justify-between text-xs font-bold text-blue-600 uppercase tracking-wider">
                 <span className="flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Analyzing...</span>
                 <span>{progress}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-blue-500 transition-all duration-300 ease-out"
                   style={{ width: `${progress}%` }}
                 />
               </div>
             </div>
          ) : (
            <>
              {aiAdvice ? (
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 relative">
                  <div className="absolute -top-2.5 left-4 bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-indigo-100 flex items-center gap-1">
                     <TrendingUp className="w-3 h-3" /> AI Verdict
                  </div>
                  <p className="text-indigo-900 text-sm leading-relaxed mt-1 italic">
                    "{aiAdvice}"
                  </p>
                </div>
              ) : (
                 <button
                    onClick={onAnalyze}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
                 >
                   <Sparkles className="w-4 h-4 text-yellow-500" /> Analyze this Deal
                 </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
