
import React, { useState } from 'react';
import { Recipe, UserPreferences, FoodItem } from '../types';
import { runAIAction } from '../services/geminiService';
import { RecipeCard } from './RecipeCard';
import { Utensils, Loader2, Sparkles, DollarSign, Clock, Leaf } from 'lucide-react';

interface RecipesViewProps {
  preferences: UserPreferences;
  inventory: FoodItem[];
}

export const RecipesView: React.FC<RecipesViewProps> = ({ preferences, inventory }) => {
  const [ingredients, setIngredients] = useState('');
  const [budget, setBudget] = useState(250);
  const [time, setTime] = useState(30);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipeResult, setRecipeResult] = useState<Recipe | null>(null);
  
  const handleGenerateRecipe = async () => {
    setLoading(true);
    setError(null);
    setRecipeResult(null);

    try {
      const res = await runAIAction('generate_recipe', {
        preferences,
        inventory,
        context: {
          ingredients,
          budget,
          time,
        }
      });
      setRecipeResult(res);
    } catch (err) {
      console.error(err);
      setError("Failed to generate a recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
            <Utensils size={20} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Recipe Generator</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5"><Leaf size={12}/> Ingredients You Have</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. rice, tomatoes, one onion, sukuma..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5"><DollarSign size={12}/> Max Budget (KES)</label>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(parseInt(e.target.value, 10))} 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-800 transition-all font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5"><Clock size={12}/> Max Cook Time</label>
            <select 
              value={time} 
              onChange={(e) => setTime(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>1 Hour</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleGenerateRecipe}
          disabled={loading}
          className="group relative w-full bg-blue-600 text-white font-bold py-4 rounded-xl overflow-hidden transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <><Sparkles size={20} /> <span>Generate Recipe</span></>
            )}
          </div>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
      )}

      {recipeResult && <RecipeCard recipe={recipeResult} />}
    </div>
  );
};
