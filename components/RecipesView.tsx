
import React, { useState } from 'react';
import { Recipe, UserPreferences, FoodItem } from '../types';
import { selectMealsFromDatabase } from '../services/fallback/fallbackEngine';
import { RecipeCard } from './RecipeCard';
import { Utensils, Loader2, Sparkles, DollarSign, Clock, Leaf, Filter } from 'lucide-react';

interface RecipesViewProps {
  preferences: UserPreferences;
  inventory: FoodItem[];
}

export const RecipesView: React.FC<RecipesViewProps> = ({ preferences, inventory }) => {
  const [ingredients, setIngredients] = useState('');
  const [budget, setBudget] = useState(preferences.budget);
  const [exactBudgetMode, setExactBudgetMode] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipeResults, setRecipeResults] = useState<Recipe[]>([]);
  
  const handleFindRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipeResults([]);

    // Simulate search delay for UX
    setTimeout(() => {
        try {
            // Use the offline engine directly for filtered search
            // If exactBudgetMode is true, we strictly find meals <= budget
            // Otherwise, we use standard logic
            
            const results = selectMealsFromDatabase(
                budget,
                undefined, // mealType
                undefined, // diet
                preferences.region,
                preferences.mood,
                true // strict budget
            );

            // Filter by ingredients if provided (simple text match)
            let filtered = results;
            if (ingredients.trim()) {
                const terms = ingredients.toLowerCase().split(',').map(s => s.trim());
                filtered = results.filter(r => 
                    terms.some(term => r.title.toLowerCase().includes(term) || r.ingredients.some(i => i.toLowerCase().includes(term)))
                );
            }

            // If "Exact Budget" mode, sort by price ascending (cheapest first) to maximize value
            if (exactBudgetMode) {
                filtered.sort((a, b) => a.estimated_cost_ksh - b.estimated_cost_ksh);
            } else {
                // Otherwise random shuffle
                filtered.sort(() => 0.5 - Math.random());
            }

            setRecipeResults(filtered.slice(0, 10)); // Top 10 matches
        } catch (err) {
            console.error(err);
            setError("Failed to find recipes.");
        } finally {
            setLoading(false);
        }
    }, 800);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                <Utensils size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Recipe Finder</h2>
            </div>
            
            <button 
                onClick={() => setExactBudgetMode(!exactBudgetMode)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${exactBudgetMode ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
            >
                {exactBudgetMode ? 'Exact Budget Mode ON' : 'Exact Budget Mode OFF'}
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5"><Leaf size={12}/> Ingredients (Optional)</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. rice, tomatoes..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5"><DollarSign size={12}/> {exactBudgetMode ? 'I Only Have (KES)' : 'Max Budget'}</label>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(parseInt(e.target.value, 10))} 
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 outline-none text-slate-800 transition-all font-mono ${exactBudgetMode ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'}`}
            />
          </div>

          <div>
            <div className="h-full flex items-end">
                <button
                    onClick={handleFindRecipes}
                    disabled={loading}
                    className="group relative w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl overflow-hidden transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                    <div className="flex items-center justify-center gap-2 relative z-10">
                        {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                        ) : (
                        <><Filter size={20} /> <span>Find Matches</span></>
                        )}
                    </div>
                </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
      )}
      
      {recipeResults.length > 0 ? (
          <div className="space-y-6">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">Found {recipeResults.length} matches</p>
              {recipeResults.map(r => (
                  <RecipeCard key={r.id} recipe={r} />
              ))}
          </div>
      ) : (
          !loading && <div className="text-center py-10 text-slate-400">
              <Sparkles className="mx-auto mb-2 opacity-50" />
              <p>Adjust filters to find delicious meals.</p>
          </div>
      )}
    </div>
  );
};
