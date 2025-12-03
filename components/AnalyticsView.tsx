
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
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
             <Wallet size={20} />
             <span className="text-xs font-bold uppercase">Potential Savings</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">KES {data.projected_savings}</p>
          <p className="text-xs text-slate-400">Based on smart choices</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-2 text-indigo-600 mb-2">
             <TrendingUp size={20} />
             <span className="text-xs font-bold uppercase">Daily Avg</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            KES {Math.round(data.weekly_spending_trend.reduce((a,b)=>a+b.amount,0) / 7)}
          </p>
          <p className="text-xs text-slate-400">Last 7 Days</p>
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6">Spending Trend (Last 7 Days)</h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {data.weekly_spending_trend.map((item, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all"
                style={{ height: `${(item.amount / maxSpend) * 100}%`, minHeight: '10%' }}
              ></div>
              <span className="text-[10px] text-slate-400 mt-2 font-medium">{item.day.slice(0,3)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Alerts */}
      <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
        <div className="flex items-center gap-2 text-orange-700 mb-3">
          <AlertTriangle size={20} />
          <h3 className="font-bold">Market Intelligence</h3>
        </div>
        <ul className="space-y-2">
          {data.price_alerts.map((alert, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-orange-900">
              <span className="mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
              {alert}
            </li>
          ))}
        </ul>
      </div>

      {/* Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
         <div className="flex items-center gap-2 text-slate-700 mb-4">
          <PieChart size={20} />
          <h3 className="font-bold">Cost Breakdown</h3>
        </div>
        <div className="space-y-3">
          {data.category_breakdown.map((cat, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium">{cat.category}</span>
                <span className="text-slate-900 font-bold">{cat.percentage}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${cat.percentage}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
