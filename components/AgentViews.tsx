import React from 'react';
import { WeeklyPlanResponse, ShoppingListResponse, InventoryAnalysisResponse } from '../types';
import { Calendar, ShoppingCart, Lightbulb, CheckCircle2, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

interface ViewProps<T> {
  data: T;
  onAction?: () => void;
}

export const WeeklyPlanView: React.FC<ViewProps<WeeklyPlanResponse>> = ({ data }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel rounded-3xl p-6 shadow-xl border-white/10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
               <Calendar size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">7-Day Plan</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Cost</p>
            <p className={`text-xl font-bold ${data.within_budget ? 'text-emerald-400' : 'text-orange-400'}`}>
              KES {data.total_cost}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {data.weekly_plan.map((day, i) => (
            <div key={i} className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 hover:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-indigo-300">{day.day}</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-900/50 px-2 py-1 rounded">KES {day.day_total}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {day.meals.map((meal, j) => (
                  <div key={j} className="bg-slate-900/50 p-3 rounded-xl border border-white/5 text-sm">
                    <span className="text-[10px] text-indigo-400/80 font-bold uppercase block mb-1">{meal.meal_type}</span>
                    <span className="text-slate-200 font-medium">{meal.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ShoppingListView: React.FC<ViewProps<ShoppingListResponse>> = ({ data }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 shadow-xl border-white/10 animate-fade-in">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
             <ShoppingCart size={24} className="text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Shopping List</h2>
        </div>
        <div className="bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20">
           <span className="text-xs font-bold text-orange-400">Est. KES {data.estimated_total_cost}</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.shopping_list.map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-4 bg-slate-800/40 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all group">
             <div className="mt-1">
               <div className="w-5 h-5 border-2 border-slate-600 rounded-md group-hover:border-orange-400 transition-colors cursor-pointer"></div>
             </div>
             <div className="flex-1">
               <div className="flex justify-between">
                 <h3 className="font-bold text-slate-200 group-hover:text-white">{item.item}</h3>
                 <span className="text-sm font-bold text-orange-400/80 bg-orange-500/10 px-2 rounded">{item.quantity}</span>
               </div>
               <p className="text-xs text-slate-500 mt-1">{item.reason}</p>
             </div>
          </div>
        ))}
        {data.shopping_list.length === 0 && (
          <p className="text-center text-slate-500 py-8">Nothing to buy! You're all set.</p>
        )}
      </div>
    </div>
  );
};

export const InventoryAnalysisView: React.FC<ViewProps<InventoryAnalysisResponse>> = ({ data }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Cheap Meals */}
      <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-2 text-emerald-400 mb-3">
          <CheckCircle2 size={20} />
          <h3 className="font-bold text-white">Meals you can make now</h3>
        </div>
        <ul className="space-y-2">
          {data.cheap_meal_options.map((opt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <ArrowRight size={14} className="mt-1 text-emerald-500" />
              {opt}
            </li>
          ))}
        </ul>
      </div>

      {/* Extensions */}
      <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-blue-500">
        <div className="flex items-center gap-2 text-blue-400 mb-3">
          <Lightbulb size={20} />
          <h3 className="font-bold text-white">Extend your food</h3>
        </div>
        <ul className="space-y-2">
          {data.ways_to_extend_inventory.map((opt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <ArrowRight size={14} className="mt-1 text-blue-500" />
              {opt}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Additions */}
      <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-purple-500">
        <div className="flex items-center gap-2 text-purple-400 mb-3">
          <TrendingUp size={20} />
          <h3 className="font-bold text-white">Smart Additions</h3>
        </div>
        <ul className="space-y-2">
          {data.recommended_additions.map((opt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <ArrowRight size={14} className="mt-1 text-purple-500" />
              {opt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};