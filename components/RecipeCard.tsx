import React, { useRef, useState } from 'react';
import { Recipe } from '../types';
import { ChefHat, Clock, DollarSign, ListOrdered, Utensils, FileDown, Share2, Loader2, ImageIcon } from 'lucide-react';

// Declare global types for the libraries loaded in index.html
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState<'pdf' | 'image' | null>(null);

  if (!recipe) return null;

  const generateFileName = (ext: string) => {
    const cleanName = (recipe.title || 'recipe').toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${cleanName}_mealplanner-ke.${ext}`;
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current || !window.html2canvas || !window.jspdf) {
        alert("PDF libraries loading. Check internet connection.");
        return;
    }
    setIsGenerating('pdf');

    try {
      const { jsPDF } = window.jspdf;
      
      // Temporarily hide buttons for capture
      const buttons = cardRef.current.querySelector('.action-buttons') as HTMLElement;
      if (buttons) buttons.style.display = 'none';

      // Capture high-res canvas (Scale 3 for crisp text)
      const canvas = await window.html2canvas(cardRef.current, {
        scale: 3, // Increased scale to fix blur
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight
      });

      if (buttons) buttons.style.display = 'flex';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;

      // Handle multi-page if recipe is very long
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Move position up
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position - (heightLeft - pageHeight), imgWidth, imgHeight, '', 'FAST'); 
        heightLeft -= pageHeight;
      }
      
      pdf.save(generateFileName('pdf'));
    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  const handleShareImage = async () => {
    if (!cardRef.current || !window.html2canvas) {
        alert("Image libraries loading. Check internet connection.");
        return;
    }
    setIsGenerating('image');

    try {
      // Temporarily hide buttons for capture
      const buttons = cardRef.current.querySelector('.action-buttons') as HTMLElement;
      if (buttons) buttons.style.display = 'none';

      // Capture high-res canvas (Scale 3 for crisp text)
      const canvas = await window.html2canvas(cardRef.current, {
        scale: 3, // Increased scale to fix blur
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight
      });

      if (buttons) buttons.style.display = 'flex';

      // Convert to blob
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;

        const fileName = generateFileName('png');
        const file = new File([blob], fileName, { type: 'image/png' });

        // Check if native sharing is supported
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: recipe.title,
                text: `Check out this recipe for ${recipe.title} from MealMind Kenya!`,
              });
            } catch (err) {
              // Share cancelled or failed, fallback to download
              if ((err as Error).name !== 'AbortError') {
                 downloadImage(canvas, fileName);
              }
            }
        } else {
            // Fallback: Download
            downloadImage(canvas, fileName);
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Image Generation failed', error);
      alert('Could not save image. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  const downloadImage = (canvas: HTMLCanvasElement, fileName: string) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1.0);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel overflow-hidden animate-slide-up shadow-xl shadow-blue-900/5 mt-6" ref={cardRef}>
      
      {/* Header with App Branding for Exports */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
        <div className="absolute top-4 right-4 text-white/30 font-bold text-xs uppercase tracking-widest pointer-events-none select-none">
          MealPlanner KE
        </div>
        
        <div className="flex items-start justify-between relative z-10 mt-2">
          <div>
            <span className="px-2 py-0.5 rounded-md bg-black/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2 w-fit">
              <ChefHat size={12} /> {recipe.category}
            </span>
            <h2 className="text-3xl font-bold tracking-tight">{recipe.title}</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
             <Utensils size={28} className="text-white drop-shadow-sm" />
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                <DollarSign size={16} />
                <span>Est. KES {recipe.estimated_cost_ksh}</span>
            </div>
             <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Clock size={16} />
                <span>{recipe.cook_time_minutes} mins</span>
            </div>
        </div>
      </div>

      <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <ListOrdered size={18} className="text-blue-500" /> Ingredients
            </h3>
            <ul className="space-y-2">
                {recipe.ingredients?.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                        <span className="flex-1">{ing}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Steps */}
        <div className="md:col-span-2">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Utensils size={18} className="text-blue-500" /> Steps
            </h3>
            <div className="space-y-4">
                {recipe.steps?.sort((a,b) => a.step - b.step).map((step) => (
                    <div key={step.step} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full font-bold border border-blue-100 mt-1">
                            {step.step}
                        </div>
                        <p className="text-slate-600 leading-relaxed pt-1">{step.instruction}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Export Actions - Hidden during capture */}
      <div className="action-buttons p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
        
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating !== null}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/80 border border-emerald-200 text-emerald-700 font-bold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-50 transition-all btn-hover-effect disabled:opacity-50"
          id="downloadPDF"
        >
          {isGenerating === 'pdf' ? <Loader2 size={20} className="animate-spin" /> : <FileDown size={20} />}
          <span>Download PDF</span>
        </button>

        <button 
          onClick={handleShareImage}
          disabled={isGenerating !== null}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/80 border border-blue-200 text-blue-700 font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:border-blue-400 hover:bg-blue-50 transition-all btn-hover-effect disabled:opacity-50"
          id="shareImage"
        >
          {isGenerating === 'image' ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
          <span>Save/Share Image</span>
        </button>

      </div>
    </div>
  );
};