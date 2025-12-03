import React, { useState } from 'react';
import { ChefHat, ShoppingCart, BarChart3, Calendar, ChevronRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome to MealMind",
    description: "Your AI assistant for planning affordable, delicious meals in Kenya.",
    icon: <ChefHat size={48} className="text-emerald-600" />,
    color: "bg-emerald-50 border-emerald-100"
  },
  {
    title: "Manage Your Soko",
    description: "First, go to the 'Soko' tab. Add foods you already have. We optimize costs based on your inventory.",
    icon: <ShoppingCart size={48} className="text-purple-600" />,
    color: "bg-purple-50 border-purple-100"
  },
  {
    title: "Plan & Budget",
    description: "Set your daily KES budget. Our AI scans market prices to find meals that fit your wallet.",
    icon: <Calendar size={48} className="text-indigo-600" />,
    color: "bg-indigo-50 border-indigo-100"
  },
  {
    title: "Track Insights",
    description: "Check the 'Stats' tab to visualize spending trends and get real-time price alerts for Nairobi.",
    icon: <BarChart3 size={48} className="text-blue-600" />,
    color: "bg-blue-50 border-blue-100"
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm glass-panel overflow-hidden relative border border-white/50 shadow-2xl">
        
        {/* Skip Button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-20"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider">Skip</span>
        </button>

        {/* Content Area */}
        <div className="p-8 flex flex-col items-center text-center mt-4 relative z-10">
          <div className={`p-6 rounded-full ${step.color} border mb-6 shadow-sm transform transition-all duration-300 ease-in-out hover:scale-105 animate-float`}>
            {step.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-3 transition-all duration-300">
            {step.title}
          </h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-8 h-16">
            {step.description}
          </p>

          {/* Progress Indicators */}
          <div className="flex gap-2 mb-8">
            {STEPS.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentStep ? 'w-8 bg-emerald-500' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95"
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