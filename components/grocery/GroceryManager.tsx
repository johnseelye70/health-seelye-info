'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { GroceryItem } from '@/lib/types';
import {
  ShoppingCart,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Package,
  Leaf,
  Users,
  Sparkles,
  RotateCcw,
  X,
} from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';

export const GroceryManager: React.FC = () => {
  const {
    groceryList,
    groceryMultiplier,
    setGroceryMultiplier,
    toggleGroceryItem,
    addGroceryItem,
    deleteGroceryItem,
    clearCheckedGrocery,
  } = useHealth();

  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [newItemForm, setNewItemForm] = useState({
    item_name: '',
    category: 'fresh_weekly' as GroceryItem['category'],
    quantity: 1,
    unit: 'lbs',
    notes: '',
  });

  const pantryItems = groceryList.filter((item) => item.category === 'pantry_monthly');
  const freshItems = groceryList.filter((item) => item.category === 'fresh_weekly');

  const checkedCount = groceryList.filter((item) => item.is_checked).length;
  const totalCount = groceryList.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.item_name) return;
    addGroceryItem({
      item_name: newItemForm.item_name,
      category: newItemForm.category,
      quantity: Number(newItemForm.quantity),
      unit: newItemForm.unit,
      is_checked: false,
      notes: newItemForm.notes || undefined,
    });
    setShowAddItemModal(false);
    setNewItemForm({
      item_name: '',
      category: 'fresh_weekly',
      quantity: 1,
      unit: 'lbs',
      notes: '',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Non-Printable Header Banner */}
      <div className="no-print rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                AUTOMATED INGREDIENT REQUISITION ENGINE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Weekly Grocery Requisition Manager
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Auto-aggregated raw ingredients organized by shelf-life category. Formatted with dedicated monochrome print optimization for physical shopping trips or clean PDF export.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddItemModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all hover:border-zinc-700"
            >
              <Plus className="w-4 h-4 text-brand-400" />
              <span>Add Custom Item</span>
            </button>
            <button
              id="btn-print-grocery"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Requisition Controls & Multiplier Toolbar */}
      <div className="no-print p-4 rounded-2xl bg-surface-100/80 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Scale Multiplier */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-accent-cyan" />
            <span>Serving Multiplier:</span>
          </span>
          <div className="flex items-center gap-1.5 bg-surface-200 p-1 rounded-xl border border-surface-border">
            {[
              { val: 1, label: '1x Solo' },
              { val: 2, label: '2x Couple' },
              { val: 4, label: '4x Bulk Prep' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setGroceryMultiplier(opt.val)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  groceryMultiplier === opt.val
                    ? 'bg-brand-500 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress & Clear Checked */}
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-zinc-400">
            Progress: <strong className="text-brand-400">{checkedCount}</strong> / {totalCount} ({progressPercent}%)
          </div>
          {checkedCount > 0 && (
            <button
              onClick={clearCheckedGrocery}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Checked</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Physical Sheet Container */}
      <div className="printable-area space-y-8">
        {/* Print Header (Visible Only in Print) */}
        <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-baseline">
            <h1 className="text-2xl font-black tracking-tight text-black font-sans">
              HEALTH.SEELYE.INFO — GROCERY CHECKLIST
            </h1>
            <span className="text-xs text-zinc-600 font-mono">
              Generated: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="text-xs text-zinc-700 mt-1">
            Weekly Athlete Requisition • Serving Multiplier: {groceryMultiplier}x • Target Calories: {useHealth().profile.daily_calorie_target} kcal
          </div>
        </div>

        {/* Category 1: Fresh Pickups (Buy Weekly) */}
        <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl print:bg-transparent print:border-none print:p-0">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border/80 print:border-black mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center print:hidden">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100 print:text-black">
                  Fresh Pickups (Buy Weekly)
                </h2>
                <p className="text-xs text-zinc-400 print:text-zinc-600">
                  Perishable lean meats, fresh poultry, wild fish, produce & dairy alternatives
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-300 text-zinc-300 print:text-black print:bg-zinc-100">
              {freshItems.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2">
            {freshItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleGroceryItem(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between print:border-zinc-300 print:bg-white print:p-2.5 ${
                  item.is_checked
                    ? 'bg-brand-500/10 border-brand-500/30 text-zinc-400'
                    : 'bg-surface-200/60 border-surface-border hover:border-zinc-700 text-zinc-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 print:hidden">
                    {item.is_checked ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-500 shrink-0" />
                    )}
                  </div>
                  {/* Physical Print Checkbox Box */}
                  <div className="hidden print:block w-4 h-4 border border-black rounded mr-2 mt-0.5 shrink-0" />
                  
                  <div>
                    <div className={`text-sm font-semibold print:text-black ${item.is_checked ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                      {item.item_name}
                    </div>
                    <div className="text-xs font-mono text-brand-400 print:text-zinc-700 mt-0.5 font-bold">
                      {item.quantity * groceryMultiplier} {item.unit}
                    </div>
                    {item.notes && (
                      <div className="text-[11px] text-zinc-400 print:text-zinc-500 mt-0.5">
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroceryItem(item.id);
                  }}
                  className="no-print text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category 2: Pantry & Freezer Staples (Buy Once Monthly) */}
        <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl print:bg-transparent print:border-none print:p-0 print:mt-6">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border/80 print:border-black mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center print:hidden">
                <Package className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100 print:text-black">
                  Pantry & Freezer Staples (Buy Once Monthly)
                </h2>
                <p className="text-xs text-zinc-400 print:text-zinc-600">
                  Bulk whole grains, gluten-free oats, jasmine rice, whey isolates, olive oils & nuts
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-300 text-zinc-300 print:text-black print:bg-zinc-100">
              {pantryItems.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2">
            {pantryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleGroceryItem(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between print:border-zinc-300 print:bg-white print:p-2.5 ${
                  item.is_checked
                    ? 'bg-brand-500/10 border-brand-500/30 text-zinc-400'
                    : 'bg-surface-200/60 border-surface-border hover:border-zinc-700 text-zinc-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 print:hidden">
                    {item.is_checked ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-500 shrink-0" />
                    )}
                  </div>
                  {/* Physical Print Checkbox Box */}
                  <div className="hidden print:block w-4 h-4 border border-black rounded mr-2 mt-0.5 shrink-0" />

                  <div>
                    <div className={`text-sm font-semibold print:text-black ${item.is_checked ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                      {item.item_name}
                    </div>
                    <div className="text-xs font-mono text-accent-cyan print:text-zinc-700 mt-0.5 font-bold">
                      {item.quantity * groceryMultiplier} {item.unit}
                    </div>
                    {item.notes && (
                      <div className="text-[11px] text-zinc-400 print:text-zinc-500 mt-0.5">
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroceryItem(item.id);
                  }}
                  className="no-print text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block border-t border-zinc-400 pt-4 mt-8 text-center text-xs text-zinc-500 font-mono">
          health.seelye.info • Precision Nutrition & Metabolic Protocol
        </div>
      </div>

      {/* Modal: Add Custom Grocery Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleAddItem} className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Add Item to Grocery List</h3>
              <button type="button" onClick={() => setShowAddItemModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-300">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Matcha Powder"
                  value={newItemForm.item_name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, item_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300">Category</label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  >
                    <option value="fresh_weekly">Fresh Weekly Pickup</option>
                    <option value="pantry_monthly">Pantry Monthly Staple</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-300">Unit Type</label>
                  <input
                    type="text"
                    value={newItemForm.unit}
                    onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                    placeholder="e.g. lbs, tub, bags"
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  />
                </div>
              </div>

              <div>
                <NumberStepper
                  label="Base Quantity"
                  value={newItemForm.quantity}
                  onChange={(val) => setNewItemForm({ ...newItemForm, quantity: val })}
                  min={0.5}
                  max={100}
                  step={0.5}
                  decimals={1}
                  unit={newItemForm.unit}
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300">Optional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Look for organic or glass jar"
                  value={newItemForm.notes}
                  onChange={(e) => setNewItemForm({ ...newItemForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddItemModal(false)}
                className="flex-1 py-2 rounded-xl bg-surface-200 text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold text-xs shadow-glow"
              >
                Add To List
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
