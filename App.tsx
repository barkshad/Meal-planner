
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
  Recipe,
  RegionType,
  MoodType
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
import { SpinWheel } from './components/SpinWheel';
import { CoupleMode } from './components/CoupleMode';
import { LoadingScreen } from './components/LoadingScreen';
import { RestaurantsView } from './components/RestaurantsView'; // Import New View
import { runAIAction } from './services/geminiService';
import { OFFLINE_RECIPES } from './services/fallback/offlineRecipes';
import { selectMealsFromDatabase } from './services/fallback/fallbackEngine';
import { ChefHat, Loader2, Home, Calendar, ShoppingCart, Archive, Wallet, LogOut, BarChart3, Sparkles, Utensils, Dices, Trophy, Heart, MapPin, Smile, Map } from 'lucide-react';

type ViewMode = 'meal' | 'week' | 'shop' | 'pantry' | 'analytics' | 'recipes' | 'challenges' | 'restaurants';

const LS_KEYS = {
  USER: 'mealmind_user',
  PREFS: 'mealmind_preferences',
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
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showCoupleMode, setShowCoupleMode] = useState(false);
  const [spinCandidates, setSpinCandidates] = useState<Recipe[]>([]);

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
      // Pass the new enhanced preferences (mood, region)
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

  const handleSpinWheel = () => {
    // Get valid candidates based on current filters
    const candidates = selectMealsFromDatabase(
      preferences.budget, 
      selectedMealType === MealType.AUTO ? undefined : selectedMealType, 
      preferences.dietType, 
      preferences.region,
      preferences.mood,
      false // Relaxed budget for wheel fun
    );
    
    if (candidates.length < 2) {
      alert("Not enough meals match your current filters to spin. Try relaxing your filters!");
      return;
    }
    
    setSpinCandidates(candidates);
    setShowSpinWheel(true);
  };

  const handleWheelResult = (recipe: Recipe) => {
    setShowSpinWheel(false);
    setMealResult({
      meal_type: recipe.category,
      suggestions: [{
        food: recipe.title,
        estimated_cost: recipe.estimated_cost_ksh,
        reason: "The Wheel of Destiny chose this!"
      }],
      total_meal_cost: recipe.estimated_cost_ksh,
      within_budget: recipe.estimated_cost_ksh <= preferences.budget,
      auto_adjusted: false,
      message: "Destiny has spoken!"
    });
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
    if (user && currentView !== 'meal' && currentView !== 'recipes' && currentView !== 'restaurants') {
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
    <div className="min-h-screen relative text-slate-800 selection:bg-emerald-100 font-sans bg-slate-50 pb-24">
      
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      
      {showSpinWheel && <SpinWheel candidates={spinCandidates} onResult={handleWheelResult} onClose={() => setShowSpinWheel(false)} />}
      
      {showCoupleMode && <CoupleMode onClose={() => setShowCoupleMode(false)} />}

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
                 <button onClick={() => setShowCoupleMode(true)} className="text-pink-400 hover:text-pink-600 transition-colors">
                     <Heart size={20} />
                 </button>
                 <button onClick={() => setUser(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                     <LogOut size={20} />
                 </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 pt-20">
        {loading ? (
            <LoadingScreen mood={preferences.mood} />
        ) : (
          <>
            {currentView === 'meal' && (
               <div className="space-y-6 animate-slide-up">
                  {!mealResult ? (
                      <div className="space-y-6">
                        {/* Filters Card */}
                        <div className="glass-panel p-5 space-y-4">
                           <div className="flex justify-between items-center">
                             <h3 className="font-bold text-slate-700 flex items-center gap-2"><Smile size={18}/> Mood</h3>
                             <select 
                               value={preferences.mood || 'Neutral'}
                               onChange={(e) => setPreferences({...preferences, mood: e.target.value as MoodType})}
                               className="bg-slate-100 border-none rounded-lg text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
                             >
                               <option value="Neutral">Normal</option>
                               <option value="Stressed">Stressed</option>
                               <option value="Happy">Happy</option>
                               <option value="Tired">Tired</option>
                               <option value="Broke">Broke</option>
                               <option value="Healthy">Healthy</option>
                             </select>
                           </div>
                           
                           <div className="flex justify-between items-center">
                             <h3 className="font-bold text-slate-700 flex items-center gap-2"><MapPin size={18}/> Region</h3>
                             <select 
                               value={preferences.region || 'All'}
                               onChange={(e) => setPreferences({...preferences, region: e.target.value as RegionType})}
                               className="bg-slate-100 border-none rounded-lg text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
                             >
                               <option value="All">All Kenya</option>
                               <option value="Coastal">Coastal</option>
                               <option value="Western">Western</option>
                               <option value="Central">Central</option>
                               <option value="Nairobi">Nairobi</option>
                             </select>
                           </div>

                           <div className="h-px bg-slate-100 w-full my-2"></div>

                           <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                              {Object.values(MealType).map((type) => (
                                  <button
                                      key={type}
                                      onClick={() => setSelectedMealType(type)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedMealType === type ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600'}`}
                                  >
                                      {type}
                                  </button>
                              ))}
                           </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-5 gap-3">
                          <button 
                            onClick={handleSuggestMeal}
                            className="col-span-4 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                          >
                              <Sparkles size={20} /> Get Meal Suggestions
                          </button>
                          
                          <button 
                            onClick={handleSpinWheel}
                            className="col-span-1 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-purple-200 flex items-center justify-center hover:-translate-y-1 transition-all"
                          >
                             <Dices size={24} />
                          </button>
                        </div>
                        
                        {/* Weekly Challenge Teaser */}
                        <div className="glass-panel p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('challenges')}>
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-full shadow-sm text-orange-500">
                                <Trophy size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">Weekly Challenge</h4>
                                <p className="text-xs text-slate-500">The 200 Bob Survivor</p>
                              </div>
                           </div>
                           <div className="text-xs font-bold bg-white px-2 py-1 rounded text-orange-600 shadow-sm">Join</div>
                        </div>

                      </div>
                  ) : (
                      <ResultCard data={mealResult} onReset={handleReset} />
                  )}
              </div>
            )}
            
            {currentView === 'restaurants' && (
              <RestaurantsView />
            )}

            {currentView === 'challenges' && (
               <div className="space-y-4 animate-slide-up">
                 <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Trophy className="text-orange-500"/> Challenges</h2>
                 {[1,2,3].map(i => (
                   <div key={i} className="glass-panel p-5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-10 bg-orange-100 rounded-full -mr-5 -mt-5 opacity-50 group-hover:scale-110 transition-transform"></div>
                     <h3 className="font-bold text-lg relative z-10">The 200 Bob Survivor</h3>
                     <p className="text-sm text-slate-500 mb-3 relative z-10">Eat for under KES 200/day for 3 days.</p>
                     <div className="w-full bg-slate-100 h-2 rounded-full mb-3">
                        <div className="bg-orange-500 h-2 rounded-full w-1/3"></div>
                     </div>
                     <div className="flex justify-between items-center relative z-10">
                       <span className="text-xs font-bold text-slate-400">Day 1 of 3</span>
                       <button className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-orange-200">Log Meal</button>
                     </div>
                   </div>
                 ))}
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
        <div className="max-w-xl mx-auto glass-panel p-2 grid grid-cols-7 justify-between items-center shadow-2xl shadow-slate-300">
          <NavButton 
            active={currentView === 'meal'} 
            onClick={() => setCurrentView('meal')} 
            icon={<Home size={20} />} 
            label="Today" 
            color="emerald"
          />
          <NavButton 
            active={currentView === 'week'} 
            onClick={() => setCurrentView('week')} 
            icon={<Calendar size={20} />} 
            label="Week" 
            color="indigo"
          />
           <NavButton 
            active={currentView === 'recipes'} 
            onClick={() => setCurrentView('recipes')} 
            icon={<Utensils size={20} />} 
            label="Recipes" 
            color="blue"
          />
          <NavButton 
            active={currentView === 'restaurants'} 
            onClick={() => setCurrentView('restaurants')} 
            icon={<Map size={20} />} 
            label="Maps" 
            color="red"
          />
          <NavButton 
            active={currentView === 'shop'} 
            onClick={() => setCurrentView('shop')} 
            icon={<ShoppingCart size={20} />} 
            label="Shop" 
            color="orange"
          />
          <NavButton 
            active={currentView === 'pantry'} 
            onClick={() => setCurrentView('pantry')} 
            icon={<Archive size={20} />} 
            label="Soko" 
            color="purple"
          />
          <NavButton 
            active={currentView === 'analytics'} 
            onClick={() => setCurrentView('analytics')} 
            icon={<BarChart3 size={20} />} 
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
    red: 'text-red-600 bg-red-50',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-all duration-300 relative overflow-hidden btn-hover-effect ${
        active 
          ? activeClasses[color as keyof typeof activeClasses]
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-0 scale-0 hidden sm:block'} transition-all`}>
        {label}
      </span>
    </button>
  )
}

export default App;
