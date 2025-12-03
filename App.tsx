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
    <div className="min-h-screen relative text-slate-200 selection:bg-emerald-500/30 font-sans">
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      {/* Onboarding Overlay */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b-0 border-b-white/5 shadow-lg shadow-black/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur rounded-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="bg-slate-900/80 p-1.5 rounded-lg relative border border-emerald-500/30">
                <ChefHat size={20} className="text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">Meal<span className="text-emerald-400 neon-text-emerald">Mind</span></h1>
              <span className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase ml-0.5">Kenya</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-200">{user.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-[10px] text-emerald-500">Online</p>
                </div>
             </div>
             <button 
               onClick={handleLogout} 
               className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
             >
                <LogOut size={18} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 pt-20 pb-32">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 backdrop-blur text-red-200 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30 animate-pulse"></div>
              <Loader2 size={48} className="text-emerald-400 animate-spin relative z-10" />
            </div>
            <p className="text-lg font-medium text-emerald-100/80 animate-pulse">
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
                  <section className="glass-panel rounded-3xl p-6 shadow-2xl shadow-black/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Settings size={20} className="text-emerald-400" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Daily Preferences</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                       <div className="group">
                          <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider mb-2 block">Daily Budget (KES)</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={preferences.budget} 
                              onChange={(e) => handlePreferenceChange('budget', e.target.value)} 
                              className="w-full pl-4 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all font-mono"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                          </div>
                       </div>
                       
                       <div>
                          <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider mb-2 block">Meals / Day</label>
                          <div className="relative">
                            <select 
                              value={preferences.mealsPerDay} 
                              onChange={(e) => handlePreferenceChange('mealsPerDay', e.target.value)} 
                              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer hover:bg-slate-800/50 transition-colors"
                            >
                              {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-slate-900">{n} Meals</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <span className="text-xs">▼</span>
                            </div>
                          </div>
                       </div>
                       
                       <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider mb-2 block">Diet Style</label>
                          <div className="relative">
                            <select 
                              value={preferences.dietType} 
                              onChange={(e) => handlePreferenceChange('dietType', e.target.value)} 
                              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer hover:bg-slate-800/50 transition-colors"
                            >
                              {DIET_TYPES.map(t => <option key={t.value} value={t.value} className="bg-slate-900">{t.label}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <span className="text-xs">▼</span>
                            </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                       <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider block">Meal Type</label>
                       <div className="flex flex-wrap gap-2">
                          {Object.values(MealType).map((type) => (
                            <button
                              key={type}
                              onClick={() => setSelectedMealType(type)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                                selectedMealType === type 
                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                                : 'bg-slate-800/30 text-slate-400 border-transparent hover:bg-slate-800 hover:border-slate-700 hover:text-white'
                              }`}
                            >
                              {type === MealType.AUTO ? 'Auto' : type}
                            </button>
                          ))}
                       </div>
                    </div>

                    <button 
                      onClick={handleSuggestMeal} 
                      className="group relative w-full bg-emerald-500 text-white font-bold py-4 rounded-xl overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                       <div className="flex items-center justify-center gap-2 relative z-10">
                         <Sparkles size={20} className="animate-pulse" /> 
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
                  <div className="glass-panel border-dashed border-2 border-indigo-500/30 p-8 rounded-3xl text-center">
                    <div className="inline-flex p-4 rounded-full bg-indigo-500/10 mb-4 animate-float">
                      <Calendar size={48} className="text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Weekly Planner</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">Generate a complete 7-day budget meal plan using AI market intelligence.</p>
                    
                    <div className="max-w-xs mx-auto mb-6">
                      <label className="block text-xs font-bold text-indigo-400 uppercase text-left mb-2 pl-1">Weekly Budget (KES)</label>
                      <input 
                        type="number" 
                        value={preferences.weeklyBudget} 
                        onChange={(e) => handlePreferenceChange('weeklyBudget', e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-indigo-500/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-center text-lg" 
                      />
                    </div>
                    <button 
                      onClick={handleWeeklyPlan} 
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    >
                      Generate Week Plan
                    </button>
                  </div>
                )}
                {weeklyPlan && <WeeklyPlanView data={weeklyPlan} />}
                {weeklyPlan && (
                  <button onClick={handleWeeklyPlan} className="w-full py-4 text-indigo-400 font-medium hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl transition-all border border-transparent hover:border-indigo-500/20">
                    Regenerate Plan
                  </button>
                )}
              </div>
            )}

            {currentView === 'shop' && (
              <div className="space-y-6 animate-slide-up">
                 {!shoppingList && (
                   <div className="glass-panel border-dashed border-2 border-orange-500/30 p-8 rounded-3xl text-center">
                     <div className="inline-flex p-4 rounded-full bg-orange-500/10 mb-4 animate-float">
                       <ShoppingCart size={48} className="text-orange-400" />
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-2">Smart Shopping List</h3>
                     <p className="text-slate-400 mb-8">Auto-generate what you need to buy based on your plan and what you already have.</p>
                     <button 
                       onClick={handleShoppingList} 
                       disabled={!weeklyPlan} 
                       className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
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
                     className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-500 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2"
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
                    <div className="glass-panel border-dashed border-2 border-blue-500/30 p-8 rounded-3xl text-center">
                       <div className="inline-flex p-4 rounded-full bg-blue-500/10 mb-4 animate-float">
                         <BarChart3 size={48} className="text-blue-400" />
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-2">Financial Insights</h3>
                       <p className="text-slate-400 mb-8">Visualize your spending trends and get market price alerts.</p>
                       <button 
                         onClick={handleAnalytics} 
                         className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
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

      {/* Futuristic Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 z-50">
        <div className="max-w-xl mx-auto glass-panel rounded-2xl p-2 flex justify-between items-center shadow-2xl shadow-black/50 border border-white/10 relative overflow-hidden">
           {/* Glow behind nav */}
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-indigo-500/5 to-purple-500/5 blur-xl pointer-events-none"></div>

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
    emerald: 'text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    indigo: 'text-indigo-400 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
    orange: 'text-orange-400 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)]',
    purple: 'text-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    blue: 'text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl w-full transition-all duration-300 relative overflow-hidden ${
        active 
          ? activeClasses[color as keyof typeof activeClasses]
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
      }`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-0 scale-0 hidden sm:block'} transition-all`}>
        {label}
      </span>
      {active && <div className={`absolute bottom-0 w-8 h-1 rounded-t-full bg-${color}-500 blur-[2px]`}></div>}
    </button>
  )
}

export default App;