
import React from 'react';
import { WeeklyPlanResponse, ShoppingListResponse, InventoryAnalysisResponse } from '../types';
import { Calendar, ShoppingCart, Lightbulb, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

interface ViewProps<T> {
  data: T;
  onAction?: () => void;
}

export const WeeklyPlanView: React.FC<ViewProps<WeeklyPlanResponse>> = ({ data }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Calendar size={24} />
            <h2 className="text-xl font-bold">Weekly Plan</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase">Total Cost</p>
            <p className={`font-bold ${data.within_budget ? 'text-green-600' : 'text-orange-500'}`}>
              ${data.total_cost.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {data.weekly_plan.map((day, i) => (
            <div key={i} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-800">{day.day}</h3>
                <span className="text-xs font-medium text-slate-500">${day.day_total.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {day.meals.map((meal, j) => (
                  <div key={j} className="bg-slate-50 p-2 rounded-lg text-sm">
                    <span className="text-xs text-indigo-500 font-bold uppercase block mb-1">{meal.meal_type}</span>
                    <span className="text-slate-700">{meal.name}</span>
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-orange-600">
          <ShoppingCart size={24} />
          <h2 className="text-xl font-bold">Shopping List</h2>
        </div>
        <div className="bg-orange-50 px-3 py-1 rounded-full">
           <span className="text-xs font-bold text-orange-700">Est. ${data.estimated_total_cost.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.shopping_list.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
             <div className="mt-1">
               <div className="w-5 h-5 border-2 border-slate-300 rounded-md"></div>
             </div>
             <div className="flex-1">
               <div className="flex justify-between">
                 <h3 className="font-semibold text-slate-800">{item.item}</h3>
                 <span className="text-sm font-medium text-slate-500">{item.quantity}</span>
               </div>
               <p className="text-xs text-slate-500 mt-1">{item.reason}</p>
             </div>
          </div>
        ))}
        {data.shopping_list.length === 0 && (
          <p className="text-center text-slate-500 py-4">Nothing to buy! You're all set.</p>
        )}
      </div>
    </div>
  );
};

export const InventoryAnalysisView: React.FC<ViewProps<InventoryAnalysisResponse>> = ({ data }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Cheap Meals */}
      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
        <div className="flex items-center gap-2 text-emerald-700 mb-3">
          <CheckCircle2 size={20} />
          <h3 className="font-bold">Meals you can make now</h3>
        </div>
        <ul className="space-y-2">
          {data.cheap_meal_options.map((opt, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-emerald-900">
              <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              {opt}
            </li>
          ))}
        </ul>
      </div>

      {/* Extensions */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-center gap-2 text-blue-700 mb-3">
          <Lightbulb size={20} />
          <h3 className="font-bold">Extend your food</h3>
        </div>
        <ul className="space-y-2">
          {data.ways_to_extend_inventory.map((opt, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
              <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              {opt}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Additions */}
      <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
        <div className="flex items-center gap-2 text-purple-700 mb-3">
          <TrendingUp size={20} />
          <h3 className="font-bold">Smart Additions</h3>
        </div>
        <ul className="space-y-2">
          {data.recommended_additions.map((opt, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-purple-900">
              <span className="mt-1.5 w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
              {opt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
