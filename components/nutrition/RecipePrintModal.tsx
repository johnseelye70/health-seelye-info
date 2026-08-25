'use client';

import React, { useState } from 'react';
import { RecipeItem, UnitPreference } from '@/lib/types';
import {
  Printer,
  X,
  FileText,
  CreditCard,
} from 'lucide-react';

interface RecipePrintModalProps {
  recipe: RecipeItem | null;
  onClose: () => void;
  defaultUnitPreference?: UnitPreference;
}

export type PrintFormat = 'index_card_4x6' | 'standard_letter';

export const RecipePrintModal: React.FC<RecipePrintModalProps> = ({
  recipe,
  onClose,
  defaultUnitPreference = 'imperial',
}) => {
  const [printFormat, setPrintFormat] = useState<PrintFormat>('index_card_4x6');
  const [unitPreference, setUnitPreference] = useState<UnitPreference>(defaultUnitPreference);
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);

  if (!recipe) return null;

  const isImperial = unitPreference === 'imperial';

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Interactive Modal UI (Single clean scroll container, pinned header & footer) */}
      <div
        className="no-print fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn select-none"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-surface-100/95 border border-surface-border shadow-2xl backdrop-blur-xl text-zinc-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pinned Header */}
          <div className="p-5 sm:p-6 border-b border-surface-border shrink-0 flex items-center justify-between gap-4 bg-surface-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Print Recipe Card & Sheet</span>
                  <span className="text-xs font-mono font-normal text-brand-400 bg-brand-500/15 px-2 py-0.5 rounded-full border border-brand-500/30">
                    Ink-Friendly
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Select 4" x 6" kitchen index card style or full 8.5" x 11" standard letter size
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl text-zinc-400 hover:text-white bg-surface-200/80 hover:bg-surface-200 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Single Scrolling Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Controls Bar: Format, Units, Multiplier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-200/70 border border-surface-border">
              {/* Format Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Print Format
                </label>
                <div className="flex bg-surface-300 p-1 rounded-xl border border-surface-border">
                  <button
                    type="button"
                    onClick={() => setPrintFormat('index_card_4x6')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      printFormat === 'index_card_4x6'
                        ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>4" x 6" Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintFormat('standard_letter')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      printFormat === 'standard_letter'
                        ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>8.5" x 11" Letter</span>
                  </button>
                </div>
              </div>

              {/* Units Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Culinary Units
                </label>
                <div className="flex bg-surface-300 p-1 rounded-xl border border-surface-border">
                  <button
                    type="button"
                    onClick={() => setUnitPreference('imperial')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isImperial
                        ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    US (Cups/Oz)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitPreference('metric')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isImperial
                        ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Metric (g/ml)
                  </button>
                </div>
              </div>

              {/* Portion Scaler */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Batch Multiplier
                </label>
                <div className="flex bg-surface-300 p-1 rounded-xl border border-surface-border">
                  {[1, 2, 4, 6].map((mult) => (
                    <button
                      key={mult}
                      type="button"
                      onClick={() => setServingMultiplier(mult)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        servingMultiplier === mult
                          ? 'bg-brand-500 text-zinc-950 shadow-glow font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {mult}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live High-Contrast Visual Print Preview Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span>Print Preview:</span>
                <span className="text-zinc-500 text-[11px] font-normal">
                  {printFormat === 'index_card_4x6'
                    ? 'Formatted for 4" x 6" recipe card dimensions'
                    : 'Formatted for full 8.5" x 11" binder sheet'}
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                {/* The Visual Paper Container */}
                <div
                  className={`bg-white text-zinc-950 shadow-2xl transition-all duration-300 w-full ${
                    printFormat === 'index_card_4x6'
                      ? 'max-w-[580px] p-5 border-2 border-zinc-950 rounded-xl'
                      : 'max-w-[700px] p-8 border-2 border-zinc-300 rounded-xl'
                  }`}
                  style={{
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {/* Printable Header */}
                  <div className="border-b-2 border-zinc-950 pb-3 mb-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 mb-0.5">
                        SEELYE FAMILY HEALTH • WHOLESOME RECIPES
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-zinc-950 leading-tight">
                        {recipe.title}
                      </h2>
                      <p className="text-[11px] text-zinc-600 italic mt-0.5 line-clamp-1">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-zinc-950">
                        {recipe.calories_per_serving * servingMultiplier} kcal
                      </div>
                      <div className="text-[10px] text-zinc-600 font-mono">
                        {recipe.prep_time_minutes + recipe.cook_time_minutes} min • {recipe.servings_yield * servingMultiplier} serving{recipe.servings_yield * servingMultiplier > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Main Content Layout: 2 Columns */}
                  <div className={`grid gap-4 ${printFormat === 'index_card_4x6' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-5'}`}>
                    {/* Left Column: Ingredients List */}
                    <div className={printFormat === 'index_card_4x6' ? 'sm:col-span-1' : 'sm:col-span-2'}>
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1 mb-2">
                        Ingredients {servingMultiplier > 1 ? `(${servingMultiplier}x Scaled)` : ''}
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-zinc-800">
                        {recipe.ingredients.map((ing, idx) => {
                          const rawMeasure = isImperial ? ing.amount_imperial : ing.amount_metric;
                          let displayMeasure = rawMeasure;

                          if (servingMultiplier > 1 && ing.raw_weight_grams_base) {
                            const totalGrams = ing.raw_weight_grams_base * servingMultiplier;
                            const totalOz = (totalGrams * 0.03527).toFixed(1);
                            displayMeasure = isImperial
                              ? `${totalOz} oz (${totalGrams}g)`
                              : `${totalGrams}g`;
                          } else if (servingMultiplier > 1) {
                            displayMeasure = `${servingMultiplier}x (${rawMeasure})`;
                          }

                          return (
                            <li key={idx} className="flex items-start gap-1.5 leading-tight">
                              <span className="w-3 h-3 border border-zinc-400 rounded-sm mt-0.5 shrink-0"></span>
                              <span>
                                <strong>{displayMeasure}</strong> {ing.name}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Macro Box */}
                      <div className="mt-3 p-2 border border-zinc-300 rounded-lg bg-zinc-50 text-[10px] font-mono text-zinc-700">
                        <div className="font-bold text-zinc-900 mb-0.5">Per Serving Nutrition:</div>
                        <div>
                          {recipe.protein_g_per_serving}g Protein • {recipe.carbs_g_per_serving}g Carbs • {recipe.fat_g_per_serving}g Fat
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Instructions */}
                    <div className={printFormat === 'index_card_4x6' ? 'sm:col-span-1' : 'sm:col-span-3'}>
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1 mb-2">
                        Cooking Directions
                      </h4>
                      <ol className="space-y-2 text-[11px] text-zinc-800 leading-relaxed pl-1">
                        {recipe.instructions.map((step, sIdx) => (
                          <li key={sIdx} className="flex gap-2">
                            <span className="font-bold font-mono text-zinc-900 shrink-0">
                              {sIdx + 1}.
                            </span>
                            <span className="flex-1">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {recipe.chef_notes && (
                        <div className="mt-3 pt-2 border-t border-zinc-200 text-[10px] text-zinc-600 italic">
                          <strong>Chef's Tip: </strong>
                          {recipe.chef_notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div className="mt-4 pt-2 border-t border-zinc-300 text-[9px] text-zinc-500 flex justify-between font-mono">
                    <span>health.seelye.info • Clean Eating & Strength</span>
                    <span>{printFormat === 'index_card_4x6' ? '4" x 6" Card' : '8.5" x 11" Letter'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pinned Action Footer */}
          <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 bg-surface-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 font-bold text-xs shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Print {printFormat === 'index_card_4x6' ? '4" x 6" Index Card' : 'Full 8.5" x 11" Letter'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pure Print Container for window.print() (Rendered exclusively by @media print) */}
      <div className={`hidden print:block ${printFormat === 'index_card_4x6' ? 'print-index-card' : 'print-letter'}`}>
        <div className="p-4 bg-white text-black font-sans">
          {/* Header */}
          <div className="border-b-2 border-black pb-2 mb-2 flex items-start justify-between">
            <div>
              <div className="text-[9px] uppercase font-bold tracking-widest text-zinc-700">
                SEELYE FAMILY HEALTH • WHOLESOME RECIPES
              </div>
              <h1 className="text-lg font-black text-black leading-tight">
                {recipe.title}
              </h1>
              <p className="text-[10px] text-zinc-700 italic">
                {recipe.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-black text-black">
                {recipe.calories_per_serving * servingMultiplier} kcal
              </div>
              <div className="text-[9px] text-zinc-700 font-mono">
                {recipe.prep_time_minutes + recipe.cook_time_minutes} min • {recipe.servings_yield * servingMultiplier} serving{recipe.servings_yield * servingMultiplier > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* 2-Column Content */}
          <div className="grid grid-cols-5 gap-3 text-[10.5px]">
            {/* Ingredients */}
            <div className="col-span-2">
              <div className="font-bold uppercase text-[10px] border-b border-black pb-0.5 mb-1.5">
                Ingredients {servingMultiplier > 1 ? `(${servingMultiplier}x)` : ''}
              </div>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, idx) => {
                  const rawMeasure = isImperial ? ing.amount_imperial : ing.amount_metric;
                  let displayMeasure = rawMeasure;

                  if (servingMultiplier > 1 && ing.raw_weight_grams_base) {
                    const totalGrams = ing.raw_weight_grams_base * servingMultiplier;
                    const totalOz = (totalGrams * 0.03527).toFixed(1);
                    displayMeasure = isImperial
                      ? `${totalOz} oz (${totalGrams}g)`
                      : `${totalGrams}g`;
                  } else if (servingMultiplier > 1) {
                    displayMeasure = `${servingMultiplier}x (${rawMeasure})`;
                  }

                  return (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="inline-block w-2.5 h-2.5 border border-black rounded-none mt-0.5 shrink-0"></span>
                      <span>
                        <strong>{displayMeasure}</strong> {ing.name}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2 p-1.5 border border-black text-[9.5px] font-mono">
                <strong>Macros:</strong> {recipe.protein_g_per_serving}g Protein • {recipe.carbs_g_per_serving}g Carbs • {recipe.fat_g_per_serving}g Fat
              </div>
            </div>

            {/* Directions */}
            <div className="col-span-3">
              <div className="font-bold uppercase text-[10px] border-b border-black pb-0.5 mb-1.5">
                Preparation & Directions
              </div>
              <ol className="space-y-1.5 text-[10.5px] leading-snug">
                {recipe.instructions.map((step, sIdx) => (
                  <li key={sIdx} className="flex gap-1.5">
                    <span className="font-bold font-mono shrink-0">{sIdx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {recipe.chef_notes && (
                <div className="mt-2 pt-1 border-t border-zinc-400 text-[9.5px] italic">
                  <strong>Tip:</strong> {recipe.chef_notes}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-1 border-t border-zinc-400 text-[8px] font-mono text-zinc-600 flex justify-between">
            <span>health.seelye.info</span>
            <span>{printFormat === 'index_card_4x6' ? '4x6 Index Card Format' : '8.5x11 Standard Letter Format'}</span>
          </div>
        </div>
      </div>
    </>
  );
};
