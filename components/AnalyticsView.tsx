import React from 'react';
import { AnalyticsData } from '../types';
import { TrendingUp, PieChart, Wallet, AlertTriangle } from 'lucide-react';

interface AnalyticsViewProps {
  data: AnalyticsData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  // Simple max value for bar chart scaling
  const maxSpend = Math.max(...data.weekly_spending_trend.map(d => d.amount));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group border-emerald-100">
          <div className="absolute top-0 right-0 p-8 bg-emerald-50 rounded-full blur-xl group-hover:bg-emerald-100 transition-colors"></div>
          <div className="flex items-center gap-2 text-emerald-600 mb-2 relative z-10">
             <Wallet size={18} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Savings</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 relative z-10">KES {data.projected_savings}</p>
          <p className="text-xs text-slate-400 relative z-10 mt-1">Projected this month</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group border-indigo-100">
           <div className="absolute top-0 right-0 p-8 bg-indigo-50 rounded-full blur-xl group-hover:bg-indigo-100 transition-colors"></div>
           <div className="flex items-center gap-2 text-indigo-600 mb-2 relative z-10">
             <TrendingUp size={18} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Daily Avg</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 relative z-10">
            KES {Math.round(data.weekly_spending_trend.reduce((a,b)=>a+b.amount,0) / 7)}
          </p>
          <p className="text-xs text-slate-400 relative z-10 mt-1">Last 7 Days</p>
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-600" />
          Spending Trend
        </h3>
        <div className="flex items-end justify-between h-40 gap-3">
          {data.weekly_spending_trend.map((item, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div className="relative w-full h-full flex items-end">
                <div 
                  className="w-full bg-slate-100 rounded-t-lg relative overflow-hidden transition-all duration-500 ease-out group-hover:shadow-md"
                  style={{ height: `${(item.amount / maxSpend) * 100}%`, minHeight: '10%' }}
                >
                   <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-emerald-300 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider group-hover:text-emerald-600 transition-colors">{item.day.slice(0,3)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Alerts */}
      <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-orange-500 bg-orange-50/50">
        <div className="flex items-center gap-2 text-orange-600 mb-3">
          <AlertTriangle size={20} />
          <h3 className="font-bold text-slate-800">Market Intelligence</h3>
        </div>
        <ul className="space-y-3">
          {data.price_alerts.map((alert, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-sm"></span>
              {alert}
            </li>
          ))}
        </ul>
      </div>

      {/* Breakdown */}
      <div className="glass-panel p-6 rounded-3xl">
         <div className="flex items-center gap-2 text-slate-800 mb-6">
          <PieChart size={20} className="text-indigo-600" />
          <h3 className="font-bold">Cost Breakdown</h3>
        </div>
        <div className="space-y-4">
          {data.category_breakdown.map((cat, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 font-medium">{cat.category}</span>
                <span className="text-slate-800 font-bold">{cat.percentage}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full relative" 
                  style={{ width: `${cat.percentage}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};