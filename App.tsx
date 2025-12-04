import React, { useState, useEffect } from 'react';
import { 
  FoodItem, 
  MealResponse, 
  MealType, 
  UserPreferences, 
  WeeklyPlanResponse, 
  ShoppingListResponse, 
  InventoryAnalysisResponse,
  UserProfile,
  AnalyticsData,
  Recipe 
} from './types';
import { INITIAL_FOODS, DEFAULT_PREFERENCES } from './constants';
import { FoodManager } from './components/FoodManager';
import { ResultCard } from './components/ResultCard';
import { WeeklyPlanView, ShoppingListView, InventoryAnalysisView } from './components/AgentViews';
import { SplashScreen } from './components/SplashScreen';
import { AuthView } from './components/AuthView';
import { AnalyticsView } from './components/AnalyticsView';
import { Onboarding } from './components/Onboarding';
import { EditBudgetModal } from './components/EditBudgetModal';
import { RecipesView } from './components/RecipesView'; 
import { runAIAction } from './services/geminiService';
import { ChefHat, Loader2, Home, Calendar, ShoppingCart, Archive, Wallet, LogOut, BarChart3, Sparkles, Utensils } from 'lucide-react';

type ViewMode = 'meal' | 'week' | 'shop' | 'pantry' | 'analytics' | 'recipes';

const LS_KEYS = {
  USER: 'mealmind_user',
  PREFS: 'mealmind_preferences',
  AI_RESULTS: 'mealmind_ai_results',
  FALLBACK_RESULTS: 'mealmind_fallback_results',
  BUDGET: 'mealmind_user_budget',
  VIEW: 'mealmind_last_active_view'
};

