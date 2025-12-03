import React, { useState, useEffect } from 'react';
import { X, Save, Coins } from 'lucide-react';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  onSave: (newBudget: number) => void;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ 
  isOpen, 
  onClose, 
  currentBudget, 
  onSave 
}) => {
  const [budget, setBudget] = useState(currentBudget.toString());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBudget(currentBudget.toString());
      setIsAnimating(true);
    } else {
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen, currentBudget]);

  const handleSave = () => {
    const val = parseFloat(budget);
    if (!isNaN(val) && val > 0) {
      onSave(val);
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden
        transform transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full sm:translate-y-10 sm:scale-95'}
      `}>
        
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-10"></div>
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-emerald-400 rounded-full blur-3xl opacity-30"></div>

        <div className="relative p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shadow-inner">
                <Coins size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Adjust Budget</h3>
                <p className="text-xs text-slate-500">Recalculate meals instantly</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
                Daily Limit (KES)
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-emerald-500 transition-colors">KES</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 text-2xl font-mono font-bold text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-0 outline-none transition-all shadow-inner"
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              <span>Update & Regenerate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};