
import React from 'react';
import { MealResponse } from '../types';
import { CheckCircle2, AlertCircle, Utensils, DollarSign, Clock } from 'lucide-react';

interface ResultCardProps {
  data: MealResponse;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden animate-fade-in">
      <div className="bg-emerald-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 opacity-90 mb-1">
              <Clock size={16} />
              <span className="text-sm font-medium uppercase tracking-wider">{data.meal_type}</span>
            </div>
            <h2 className="text-2xl font-bold">Here's the plan</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
             <Utensils size={24} className="text-white" />
          </div>
        </div>
        <p className="mt-3 text-emerald-50 italic">"{data.message}"</p>
      </div>

      <div className="p-6">
        <div className="space-y-4 mb-6">
          {data.suggestions.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
               <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-1">
                 <CheckCircle2 size={14} />
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h3 className="font-semibold text-slate-800">{item.food}</h3>
                   <span className="text-sm font-medium text-emerald-600">KES {item.estimated_cost}</span>
                 </div>
                 <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.reason}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${data.within_budget ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Cost</p>
              <p className={`text-lg font-bold ${data.within_budget ? 'text-green-700' : 'text-orange-600'}`}>
                KES {data.total_meal_cost}
              </p>
            </div>
          </div>
          
          {!data.within_budget && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-xs">
              <AlertCircle size={14} />
              <span>Slightly over budget</span>
            </div>
          )}

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            Plan Another
          </button>
        </div>
      </div>
    </div>
  );
};