const App: React.FC = () => {
  // --- App State ---
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // --- Main Logic State ---
  const [currentView, setCurrentView] = useState<ViewMode>('meal');
  const [inventory, setInventory] = useState<FoodItem[]>(INITIAL_FOODS);
  
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [selectedMealType, setSelectedMealType] = useState<string>(MealType.AUTO);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Data States ---
  const [mealResult, setMealResult] = useState<MealResponse | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanResponse | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListResponse | null>(null);
  const [inventoryAnalysis, setInventoryAnalysis] = useState<InventoryAnalysisResponse | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // --- UI States ---
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // --- Initialization & Local Storage ---
  
  useEffect(() => {
    const storedUser = localStorage.getItem(LS_KEYS.USER);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.preferences) {
          setPreferences(parsedUser.preferences);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  // --- Handlers ---
  
  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    localStorage.setItem(LS_KEYS.USER, JSON.stringify(loggedInUser));
    const hasOnboarded = localStorage.getItem('mealmind_has_onboarded');
    if (!hasOnboarded) {
      setShowOnboarding(true);
      localStorage.setItem('mealmind_has_onboarded', 'true');
    }
  };
  
  const handleSuggestMeal = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await runAIAction('suggest_meal', { 
        preferences, 
        inventory,
        context: { mealType: selectedMealType } 
      });
      setMealResult(result);
    } catch (e) {
      console.error(e);
      setError('Failed to suggest meal');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setMealResult(null);
  };

  const handleFetchData = async (view: ViewMode) => {
    if (view === 'week' && !weeklyPlan) {
      setLoading(true);
      try {
        const res = await runAIAction('weekly_plan', { preferences, inventory });
        setWeeklyPlan(res);
      } catch (e) { setError('Failed to load plan'); } finally { setLoading(false); }
    } else if (view === 'shop' && !shoppingList) {
      setLoading(true);
      try {
        const res = await runAIAction('shopping_list', { preferences, inventory });
        setShoppingList(res);
      } catch (e) { setError('Failed to load list'); } finally { setLoading(false); }
    } else if (view === 'pantry' && !inventoryAnalysis) {
      setLoading(true);
      try {
         const res = await runAIAction('analyze_inventory', { preferences, inventory });
         setInventoryAnalysis(res);
      } catch (e) { setError('Failed to analyze'); } finally { setLoading(false); }
    } else if (view === 'analytics' && !analyticsData) {
      setLoading(true);
      try {
        const res = await runAIAction('get_analytics', { preferences, inventory });
        setAnalyticsData(res);
      } catch (e) { setError('Failed to load stats'); } finally { setLoading(false); }
    }
  };

  useEffect(() => {
    if (user && currentView !== 'meal' && currentView !== 'recipes') {
      handleFetchData(currentView);
    }
  }, [currentView, user]);

  // --- Render logic ---

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen relative text-slate-800 selection:bg-emerald-100 font-sans bg-slate-50">
      
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

      {isBudgetModalOpen && (
          <EditBudgetModal 
            isOpen={isBudgetModalOpen} 
            onClose={() => setIsBudgetModalOpen(false)} 
            currentBudget={preferences.budget}
            onSave={(val) => setPreferences(prev => ({ ...prev, budget: val }))}
          />
      )}
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ChefHat className="text-emerald-600" size={24} />
                <h1 className="font-bold text-lg">Meal<span className="text-emerald-600">Mind</span></h1>
            </div>
            <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                    <Wallet size={14} />
                    <span>KES {preferences.budget}</span>
                 </button>
                 <button onClick={() => setUser(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                     <LogOut size={20} />
                 </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 pt-20 pb-32">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <Loader2 size={40} className="text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Consulting AI Chef...</p>
           </div>
        ) : (
          <>
            {currentView === 'meal' && (
               <div className="space-y-6">
                  {!mealResult ? (
                      <div className="glass-panel p-8 text-center space-y-6">
                          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Sparkles size={40} className="text-emerald-500" />
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800">What's cooking?</h2>
                          <p className="text-slate-500 max-w-xs mx-auto">Get a guaranteed meal suggestion from our Verified Database.</p>
                          
                          <div className="flex justify-center gap-2 flex-wrap">
                            {Object.values(MealType).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedMealType(type)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedMealType === type ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}
                                >
                                    {type}
                                </button>
                            ))}
                          </div>

                          <button 
                            onClick={handleSuggestMeal}
                            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                          >
                              <Sparkles size={20} /> Get Meal Suggestions
                          </button>
                      </div>
                  ) : (
                      <ResultCard data={mealResult} onReset={handleReset} />
                  )}
              </div>
            )}

            {currentView === 'week' && weeklyPlan && (
               <WeeklyPlanView data={weeklyPlan} />
            )}

            {currentView === 'shop' && shoppingList && (
               <ShoppingListView data={shoppingList} />
            )}

            {currentView === 'pantry' && (
                <div className="space-y-6">
                    <FoodManager items={inventory} setItems={setInventory} />
                    {inventoryAnalysis && <InventoryAnalysisView data={inventoryAnalysis} />}
                </div>
            )}
            
            {currentView === 'analytics' && analyticsData && (
               <AnalyticsView data={analyticsData} />
            )}

            {currentView === 'recipes' && (
              <RecipesView preferences={preferences} inventory={inventory} />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 z-50">
        <div className="max-w-xl mx-auto glass-panel p-2 grid grid-cols-6 justify-between items-center shadow-2xl shadow-slate-300">
          <NavButton 
            active={currentView === 'meal'} 
            onClick={() => setCurrentView('meal')} 
            icon={<Home size={22} />} 
            label="Today" 
            color="emerald"
          />
          <NavButton 
            active={currentView === 'week'} 
            onClick={() => setCurrentView('week')} 
            icon={<Calendar size={22} />} 
            label="Week" 
            color="indigo"
          />
           <NavButton 
            active={currentView === 'recipes'} 
            onClick={() => setCurrentView('recipes')} 
            icon={<Utensils size={22} />} 
            label="Recipes" 
            color="blue"
          />
          <NavButton 
            active={currentView === 'shop'} 
            onClick={() => setCurrentView('shop')} 
            icon={<ShoppingCart size={22} />} 
            label="Shop" 
            color="orange"
          />
          <NavButton 
            active={currentView === 'pantry'} 
            onClick={() => setCurrentView('pantry')} 
            icon={<Archive size={22} />} 
            label="Soko" 
            color="purple"
          />
          <NavButton 
            active={currentView === 'analytics'} 
            onClick={() => setCurrentView('analytics')} 
            icon={<BarChart3 size={22} />} 
            label="Stats" 
            color="blue"
          />
        </div>
      </nav>
    </div>
  );
};

// Helper Component for Nav Items
const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string}> = ({ active, onClick, icon, label, color }) => {
  const activeClasses = {
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    orange: 'text-orange-600 bg-orange-50',
    purple: 'text-purple-600 bg-purple-50',
    blue: 'text-blue-600 bg-blue-50',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl w-full transition-all duration-300 relative overflow-hidden btn-hover-effect ${
        active 
          ? activeClasses[color as keyof typeof activeClasses]
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-0 scale-0 hidden sm:block'} transition-all`}>
        {label}
      </span>
    </button>
  )
}

export default App;
