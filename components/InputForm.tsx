
import React from 'react';
import { DiscountInput, CalculatorMode } from '../types';
import { currencies } from '../services/calculatorService';
import { Percent, Tag, Truck, Receipt, Calculator, ArrowRightLeft, DollarSign } from 'lucide-react';

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
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'PRICE' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Calculator className="w-4 h-4" /> Calculate Price
        </button>
        <button
          onClick={() => onModeChange('DISCOUNT')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'DISCOUNT' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Percent className="w-4 h-4" /> Find Discount
        </button>
        <button
          onClick={() => onModeChange('ORIGINAL')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'ORIGINAL' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Find Original
        </button>
      </div>

      <div className="p-6 space-y-5">
        
        {/* Item Name & Currency Row */}
        <div className="flex gap-3">
          <div className="flex-1">
             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Item Name</label>
             <input
                type="text"
                value={values.itemName}
                onChange={(e) => onChange('itemName', e.target.value)}
                placeholder="e.g. iPhone 15"
                disabled={disabled}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
              />
          </div>
          <div className="w-1/3 min-w-[120px]">
             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Currency</label>
             <select
               value={values.currency}
               onChange={(e) => onChange('currency', e.target.value)}
               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm font-medium text-slate-700 cursor-pointer appearance-none"
             >
               {currencies.map(c => (
                 <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
               ))}
             </select>
          </div>
        </div>

        {/* Inputs based on Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* 1. Original Price Input (Required for PRICE and DISCOUNT modes) */}
          {(mode === 'PRICE' || mode === 'DISCOUNT') && (
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Original Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">{currentCurrency.symbol}</span>
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

          {/* 2. Target Price Input (Required for DISCOUNT and ORIGINAL modes) */}
          {(mode === 'DISCOUNT' || mode === 'ORIGINAL') && (
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                 {mode === 'DISCOUNT' ? 'Final Price (Paid)' : 'Final Price (After Discount)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">{currentCurrency.symbol}</span>
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

          {/* 3. Discount Input (Required for PRICE and ORIGINAL modes) */}
          {(mode === 'PRICE' || mode === 'ORIGINAL') && (
             <>
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
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-semibold"
                      placeholder={values.discountType === 'percent' ? '15' : '10.00'}
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                   <div className="flex bg-slate-100 p-1 rounded-lg">
                     <button
                        onClick={() => onChange('discountType', 'percent')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${values.discountType === 'percent' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                       % Off
                     </button>
                     <button
                        onClick={() => onChange('discountType', 'fixed')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${values.discountType === 'fixed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                       Fixed
                     </button>
                   </div>
                </div>
             </>
          )}

        </div>

        {/* Additional Options Accordion or Always Visible */}
        {mode === 'PRICE' && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  Extra Coupon <Tag className="w-3 h-3"/>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={values.additionalCoupon || ''}
                    onChange={(e) => onChange('additionalCoupon', parseFloat(e.target.value))}
                    disabled={disabled}
                    placeholder="0"
                    className="w-full pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1.5 text-slate-400 text-sm">%</span>
                </div>
             </div>
             <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tax Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={values.taxRate || ''}
                    onChange={(e) => onChange('taxRate', parseFloat(e.target.value))}
                    disabled={disabled}
                    placeholder="0"
                    className="w-full pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1.5 text-slate-400 text-sm">%</span>
                </div>
             </div>
             <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Quantity</label>
                <input
                 type="number"
                 min="1"
                 value={values.quantity}
                 onChange={(e) => onChange('quantity', parseInt(e.target.value))}
                 disabled={disabled}
                 className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
               />
             </div>
             <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  Shipping <Truck className="w-3 h-3"/>
                </label>
                <input
                   type="number"
                   min="0"
                   value={values.shippingCost || ''}
                   onChange={(e) => onChange('shippingCost', parseFloat(e.target.value))}
                   disabled={disabled}
                   placeholder="0"
                   className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
