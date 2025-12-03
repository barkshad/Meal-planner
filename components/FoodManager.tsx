import React, { useState } from 'react';
import { FoodItem } from '../types';
import { Trash2, Plus, Info } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Your Kitchen</h2>
        <div className="group relative">
           <Info size={16} className="text-slate-400 cursor-help" />
           <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded hidden group-hover:block z-10">
             Add foods you have available and their estimated cost per serving.
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase">Item Name</label>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="e.g. Tuna Can"
            className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase">Est. Cost ($)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={newItemCost}
              onChange={(e) => setNewItemCost(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleAddItem}
              disabled={!newItemName || !newItemCost}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {items.length === 0 ? (
          <p className="text-center text-slate-400 py-4">No items added yet. Add some basics!</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-100 transition-all"
            >
              <div>
                <span className="font-medium text-slate-700">{item.name}</span>
                <span className="text-xs text-slate-400 ml-2">${item.cost.toFixed(2)} / {item.unit}</span>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
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
