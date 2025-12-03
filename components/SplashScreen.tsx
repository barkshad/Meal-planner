import React, { useEffect, useState } from 'react';
import { ChefHat } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="relative mb-8 z-10">
        <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-40 rounded-full animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-2xl border border-white/10 animate-float">
          <ChefHat size={80} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
        </div>
      </div>
      
      <h1 className="text-5xl font-bold text-white tracking-tighter mb-2 z-10">
        Meal<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 neon-text-emerald">Mind</span>
      </h1>
      
      <div className="flex items-center gap-2 mb-8 z-10">
        <span className="text-xs font-bold bg-slate-800/80 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">KENYA EDITION</span>
        <span className="text-xs font-bold bg-slate-800/80 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">AI POWERED</span>
      </div>
      
      <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-loading-bar box-shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
      </div>
      
      <p className="text-slate-500 text-sm mt-4 animate-pulse z-10 font-mono">Initializing Neural Market Data...</p>
      
      {/* Developer Credit */}
      <div className="absolute bottom-10 text-slate-600 text-xs font-medium tracking-wide opacity-80 z-10">
        Built by Shadrack v1.0
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; }
          100% { width: 100%; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};