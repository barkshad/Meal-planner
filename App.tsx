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
import { ChefHat, Loader2, Home, Calendar, ShoppingCart, Archive, Wallet, Coffee, Settings, LogOut, BarChart3, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen relative text-slate-800 selection:bg-emerald-100 font-sans bg-slate-50">
      
      {/* Onboarding Overlay */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <div className="relative">
              <div className="bg-emerald-50 p-1.5 rounded-lg relative border border-emerald-100">
                <ChefHat size={20} className="text-emerald-600" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Meal<span className="text-emerald-600">Mind</span></h1>
              <span className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase ml-0.5">Kenya</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-700">{user.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-[10px] text-emerald-600">Online</p>
                </div>
             </div>
             <button 
               onClick={handleLogout} 
               className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
             >
                <LogOut size={18} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 pt-20 pb-32">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative mb-4">
              <Loader2 size={48} className="text-emerald-600 animate-spin relative z-10" />
            </div>
            <p className="text-lg font-medium text-slate-600 animate-pulse">
              Consulting AI Market Expert...
            </p>
          </div>
        ) : (
          <>
            {currentView === 'meal' && (
              mealResult ? (
                <ResultCard data={mealResult} onReset={() => setMealResult(null)} />
              ) : (
                <div className="space-y-6 animate-slide-up">
                  {/* Preferences Panel */}
                  <section className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                        <Settings size={20} className="text-emerald-600" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Daily Preferences</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                       <div className="group">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Daily Budget (KES)</label>
                          <input 
                            type="number" 
                            value={preferences.budget} 
                            onChange={(e) => handlePreferenceChange('budget', e.target.value)} 
                            className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 transition-all font-mono shadow-sm"
                          />
                       </div>
                       
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Meals / Day</label>
                          <div className="relative">
                            <select 
                              value={preferences.mealsPerDay} 
                              onChange={(e) => handlePreferenceChange('mealsPerDay', e.target.value)} 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                            >
                              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Meals</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <span className="text-xs">▼</span>
                            </div>
                          </div>
                       </div>
                       
                       <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Diet Style</label>
                          <div className="relative">
                            <select 
                              value={preferences.dietType} 
                              onChange={(e) => handlePreferenceChange('dietType', e.target.value)} 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                            >
                              {DIET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <span className="text-xs">▼</span>
                            </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Meal Type</label>
                       <div className="flex flex-wrap gap-2">
                          {Object.values(MealType).map((type) => (
                            <button
                              key={type}
                              onClick={() => setSelectedMealType(type)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                selectedMealType === type 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' 
                                : 'bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200 hover:text-slate-800'
                              }`}
                            >
                              {type === MealType.AUTO ? 'Auto' : type}
                            </button>
                          ))}
                       </div>
                    </div>

                    <button 
                      onClick={handleSuggestMeal} 
                      className="group relative w-full bg-emerald-600 text-white font-bold py-4 rounded-xl overflow-hidden transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                       <div className="flex items-center justify-center gap-2 relative z-10">
                         <Sparkles size={20} /> 
                         <span>Generate Smart Meal</span>
                       </div>
                    </button>
                  </section>
                </div>
              )
            )}

            {currentView === 'week' && (
              <div className="space-y-6 animate-slide-up">
                {!weeklyPlan && (
                  <div className="glass-panel border-2 border-dashed border-indigo-200 p-8 text-center bg-indigo-50/50">
                    <div className="inline-flex p-4 rounded-full bg-indigo-100 mb-4 animate-float">
                      <Calendar size={48} className="text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Weekly Planner</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Generate a complete 7-day budget meal plan using AI market intelligence.</p>
                    
                    <div className="max-w-xs mx-auto mb-6">
                      <label className="block text-xs font-bold text-indigo-600 uppercase text-left mb-2 pl-1">Weekly Budget (KES)</label>
                      <input 
                        type="number" 
                        value={preferences.weeklyBudget} 
                        onChange={(e) => handlePreferenceChange('weeklyBudget', e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-indigo-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-center text-lg shadow-sm" 
                      />
                    </div>
                    <button 
                      onClick={handleWeeklyPlan} 
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                      Generate Week Plan
                    </button>
                  </div>
                )}
                {weeklyPlan && <WeeklyPlanView data={weeklyPlan} />}
                {weeklyPlan && (
                  <button onClick={handleWeeklyPlan} className="w-full py-4 text-indigo-600 font-medium hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                    Regenerate Plan
                  </button>
                )}
              </div>
            )}

            {currentView === 'shop' && (
              <div className="space-y-6 animate-slide-up">
                 {!shoppingList && (
                   <div className="glass-panel border-2 border-dashed border-orange-200 p-8 text-center bg-orange-50/50">
                     <div className="inline-flex p-4 rounded-full bg-orange-100 mb-4 animate-float">
                       <ShoppingCart size={48} className="text-orange-600" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-800 mb-2">Smart Shopping List</h3>
                     <p className="text-slate-500 mb-8">Auto-generate what you need to buy based on your plan and what you already have.</p>
                     <button 
                       onClick={handleShoppingList} 
                       disabled={!weeklyPlan} 
                       className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-200"
                     >
                       {weeklyPlan ? "Create List" : "Generate Plan First"}
                     </button>
                   </div>
                 )}
                 {shoppingList && <ShoppingListView data={shoppingList} />}
              </div>
            )}

            {currentView === 'pantry' && (
              <div className="space-y-6 animate-slide-up">
                <FoodManager items={inventory} setItems={setInventory} />
                <div className="flex justify-end">
                   <button 
                     onClick={handleAnalyzeInventory} 
                     className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
                   >
                     <Sparkles size={18} /> AI Inventory Analysis
                   </button>
                </div>
                {inventoryAnalysis && <InventoryAnalysisView data={inventoryAnalysis} />}
              </div>
            )}
            
            {currentView === 'analytics' && (
              <div className="space-y-6 animate-slide-up">
                 {!analyticsData && (
                    <div className="glass-panel border-2 border-dashed border-blue-200 p-8 text-center bg-blue-50/50">
                       <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4 animate-float">
                         <BarChart3 size={48} className="text-blue-600" />
                       </div>
                       <h3 className="text-2xl font-bold text-slate-800 mb-2">Financial Insights</h3>
                       <p className="text-slate-500 mb-8">Visualize your spending trends and get market price alerts.</p>
                       <button 
                         onClick={handleAnalytics} 
                         className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                       >
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
      <nav className="fixed bottom-6 left-4 right-4 z-50">
        <div className="max-w-xl mx-auto glass-panel p-2 flex justify-between items-center shadow-2xl shadow-slate-300">
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
      className={`flex flex-col items-center gap-1 p-3 rounded-xl w-full transition-all duration-300 relative overflow-hidden ${
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