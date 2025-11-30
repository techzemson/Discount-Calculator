
import React from 'react';
import { DiscountInput, CalculatorMode } from '../types';
import { currencies } from '../services/calculatorService';
import { Percent, Tag, Truck, Calculator, ArrowRightLeft, ShoppingBag, Info } from 'lucide-react';

interface InputFormProps {
  values: DiscountInput;
  onChange: (key: keyof DiscountInput, value: string | number) => void;
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  disabled?: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ values, onChange, mode, onModeChange, disabled }) => {
  
  const currentCurrency = currencies.find(c => c.code === values.currency) || currencies[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Mode Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-1 gap-1">
        <button
          onClick={() => onModeChange('PRICE')}
          className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'PRICE' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Calculator className="w-4 h-4" /> Price Discount
        </button>
        <button
          onClick={() => onModeChange('DISCOUNT')}
          className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'DISCOUNT' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Percent className="w-4 h-4" /> Discount Percentage
        </button>
        <button
          onClick={() => onModeChange('ORIGINAL')}
          className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'ORIGINAL' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Original Price
        </button>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Mode Explanations */}
        {mode === 'PRICE' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
             <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
             <div className="text-sm text-blue-800">
               <p className="font-semibold mb-1">How Price Discount Works?</p>
               <p className="opacity-90">
                 This tool calculates the <strong>Final Pay Price</strong> by subtracting the discount value from the original price.
               </p>
               <p className="mt-1 text-xs opacity-75 font-mono">Formula: Original Price - Discount = Final Price</p>
             </div>
          </div>
        )}

        {mode === 'DISCOUNT' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
             <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
             <div className="text-sm text-blue-800">
               <p className="font-semibold mb-1">How Discount Percentage Works?</p>
               <p className="opacity-90">
                 Find out the exact <strong>Discount %</strong> you received by comparing the Original Price and what you actually Paid.
               </p>
               <p className="mt-1 text-xs opacity-75 font-mono">Formula: ((Original - Final) / Original) × 100</p>
             </div>
          </div>
        )}

        {mode === 'ORIGINAL' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
             <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
             <div className="text-sm text-blue-800">
               <p className="font-semibold mb-1">How Original Price is Calculated?</p>
               <p className="opacity-90">
                 This tool performs a reverse calculation to find the price <strong>before</strong> the discount was applied.
               </p>
               <p className="mt-1 text-xs opacity-75 font-mono">Formula: Final Price / (1 - Discount Percentage)</p>
             </div>
          </div>
        )}

        {/* Currency and Quantity Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Currency Selector */}
          <div>
             <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Select Currency</label>
             <div className="relative">
               <select
                 value={values.currency}
                 onChange={(e) => onChange('currency', e.target.value)}
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm font-medium text-slate-700 cursor-pointer appearance-none"
               >
                 {currencies.map(c => (
                   <option key={c.code} value={c.code}>{c.name} ({c.code} - {c.symbol})</option>
                 ))}
               </select>
               <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
             </div>
          </div>

          {/* Quantity Input - Highlighted */}
          <div>
             <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                Quantity <span className="text-red-400 text-[10px] normal-case font-normal">(Required)</span>
             </label>
             <div className="relative">
                <input
                    type="number"
                    min="1"
                    value={values.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      onChange('quantity', isNaN(val) ? 0 : val);
                    }}
                    disabled={disabled}
                    className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <ShoppingBag className="w-5 h-5 opacity-50" />
                </div>
             </div>
          </div>
        </div>

        {/* Inputs based on Mode */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* 1. Original Price Input (Required for PRICE and DISCOUNT modes) */}
          {(mode === 'PRICE' || mode === 'DISCOUNT') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Original Price (Per Item)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold text-lg">{currentCurrency.symbol}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.originalPrice || ''}
                  onChange={(e) => onChange('originalPrice', parseFloat(e.target.value))}
                  disabled={disabled}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm placeholder-slate-300"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* DEAL TYPE SELECTOR (New Feature for PRICE mode) */}
          {mode === 'PRICE' && (
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Deal Type</label>
               <div className="grid grid-cols-3 gap-2">
                 <button
                    onClick={() => onChange('dealType', 'standard')}
                    className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${values.dealType === 'standard' ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   Standard
                 </button>
                 <button
                    onClick={() => onChange('dealType', 'bogo')}
                    className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${values.dealType === 'bogo' ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   Buy 1 Get 1 Free
                 </button>
                 <button
                    onClick={() => onChange('dealType', 'b2g1')}
                    className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${values.dealType === 'b2g1' ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   Buy 2 Get 1 Free
                 </button>
               </div>
            </div>
          )}

          {/* 2. Target Price Input (Required for DISCOUNT and ORIGINAL modes) */}
          {(mode === 'DISCOUNT' || mode === 'ORIGINAL') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                 {mode === 'DISCOUNT' ? 'Final Price (Amount Paid)' : 'Final Price (After Discount)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold text-lg">{currentCurrency.symbol}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.targetPrice || ''}
                  onChange={(e) => onChange('targetPrice', parseFloat(e.target.value))}
                  disabled={disabled}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm placeholder-slate-300"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* 3. Discount Input (Required for PRICE [Standard only] and ORIGINAL modes) */}
          {((mode === 'PRICE' && values.dealType === 'standard') || mode === 'ORIGINAL') && (
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discount Value</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {values.discountType === 'percent' ? <Percent className="w-4 h-4 text-slate-400"/> : <span className="text-slate-400 font-bold text-xs">{currentCurrency.symbol}</span>}
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={values.discountValue || ''}
                      onChange={(e) => onChange('discountValue', parseFloat(e.target.value))}
                      disabled={disabled}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-semibold"
                      placeholder={values.discountType === 'percent' ? '15' : '10.00'}
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                   <div className="flex bg-slate-100 p-1 rounded-xl">
                     <button
                        onClick={() => onChange('discountType', 'percent')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${values.discountType === 'percent' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                       % Off
                     </button>
                     <button
                        onClick={() => onChange('discountType', 'fixed')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${values.discountType === 'fixed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                       Fixed
                     </button>
                   </div>
                </div>
             </div>
          )}

        </div>

        {/* Simple Extra Options */}
        {mode === 'PRICE' && (
          <div className="pt-6 border-t border-slate-100">
             <div className="flex items-center gap-2 mb-3">
               <p className="text-sm font-bold text-slate-700">Optional Costs & Fees</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tax (%)</label>
                    <div className="relative">
                      <input
                          type="number"
                          min="0"
                          value={values.taxRate || ''}
                          onChange={(e) => onChange('taxRate', parseFloat(e.target.value))}
                          disabled={disabled}
                          placeholder="0"
                          className="w-full pl-3 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                         <span className="text-slate-400 text-xs font-bold">%</span>
                      </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Shipping</label>
                    <div className="relative">
                      <input
                          type="number"
                          min="0"
                          value={values.shippingCost || ''}
                          onChange={(e) => onChange('shippingCost', parseFloat(e.target.value))}
                          disabled={disabled}
                          placeholder="0"
                          className="w-full pl-6 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                         <span className="text-slate-400 text-xs font-bold">{currentCurrency.symbol}</span>
                      </div>
                    </div>
                </div>
                {values.dealType === 'standard' && (
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Extra Coupon (%)</label>
                      <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={values.additionalCoupon || ''}
                            onChange={(e) => onChange('additionalCoupon', parseFloat(e.target.value))}
                            disabled={disabled}
                            placeholder="0"
                            className="w-full pl-3 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                         <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                           <span className="text-slate-400 text-xs font-bold">%</span>
                        </div>
                      </div>
                  </div>
                )}
             </div>
             {values.dealType !== 'standard' && (
               <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700 flex items-center gap-2 border border-blue-100">
                 <Tag className="w-4 h-4"/>
                 <span>
                   Applying <strong>{values.dealType === 'bogo' ? 'Buy 1 Get 1 Free' : 'Buy 2 Get 1 Free'}</strong> offer logic.
                 </span>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
