import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, Lock, User, ArrowRight, Loader2, ChefHat } from 'lucide-react';
import { DEFAULT_PREFERENCES } from '../constants';

interface AuthViewProps {
  onLogin: (user: UserProfile) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const mockUser: UserProfile = {
        name: name || 'Kenya User',
        email: email,
        preferences: DEFAULT_PREFERENCES,
        savedPlans: []
      };
      
      // Persist to local storage for demo
      localStorage.setItem('mealmind_user', JSON.stringify(mockUser));
      
      setLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-900/30 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-900/30 rounded-full blur-[100px] animate-pulse-slow"></div>

      <div className="w-full max-w-md glass-panel rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-fade-in border border-white/10">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
               <ChefHat size={40} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join MealMind'}
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              {isLogin ? 'Access your futuristic meal planner' : 'Start your smart food journey in Kenya'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] mt-6 hover:-translate-y-1"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
        
        {/* Footer Accent */}
        <div className="bg-slate-900/50 p-4 text-center border-t border-white/5 backdrop-blur-sm">
          <p className="text-xs text-slate-500">
            Smart Meal Planning for Kenya 🇰🇪
          </p>
        </div>
      </div>
    </div>
  );
};