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
        savedPlans: [],
        // FIX: Added missing savedRecipes property to conform to UserProfile type.
        savedRecipes: [],
      };
      
      // Persist to local storage for demo
      localStorage.setItem('mealmind_user', JSON.stringify(mockUser));
      
      setLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[80px] opacity-60"></div>

      <div className="w-full max-w-md glass-panel relative z-10 animate-fade-in">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mb-4 shadow-sm">
               <ChefHat size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join MealMind'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {isLogin ? 'Access your meal planner' : 'Start your smart food journey in Kenya'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 mt-6 hover:-translate-y-1"
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
              className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
        
        {/* Footer Accent */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Smart Meal Planning for Kenya 🇰🇪
          </p>
        </div>
      </div>
    </div>
  );
};