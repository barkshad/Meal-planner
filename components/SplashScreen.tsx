
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
    <div className={`fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative mb-8">
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-2xl shadow-2xl animate-bounce-subtle">
          <ChefHat size={64} className="text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white tracking-tighter mb-2 font-inter">
        Meal<span className="text-emerald-400">Mind</span>
        <span className="text-xs align-top bg-emerald-900 text-emerald-300 px-1 py-0.5 rounded ml-1">KE</span>
      </h1>
      
      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-6">
        <div className="h-full bg-emerald-500 animate-loading-bar"></div>
      </div>
      
      <p className="text-slate-500 text-sm mt-4 animate-pulse">Checking Nairobi Market Prices...</p>
      
      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; }
          100% { width: 100%; transform: translateX(0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};
