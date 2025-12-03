
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
  AnalyticsData
} from './types';
import { INITIAL_FOODS, DIET_TYPES, DEFAULT_PREFERENCES } from './constants';
import { FoodManager } from './components/FoodManager';
import { ResultCard } from './components/ResultCard';
import { WeeklyPlanView, ShoppingListView, InventoryAnalysisView } from './components/AgentViews';
import { SplashScreen } from './components/SplashScreen';
import { AuthView } from './components/AuthView';
import { AnalyticsView } from './components/AnalyticsView';
import { Onboarding } from './components/Onboarding';
import { runAIAction } from './services/geminiService';
import { ChefHat, Loader2, Home, Calendar, ShoppingCart, Archive, Wallet, Coffee, Settings, LogOut, BarChart3 } from 'lucide-react';

type ViewMode = 'meal' | 'week' | 'shop' | 'pantry' | 'analytics';

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

  // --- Initialization ---
  useEffect(() => {
    const savedUser = localStorage.getItem('mealmind_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      checkOnboardingStatus(parsedUser.email);
    }
  }, []);

  const checkOnboardingStatus = (email: string) => {
    const hasOnboarded = localStorage.getItem(`mealmind_onboarded_${email}`);
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  };

  // --- Handlers ---

  const handleLogin = (userProfile: UserProfile) => {
    setUser(userProfile);
    setPreferences(userProfile.preferences);
    checkOnboardingStatus(userProfile.email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mealmind_user');
  };

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`mealmind_onboarded_${user.email}`, 'true');
    }
    setShowOnboarding(false);
  };

  const handlePreferenceChange = (field: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: field === 'dietType' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSuggestMeal = async () => {
    setLoading(true);
    setError(null);
    setMealResult(null);
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const res = await runAIAction('suggest_meal', {
        preferences,
        inventory,
        context: { currentTime: timeString, mealType: selectedMealType }
      });
      setMealResult(res);
    } catch (err) {
      console.error(err);
      setError("Failed to suggest a meal. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleWeeklyPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await runAIAction('weekly_plan', {
        preferences,
        inventory,
      });
      setWeeklyPlan(res);
    } catch (err) {
      console.error(err);
      setError("Failed to generate weekly plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleShoppingList = async () => {
    if (!weeklyPlan) {
      setError("Please generate a Weekly Plan first!");
      setCurrentView('week');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await runAIAction('shopping_list', {
        preferences,
        inventory,
        context: { weeklyPlan: weeklyPlan.weekly_plan }
      });
      setShoppingList(res);
    } catch (err) {
      console.error(err);
      setError("Failed to create shopping list.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await runAIAction('analyze_inventory', {
        preferences,
        inventory,
      });
      setInventoryAnalysis(res);
    } catch (err) {
      console.error(err);
      setError("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass inventory and preferences to generate dummy analytics
      const res = await runAIAction('get_analytics', {
        preferences,
        inventory,
      });
      setAnalyticsData(res);
    } catch (err) {
      console.error(err);
      setError("Could not load analytics.");
    } finally {
      setLoading(false);
    }
  }

  // --- Render logic ---

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter relative">
      {/* Onboarding Overlay */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="bg-emerald-100 p-1.5 rounded-lg">
              <ChefHat size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">MealMind</h1>
              <span className="text-[10px] text-emerald-600 font-bold tracking-wider">KENYA</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-700">{user.name}</p>
                <p className="text-[10px] text-slate-400">Basic Plan</p>
             </div>
             <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 pb-28">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
            <p className="text-lg font-medium text-slate-700">Analyzing Market Prices...</p>
          </div>
        ) : (
          <>
            {currentView === 'meal' && (
              mealResult ? (
                <ResultCard data={mealResult} onReset={() => setMealResult(null)} />
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {/* Preferences */}
                  <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                      <Settings size={20} className="text-emerald-500" />
                      <h2 className="text-xl font-semibold">Preferences</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Daily Budget (KES)</label>
                          <input type="number" value={preferences.budget} onChange={(e) => handlePreferenceChange('budget', e.target.value)} className="w-full mt-1 px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Meals / Day</label>
                          <select value={preferences.mealsPerDay} onChange={(e) => handlePreferenceChange('mealsPerDay', e.target.value)} className="w-full mt-1 px-4 py-2 bg-slate-50 border rounded-lg outline-none">
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                       </div>
                       <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Diet Type</label>
                          <select value={preferences.dietType} onChange={(e) => handlePreferenceChange('dietType', e.target.value)} className="w-full mt-1 px-4 py-2 bg-slate-50 border rounded-lg outline-none">
                            {DIET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Meal Type</label>
                       <div className="flex flex-wrap gap-2">
                          {Object.values(MealType).map((type) => (
                            <button
                              key={type}
                              onClick={() => setSelectedMealType(type)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedMealType === type ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                            >
                              {type === MealType.AUTO ? 'Auto' : type}
                            </button>
                          ))}
                       </div>
                    </div>

                    <button onClick={handleSuggestMeal} className="w-full mt-6 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                       <Coffee size={20} /> Suggest Meal
                    </button>
                  </section>
                </div>
              )
            )}

            {currentView === 'week' && (
              <div className="space-y-6">
                {!weeklyPlan && (
                  <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl text-center">
                    <Calendar size={48} className="mx-auto text-indigo-400 mb-4" />
                    <h3 className="text-lg font-bold text-indigo-900">Plan your week</h3>
                    <p className="text-indigo-700 mb-6 text-sm">Generate a 7-day meal plan based on your weekly budget of KES {preferences.weeklyBudget}.</p>
                    <div className="max-w-xs mx-auto mb-4">
                      <label className="block text-xs font-bold text-indigo-400 uppercase text-left mb-1">Weekly Budget (KES)</label>
                      <input type="number" value={preferences.weeklyBudget} onChange={(e) => handlePreferenceChange('weeklyBudget', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <button onClick={handleWeeklyPlan} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Generate Plan</button>
                  </div>
                )}
                {weeklyPlan && <WeeklyPlanView data={weeklyPlan} />}
                {weeklyPlan && (
                  <button onClick={handleWeeklyPlan} className="w-full py-3 text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors">
                    Regenerate Plan
                  </button>
                )}
              </div>
            )}

            {currentView === 'shop' && (
              <div className="space-y-6">
                 {!shoppingList && (
                   <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl text-center">
                     <ShoppingCart size={48} className="mx-auto text-orange-400 mb-4" />
                     <h3 className="text-lg font-bold text-orange-900">Shopping List</h3>
                     <p className="text-orange-700 mb-6 text-sm">Create a smart shopping list based on your weekly plan and current inventory.</p>
                     <button onClick={handleShoppingList} disabled={!weeklyPlan} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                       {weeklyPlan ? "Create List" : "Generate Weekly Plan First"}
                     </button>
                   </div>
                 )}
                 {shoppingList && <ShoppingListView data={shoppingList} />}
              </div>
            )}

            {currentView === 'pantry' && (
              <div className="space-y-6">
                <FoodManager items={inventory} setItems={setInventory} />
                <div className="flex justify-end">
                   <button onClick={handleAnalyzeInventory} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                     <Settings size={16} /> Analyze Inventory
                   </button>
                </div>
                {inventoryAnalysis && <InventoryAnalysisView data={inventoryAnalysis} />}
              </div>
            )}
            
            {currentView === 'analytics' && (
              <div className="space-y-6">
                 {!analyticsData && (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center">
                       <BarChart3 size={48} className="mx-auto text-emerald-400 mb-4" />
                       <h3 className="text-lg font-bold text-emerald-900">Your Insights</h3>
                       <p className="text-emerald-700 mb-6 text-sm">Analyze your spending habits and get market price alerts.</p>
                       <button onClick={handleAnalytics} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                         Load Analytics
                       </button>
                    </div>
                 )}
                 {analyticsData && <AnalyticsView data={analyticsData} />}
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-30 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl mx-auto flex justify-around p-2">
          <button 
            onClick={() => setCurrentView('meal')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-colors ${currentView === 'meal' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Home size={20} />
            <span className="text-[10px] font-bold uppercase">Today</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('week')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-colors ${currentView === 'week' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Calendar size={20} />
            <span className="text-[10px] font-bold uppercase">Week</span>
          </button>

          <button 
            onClick={() => setCurrentView('shop')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-colors ${currentView === 'shop' ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <ShoppingCart size={20} />
            <span className="text-[10px] font-bold uppercase">Shop</span>
          </button>

          <button 
            onClick={() => setCurrentView('pantry')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-colors ${currentView === 'pantry' ? 'text-purple-600 bg-purple-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Archive size={20} />
            <span className="text-[10px] font-bold uppercase">Soko</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('analytics')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-colors ${currentView === 'analytics' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <BarChart3 size={20} />
            <span className="text-[10px] font-bold uppercase">Trends</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
