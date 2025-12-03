import React, { useState } from 'react';
import { ChefHat, ShoppingCart, BarChart3, Calendar, ChevronRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome to MealMind",
    description: "Your futuristic AI assistant for planning affordable, delicious meals in Kenya.",
    icon: <ChefHat size={48} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />,
    color: "bg-emerald-500/10 border-emerald-500/20"
  },
  {
    title: "Manage Your Soko",
    description: "First, go to the 'Soko' tab. Add foods you already have. We optimize costs based on your inventory.",
    icon: <ShoppingCart size={48} className="text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]" />,
    color: "bg-purple-500/10 border-purple-500/20"
  },
  {
    title: "Plan & Budget",
    description: "Set your daily KES budget. Our AI scans market prices to find meals that fit your wallet.",
    icon: <Calendar size={48} className="text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />,
    color: "bg-indigo-500/10 border-indigo-500/20"
  },
  {
    title: "Track Insights",
    description: "Check the 'Stats' tab to visualize spending trends and get real-time price alerts for Nairobi.",
    icon: <BarChart3 size={48} className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />,
    color: "bg-blue-500/10 border-blue-500/20"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm glass-panel rounded-3xl shadow-2xl overflow-hidden relative border border-white/10">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full"></div>

        {/* Skip Button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider">Skip</span>
        </button>

        {/* Content Area */}
        <div className="p-8 flex flex-col items-center text-center mt-4 relative z-10">
          <div className={`p-6 rounded-full ${step.color} border mb-6 shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 animate-float`}>
            {step.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3 transition-all duration-300">
            {step.title}
          </h2>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-8 h-16">
            {step.description}
          </p>

          {/* Progress Indicators */}
          <div className="flex gap-2 mb-8">
            {STEPS.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentStep ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 border border-emerald-400/20"
          >
            {currentStep === STEPS.length - 1 ? (
              <>Get Started <Check size={20} /></>
            ) : (
              <>Next Step <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};