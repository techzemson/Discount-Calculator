
import React from 'react';
import { X, BookOpen, Calculator, Percent, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Documentation & User Guide</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Section 1: Introduction */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to Smart Discount Calculator</h3>
            <p className="text-slate-600 leading-relaxed">
              This tool is designed to help you make smarter shopping decisions by quickly calculating final prices, savings, and even reverse-calculating original prices. It's packed with advanced features like AI analysis and special deal logic (BOGO).
            </p>
          </section>

          {/* Section 2: How to Use */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
              How to Use
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
                  <Calculator className="w-4 h-4" /> Price Discount
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use this when you know the <strong>Original Price</strong> and the <strong>Discount</strong> (e.g., 20% off). It tells you exactly how much you need to pay.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
                  <Percent className="w-4 h-4" /> Discount %
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use this to find out the <strong>Discount Percentage</strong>. Enter the Original Price and the Final Price you paid to see the real deal rate.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
                  <ArrowRightLeft className="w-4 h-4" /> Original Price
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reverse calculation! Use this if you only know the <strong>Final Price</strong> and the <strong>Discount %</strong> but want to know what the item cost originally.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Features */}
          <section>
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
              Key Features
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Special Deal Types (BOGO)</span>
                  <p className="text-sm text-slate-600">
                    Easily calculate complex retail offers like <strong>"Buy 1 Get 1 Free"</strong> or <strong>"Buy 2 Get 1 Free"</strong>. The calculator automatically adjusts the unit price and savings.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Tax & Shipping Support</span>
                  <p className="text-sm text-slate-600">
                    Get the true "Out the Door" price by including tax rates and shipping costs in your calculation.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">AI Deal Analysis</span>
                  <p className="text-sm text-slate-600">
                    Not sure if it's a good bargain? Click <strong>"Analyze this Deal"</strong> to get an AI-powered verdict on whether you should buy it.
                  </p>
                </div>
              </li>
            </ul>
          </section>

           {/* Section 4: Benefits */}
           <section className="bg-blue-50 rounded-xl p-5 border border-blue-100">
             <h3 className="text-lg font-bold text-blue-900 mb-2">Why use this tool?</h3>
             <p className="text-sm text-blue-800 mb-2">
               Retailers often use confusing math to make deals look better than they are. This tool gives you transparency.
             </p>
             <div className="flex flex-wrap gap-2 mt-3">
               <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Save Money</span>
               <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Verify Deals</span>
               <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Quick Decisions</span>
             </div>
           </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
