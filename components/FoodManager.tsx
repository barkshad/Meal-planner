import React, { useState } from 'react';
import { FoodItem } from '../types';
import { Trash2, Plus, Info, ShoppingBag } from 'lucide-react';

interface FoodManagerProps {
  items: FoodItem[];
  setItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
}

export const FoodManager: React.FC<FoodManagerProps> = ({ items, setItems }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');

  const handleAddItem = () => {
    if (!newItemName || !newItemCost) return;
    const costNum = parseFloat(newItemCost);
    if (isNaN(costNum)) return;

    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: newItemName,
      cost: costNum,
      unit: 'unit',
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemName('');
    setNewItemCost('');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="glass-panel rounded-3xl shadow-xl p-6 border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
             <ShoppingBag size={20} className="text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Kitchen (Soko)</h2>
        </div>
        
        <div className="group relative">
           <Info size={18} className="text-slate-500 hover:text-purple-400 cursor-help transition-colors" />
           <div className="absolute right-0 bottom-full mb-2 w-56 p-3 bg-slate-900/90 backdrop-blur-md text-slate-200 text-xs rounded-xl border border-white/10 hidden group-hover:block z-10 shadow-xl">
             Add foods available in your kitchen. We use this to lower your meal costs by using what you have.
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-purple-400/80 uppercase tracking-wider">Item Name</label>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="e.g. Sukuma Wiki"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-purple-400/80 uppercase tracking-wider">Est. Cost (KES)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={newItemCost}
              onChange={(e) => setNewItemCost(e.target.value)}
              placeholder="0"
              step="1"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
            />
            <button
              onClick={handleAddItem}
              disabled={!newItemName || !newItemCost}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-500">Your soko is empty.</p>
            <p className="text-xs text-slate-600 mt-1">Add items to start saving.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-purple-500/30 hover:bg-slate-800/60 transition-all group animate-fade-in"
            >
              <div>
                <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{item.name}</span>
                <span className="text-xs text-purple-400/80 ml-2 font-mono bg-purple-500/10 px-1.5 py-0.5 rounded">KES {item.cost}</span>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};