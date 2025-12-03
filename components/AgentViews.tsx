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
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-100">
               <Calendar size={24} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">7-Day Plan</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Cost</p>
            <p className={`text-xl font-bold ${data.within_budget ? 'text-emerald-600' : 'text-orange-600'}`}>
              KES {data.total_cost}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {data.weekly_plan.map((day, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-indigo-700">{day.day}</h3>
                <span className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">KES {day.day_total}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {day.meals.map((meal, j) => (
                  <div key={j} className="bg-white p-3 rounded-xl border border-slate-100 text-sm">
                    <span className="text-[10px] text-indigo-500 font-bold uppercase block mb-1">{meal.meal_type}</span>
                    <span className="text-slate-700 font-medium">{meal.name}</span>
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
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-xl border border-orange-100">
             <ShoppingCart size={24} className="text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Shopping List</h2>
        </div>
        <div className="bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
           <span className="text-xs font-bold text-orange-600">Est. KES {data.estimated_total_cost}</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.shopping_list.map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all group">
             <div className="mt-1">
               <div className="w-5 h-5 border-2 border-slate-300 rounded-md group-hover:border-orange-400 transition-colors cursor-pointer bg-white"></div>
             </div>
             <div className="flex-1">
               <div className="flex justify-between">
                 <h3 className="font-bold text-slate-800">{item.item}</h3>
                 <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 rounded border border-orange-100">{item.quantity}</span>
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
      <div className="glass-panel p-5 border-l-4 border-l-emerald-500 bg-emerald-50/30">
        <div className="flex items-center gap-2 text-emerald-600 mb-3">
          <CheckCircle2 size={20} />
          <h3 className="font-bold text-slate-800">Meals you can make now</h3>
        </div>
        <ul className="space-y-2">
          {data.cheap_meal_options.map((opt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <ArrowRight size={14} className="mt-1 text-emerald-500" />
              {opt}
            </li>
          ))}
        </ul>
      </div>

      {/* Extensions */}
      <div className="glass-panel p-5 border-l-4 border-l-blue-500 bg-blue-50/30">
        <div className="flex items-center gap-2 text-blue-600 mb-3">
          <Lightbulb size={20} />
          <h3 className="font-bold text-slate-800">Extend your food</h3>
        </div>
        <ul className="space-y-2">
          {data.ways_to_extend_inventory.map((opt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <ArrowRight size={14} className="mt-1 text-blue-500" />
              {opt}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Additions */}
      <div className="glass-panel p-5 border-l-4 border-l-purple-500 bg-purple-50/30">
        <div className="flex items-center gap-2 text-purple-600 mb-3">
          <TrendingUp size={20} />
          <h3 className="font-bold text-slate-800">Smart Additions</h3>
        </div>
        <ul className="space-y-2">
          {data.recommended_additions.map((opt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <ArrowRight size={14} className="mt-1 text-purple-500" />
              {opt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};