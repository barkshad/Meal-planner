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
    <div className={`fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      <div className="relative mb-8 z-10">
        <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-float">
          <ChefHat size={80} className="text-emerald-600" />
        </div>
      </div>
      
      <h1 className="text-5xl font-bold text-slate-800 tracking-tighter mb-2 z-10">
        Meal<span className="text-emerald-600">Mind</span>
      </h1>
      
      <div className="flex items-center gap-2 mb-8 z-10">
        <span className="text-xs font-bold bg-white text-emerald-600 px-2 py-1 rounded border border-emerald-100 shadow-sm">KENYA EDITION</span>
        <span className="text-xs font-bold bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-100 shadow-sm">AI POWERED</span>
      </div>
      
      <div className="w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden relative z-10">
        <div className="h-full bg-emerald-500 animate-loading-bar"></div>
      </div>
      
      <p className="text-slate-400 text-sm mt-4 animate-pulse z-10 font-mono">Initializing Neural Market Data...</p>
      
      {/* Developer Credit */}
      <div className="absolute bottom-10 text-slate-400 text-xs font-medium tracking-wide z-10">
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