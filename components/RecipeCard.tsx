
import React from 'react';
import { Recipe } from '../types';
import { ChefHat, Clock, DollarSign, ListOrdered, Utensils } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="glass-panel overflow-hidden animate-slide-up shadow-xl shadow-blue-900/5 mt-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="px-2 py-0.5 rounded-md bg-black/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ChefHat size={12} /> {recipe.category}
            </span>
            <h2 className="text-3xl font-bold tracking-tight">{recipe.title}</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
             <Utensils size={28} className="text-white drop-shadow-sm" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                <DollarSign size={16} />
                <span>Est. KES {recipe.estimated_cost_ksh}</span>
            </div>
             <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Clock size={16} />
                <span>{recipe.cook_time_minutes} mins</span>
            </div>
        </div>
      </div>

      <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><ListOrdered size={18} className="text-blue-500" /> Ingredients</h3>
            <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {ing}
                    </li>
                ))}
            </ul>
        </div>

        {/* Steps */}
        <div className="md:col-span-2">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><Utensils size={18} className="text-blue-500" /> Steps</h3>
            <div className="space-y-4">
                {recipe.steps.sort((a,b) => a.step - b.step).map((step) => (
                    <div key={step.step} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full font-bold border border-blue-100 mt-1">
                            {step.step}
                        </div>
                        <p className="text-slate-600 leading-relaxed pt-1">{step.instruction}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
