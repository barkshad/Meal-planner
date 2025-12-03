
import React, { useState } from 'react';
import { ChefHat, ShoppingCart, BarChart3, Calendar, ChevronRight, Check, X } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome to MealMind",
    description: "Your smart assistant for planning affordable, delicious meals in Kenya.",
    icon: <ChefHat size={48} className="text-emerald-500" />,
    color: "bg-emerald-100"
  },
  {
    title: "Manage Your Soko",
    description: "First, go to the 'Soko' tab. Add foods you already have in your kitchen. We prioritize these to save you money.",
    icon: <ShoppingCart size={48} className="text-purple-500" />,
    color: "bg-purple-100"
  },
  {
    title: "Plan & Budget",
    description: "Set your daily budget (KES). We'll suggest meals that fit your wallet and your preferences.",
    icon: <Calendar size={48} className="text-indigo-500" />,
    color: "bg-indigo-100"
  },
  {
    title: "Track Insights",
    description: "View the 'Trends' tab to see your spending habits and get market price alerts for Nairobi.",
    icon: <BarChart3 size={48} className="text-blue-500" />,
    color: "bg-blue-100"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Skip Button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <span className="text-xs font-bold uppercase tracking-wider">Skip</span>
        </button>

        {/* Content Area */}
        <div className="p-8 flex flex-col items-center text-center mt-4">
          <div className={`p-6 rounded-full ${step.color} mb-6 shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105`}>
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
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
          >
            {currentStep === STEPS.length - 1 ? (
              <>Get Started <Check size={20} /></>
            ) : (
              <>Next Step <ChevronRight size={20} /></>
            )}
          </button>
        </div>

        {/* Decorative background blur element */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
      </div>
    </div>
  );
};
