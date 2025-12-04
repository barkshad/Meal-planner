
import React from 'react';
import { Users, Heart, Share2, Copy } from 'lucide-react';

interface CoupleModeProps {
  onClose: () => void;
}

export const CoupleMode: React.FC<CoupleModeProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm glass-panel p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">✕</button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart size={32} className="text-pink-500 fill-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Couple Mode</h2>
          <p className="text-slate-500 text-sm">Plan meals together with your partner.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase">Your Invite Code</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 bg-white p-2 rounded border border-slate-200 font-mono text-lg font-bold text-center tracking-widest">
                LOVE-254
              </code>
              <button className="p-2 text-slate-500 hover:text-emerald-600">
                <Copy size={20} />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or Join Partner</span>
            </div>
          </div>

          <input 
            type="text" 
            placeholder="Enter Partner's Code" 
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-center uppercase tracking-widest focus:ring-2 focus:ring-pink-500/20 outline-none"
          />

          <button className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all">
            Sync Meal Plans
          </button>
        </div>
      </div>
    </div>
  );
};
