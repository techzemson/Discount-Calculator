
import React from 'react';
import { CalculationResult, DiscountInput } from '../types';
import { formatCurrency } from '../services/calculatorService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowDown, Share2, Download, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface ResultCardProps {
  result: CalculationResult;
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
  
  // Prepare Chart Data
  // Filter out zero values to avoid Recharts rendering empty segments or artifacts
  const chartData = [
    { name: 'Net Cost', value: result.totalCost - result.taxAmount - input.shippingCost, color: '#3b82f6' }, // Blue
    { name: 'Tax', value: result.taxAmount, color: '#f59e0b' }, // Amber
    { name: 'Shipping', value: input.shippingCost, color: '#64748b' }, // Slate
  ].filter(item => item.value > 0);

  // If no cost data (e.g. everything 0), show a placeholder or just empty
  const hasData = chartData.length > 0;

  const handleShare = async () => {
    const text = `Discount Calculator Result for ${input.itemName || 'Item'}: Final Price ${formatCurrency(result.totalCost, input.currency)}. Saved ${formatCurrency(result.totalSaving, input.currency)}!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Discount Result', text });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };
  
  const handleDownload = () => {
     const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({...input, ...result}, null, 2));
     const downloadAnchorNode = document.createElement('a');
     downloadAnchorNode.setAttribute("href",     dataStr);
     downloadAnchorNode.setAttribute("download", "discount_result.json");
     document.body.appendChild(downloadAnchorNode);
     downloadAnchorNode.click();
     downloadAnchorNode.remove();
  };

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
    mainValue = formatCurrency(result.finalPrice + result.totalSaving, input.currency); // Reconstruct original unit
    subValue = "Before discount";
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full relative">
      
      {/* Header / Main Result */}
      <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

        <h2 className="text-lg font-medium opacity-90 flex items-center gap-2 relative z-10">
          {mainLabel}
        </h2>
        <div className="mt-2 flex items-baseline gap-3 relative z-10">
           <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
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
                Save: {formatCurrency(result.totalSaving, input.currency)}
             </div>
          )}
          {result.effectiveDiscountRate > 0 && (
            <div className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-md border border-white/10 shadow-sm">
               {result.effectiveDiscountRate.toFixed(1)}% Off
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        
        {/* Additional Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
           <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-500 mb-1">Total Cost</div>
              <div className="font-semibold text-slate-800">{formatCurrency(result.totalCost, input.currency)}</div>
           </div>
           {result.calculationMode === 'DISCOUNT' && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500 mb-1">Original Price</div>
                <div className="font-semibold text-slate-800">{formatCurrency(input.originalPrice, input.currency)}</div>
              </div>
           )}
            {result.calculationMode === 'PRICE' && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500 mb-1">Unit Price</div>
                <div className="font-semibold text-slate-800">{formatCurrency(result.finalPrice, input.currency)}</div>
              </div>
           )}
        </div>

        {/* Chart */}
        {hasData && result.calculationMode === 'PRICE' && (
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
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
            {/* Center Label for Donut */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Costs</span>
            </div>
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
                   className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300 ease-out"
                   style={{ width: `${progress}%` }}
                 />
               </div>
               <p className="text-xs text-slate-400 text-center animate-pulse">Finding the best savings strategy...</p>
             </div>
          ) : (
            <>
              {aiAdvice ? (
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 relative group">
                  <div className="absolute -top-2.5 left-4 bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-indigo-100 flex items-center gap-1">
                     <TrendingUp className="w-3 h-3" /> AI Verdict
                  </div>
                  <p className="text-indigo-900 text-sm leading-relaxed mt-1 italic">
                    "{aiAdvice}"
                  </p>
                  <button 
                    onClick={onAnalyze} 
                    className="text-xs text-indigo-500 underline mt-2 hover:text-indigo-700 font-medium"
                  >
                    Analyze Again
                  </button>
                </div>
              ) : (
                 <button
                    onClick={onAnalyze}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                 >
                   <Sparkles className="w-4 h-4 text-yellow-300" /> Analyze Deal Value
                 </button>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
           <button 
             onClick={handleShare}
             className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-100 transition-all text-sm font-medium"
           >
             <Share2 className="w-4 h-4" /> Share Result
           </button>
           <button 
             onClick={handleDownload}
             className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-100 transition-all text-sm font-medium"
           >
             <Download className="w-4 h-4" /> Download
           </button>
        </div>
      </div>
    </div>
  );
};
