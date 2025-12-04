import React, { useState, useEffect } from 'react';
import { ChefHat, Utensils, Zap, Leaf, Flame, TrendingUp, Sparkles, ShoppingBag } from 'lucide-react';
import { MoodType } from '../types';

interface LoadingScreenProps {
  mood?: MoodType;
  message?: string;
}

const FACTS = [
  "Did you know? Omena is one of the best sources of Calcium.",
  "Tip: Soaking beans overnight saves 50% cooking gas.",
  "Market Alert: Tomato prices drop on Tuesdays in most Nairobi markets.",
  "Health: Sukuma Wiki has more Vitamin C than oranges.",
  "Tip: Add a pinch of salt to onions to fry them faster.",
  "Fact: 'Githeri' was traditionally a meal for warriors.",
  "Budget: Buy dry foods in bulk (wholesale) to save up to 30%.",
  "Tip: Use avocado instead of blueband for a healthier breakfast."
];

const MARKET_TICKER = [
  { item: "Tomatoes", price: "KES 10", trend: "down" },
  { item: "Onions", price: "KES 15", trend: "up" },
  { item: "Unga (2kg)", price: "KES 210", trend: "stable" },
  { item: "Eggs (Tray)", price: "KES 450", trend: "up" },
  { item: "Sukuma", price: "KES 50", trend: "stable" },
  { item: "Potatoes", price: "KES 120", trend: "down" }
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ mood = 'Neutral', message = 'Consulting AI Chef...' }) => {
  const [progress, setProgress] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isStirring, setIsStirring] = useState(false);

  // Mood-based colors
  const getMoodColors = () => {
    switch (mood) {
      case 'Stressed': return 'from-indigo-900 via-purple-900 to-slate-900';
      case 'Happy': return 'from-orange-500 via-amber-500 to-yellow-600';
      case 'Tired': return 'from-blue-900 via-slate-800 to-gray-900';
      case 'Broke': return 'from-emerald-900 via-teal-900 to-green-950';
      case 'Healthy': return 'from-green-600 via-emerald-700 to-teal-800';
      default: return 'from-slate-900 via-emerald-950 to-slate-900'; // Neutral
    }
  };

  // Progress Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(old => {
        if (old >= 100) return 100;
        const diff = Math.random() * 10;
        return Math.min(100, old + diff);
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Fact Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex(i => (i + 1) % FACTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Ticker Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(i => (i + 1) % MARKET_TICKER.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleStir = () => {
    setIsStirring(true);
    setProgress(p => Math.min(100, p + 5)); // Speed up loading
    setTimeout(() => setIsStirring(false), 800);
  };

  const tickerItem = MARKET_TICKER[tickerIndex];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${getMoodColors()} transition-colors duration-1000 overflow-hidden`}>
      
      {/* --- PARTICLES BACKGROUND --- */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className={`absolute opacity-20 animate-float`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}
        >
          {i % 4 === 0 ? <Leaf size={24} className="text-white" /> : 
           i % 4 === 1 ? <Utensils size={32} className="text-white" /> :
           i % 4 === 2 ? <Sparkles size={20} className="text-yellow-200" /> :
           <Flame size={28} className="text-orange-200" />}
        </div>
      ))}

      {/* --- MARKET TICKER (Fake Live Data) --- */}
      <div className="absolute top-8 right-0 left-0 flex justify-center px-4">
        <div className="glass-neon-dark px-6 py-2 rounded-full flex items-center gap-3 animate-fade-in shadow-2xl backdrop-blur-md">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
          <span className="text-[10px] md:text-xs font-mono text-emerald-400 font-bold tracking-widest uppercase">Live Market:</span>
          <div className="flex items-center gap-2 min-w-[140px]">
            <span className="text-white font-bold text-sm">{tickerItem.item}</span>
            <span className="text-emerald-300 text-sm">{tickerItem.price}</span>
            {tickerItem.trend === 'down' ? <TrendingUp className="text-green-500 rotate-180" size={14} /> : 
             tickerItem.trend === 'up' ? <TrendingUp className="text-red-500" size={14} /> : 
             <div className="w-3 h-0.5 bg-slate-400"></div>}
          </div>
        </div>
      </div>

      {/* --- MAIN INTERACTIVE CONTAINER --- */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-8">
        
        {/* Spinning Wheel / Pot */}
        <div 
          className="relative mb-12 cursor-pointer group"
          onClick={handleStir}
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse-glow"></div>

          {/* Outer Ring */}
          <div className="absolute inset-[-10px] rounded-full border-4 border-t-emerald-500 border-r-transparent border-b-emerald-500/50 border-l-transparent w-[calc(100%+20px)] h-[calc(100%+20px)] animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/20 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin-reverse"></div>
          
          {/* Center Interactive Icon */}
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full glass-neon-dark flex items-center justify-center relative shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-transform duration-300 ${isStirring ? 'scale-95' : 'hover:scale-105'}`}>
             <ChefHat size={64} className={`text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-transform duration-700 ${isStirring ? 'animate-bounce' : ''}`} />
             
             {/* Tap Prompt */}
             <div className="absolute -bottom-10 text-[10px] text-white/80 font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
               Tap to Stir
             </div>
          </div>

          {/* Steam Particles */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-3 opacity-60">
             <div className="w-1.5 h-8 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-float-fast" style={{animationDelay: '0s'}}></div>
             <div className="w-1.5 h-12 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-float-fast" style={{animationDelay: '0.5s'}}></div>
             <div className="w-1.5 h-6 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-float-fast" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>

        {/* Text & Progress */}
        <h2 className="text-2xl font-bold text-white mb-4 animate-pulse tracking-tight drop-shadow-md text-center">{message}</h2>
        
        {/* Neon Progress Bar */}
        <div className="w-full h-3 bg-slate-900/60 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 mb-2 relative shadow-inner">
           <div 
             className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 relative overflow-hidden transition-all duration-300 ease-out shadow-[0_0_15px_rgba(16,185,129,0.6)]"
             style={{ width: `${progress}%` }}
           >
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
           </div>
        </div>
        
        <div className="flex justify-between w-full text-[10px] font-bold text-emerald-200/60 uppercase tracking-widest mb-10 px-1">
           <span>Syncing DB</span>
           <span>Finding Deals</span>
           <span>Plating</span>
        </div>

        {/* Rotating Fact Card */}
        <div className="glass-neon-dark p-6 rounded-2xl w-full text-center min-h-[100px] flex items-center justify-center relative overflow-hidden border border-white/10 shadow-xl">
           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-600"></div>
           <p className="text-sm text-slate-100 font-medium leading-relaxed animate-fade-in key={factIndex}">
             "{FACTS[factIndex]}"
           </p>
           <Sparkles size={16} className="absolute top-3 right-3 text-yellow-400 animate-pulse" />
        </div>

      </div>
      
      {/* Blurred Meal Reveal (Background Effect) */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-opacity duration-1000 pointer-events-none mix-blend-overlay"
        style={{ opacity: progress / 800 }} // Slowly reveal very faintly
      ></div>

    </div>
  );
};