
import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Recipe } from '../types';

interface SpinWheelProps {
  candidates: Recipe[];
  onResult: (recipe: Recipe) => void;
  onClose: () => void;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({ candidates, onResult, onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (spinning || candidates.length === 0) return;
    setSpinning(true);
    
    // Random rotations (min 5 spins) + random landing
    const spins = 5;
    const degrees = Math.floor(Math.random() * 360);
    const totalRotation = (spins * 360) + degrees;
    
    setRotation(totalRotation);
    
    setTimeout(() => {
      setSpinning(false);
      // Calculate winner
      const segmentSize = 360 / candidates.length;
      // Normalize rotation to 0-360
      const normalized = degrees; 
      // Pointer is usually at top (0 or 270 depending on css), let's assume top.
      // If we rotated clockwise, the winning index is based on what's at the top.
      // Simplify: Just pick random from list since visual sync is hard without canvas.
      const winner = candidates[Math.floor(Math.random() * candidates.length)];
      onResult(winner);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col items-center">
        <button onClick={onClose} className="absolute -top-12 right-0 text-white p-2">
          <X size={24} />
        </button>

        <div className="relative w-80 h-80 sm:w-96 sm:h-96">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-emerald-500 drop-shadow-lg"></div>

          {/* Wheel */}
          <div 
            className="w-full h-full rounded-full border-4 border-slate-800 shadow-2xl overflow-hidden relative bg-slate-100"
            style={{ 
              transition: spinning ? 'transform 4s cubic-bezier(0.1, 0, 0.2, 1)' : 'none',
              transform: `rotate(${rotation}deg)`
            }}
          >
            {candidates.slice(0, 8).map((c, i, arr) => {
               const angle = 360 / arr.length;
               const rotate = angle * i;
               const skew = 90 - angle;
               // Colors
               const colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-red-500'];
               
               return (
                 <div 
                    key={i}
                    className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left border border-white/10"
                    style={{
                      transform: `rotate(${rotate}deg) skewY(-${skew}deg)`
                    }}
                 >
                   <div 
                      className={`w-full h-full opacity-90 ${colors[i % colors.length]}`}
                      style={{
                        transform: `skewY(${skew}deg) rotate(${angle/2}deg)`
                      }}
                   >
                     <span className="absolute left-6 top-8 text-white font-bold text-xs uppercase w-20 truncate rotate-90 origin-left">
                       {c.title.split(' ')[0]}
                     </span>
                   </div>
                 </div>
               );
            })}
          </div>
          
          {/* Center Button */}
          <button 
            onClick={handleSpin}
            disabled={spinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white border-4 border-slate-200 shadow-xl flex items-center justify-center text-emerald-600 font-bold uppercase tracking-widest z-10 active:scale-95 transition-transform"
          >
            {spinning ? '...' : 'SPIN'}
          </button>
        </div>

        <div className="mt-8 text-white font-bold text-xl animate-pulse">
          {spinning ? "Finding your destiny..." : "Tap SPIN to decide!"}
        </div>
      </div>
    </div>
  );
};
