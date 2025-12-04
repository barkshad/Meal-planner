
import React from 'react';
import { MealResponse } from '../types';
import { CheckCircle2, AlertCircle, Utensils, DollarSign, Clock, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ResultCardProps {
  data: MealResponse;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  return (
    <div className="glass-panel overflow-hidden animate-slide-up shadow-xl shadow-emerald-900/5">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 opacity-90 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-black/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                 <Clock size={12} /> {data.meal_type}
              </span>
              
              {/* STATUS BADGES */}
              {data.within_budget && !data.auto_adjusted && (
                <span className="px-2 py-0.5 rounded-md bg-green-400/20 border border-green-400/30 text-green-50 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                   <ShieldCheck size={12} /> Budget Safe
                </span>
              )}
              {data.auto_adjusted && (
                <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 border border-yellow-400/30 text-yellow-50 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                   <AlertTriangle size={12} /> Adjusted
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Recommendation</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
             <Utensils size={28} className="text-white drop-shadow-sm" />
          </div>
        </div>
        <p className="mt-4 text-emerald-50 text-sm font-medium leading-relaxed bg-black/10 p-3 rounded-xl border border-white/10">
          "{data.message}"
        </p>
      </div>

      <div className="p-6 bg-white">
        <div className="space-y-4 mb-8">
          {data.suggestions?.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
               <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-1.5">
                 <CheckCircle2 size={16} />
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                   <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{item.food}</h3>
                   <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">KES {item.estimated_cost}</span>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed">{item.reason}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${data.within_budget ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Est. Cost</p>
              <p className={`text-2xl font-bold ${data.within_budget ? 'text-emerald-600' : 'text-orange-600'}`}>
                KES {data.total_meal_cost}
              </p>
            </div>
          </div>
          
          {!data.within_budget && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold border border-orange-100">
              <AlertCircle size={14} />
              <span>Over Budget</span>
            </div>
          )}

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all border border-slate-200 hover:border-slate-300 flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Plan Another
          </button>
        </div>
      </div>
    </div>
  );
};
