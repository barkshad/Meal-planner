
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin ? 'Access your meal plans and budget' : 'Start your affordable eating journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
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
