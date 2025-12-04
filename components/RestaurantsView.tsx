
import React from 'react';
import { MapPin, Rocket, Clock } from 'lucide-react';

export const RestaurantsView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] animate-slide-up px-6 text-center">
      
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-full shadow-2xl border border-emerald-50">
           <Rocket size={64} className="text-emerald-500" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">
        Nearby Eats <span className="text-emerald-600">Coming Soon</span>
      </h2>
      
      <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
        We are building a smart GPS engine to find the best affordable restaurants and kibandas near you. Stay tuned!
      </p>

      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-500 font-bold text-xs uppercase tracking-widest border border-slate-200">
        <Clock size={14} />
        <span>Launch ETA: Q3 2025</span>
      </div>

    </div>
  );
};
