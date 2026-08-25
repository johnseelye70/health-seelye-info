'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  EquipmentCategory,
  EquipmentItem,
} from '@/lib/types';
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_SUB_CATEGORIES,
  MASTER_EQUIPMENT_DATABASE,
  EQUIPMENT_PRESETS,
} from '@/lib/equipment-database';
import { MASTER_EXERCISE_DATABASE, COMPREHENSIVE_EXERCISE_DATABASE } from '@/lib/exercise-database';
import { PlateInventoryCalculator } from './PlateInventoryCalculator';
import {
  Search,
  ArrowLeft,
  Check,
  Plus,
  ChevronRight,
  Sparkles,
  Info,
  X,
  RotateCcw,
  SlidersHorizontal,
  Dumbbell,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Trash2,
  Scale,
} from 'lucide-react';

interface EquipmentInventoryBrowserProps {
  onSelectEquipment?: (eq: EquipmentItem) => void;
  onNavigateToExercises?: () => void;
  onNavigateToPlateCalculator?: () => void;
}

export const EquipmentInventoryBrowser: React.FC<EquipmentInventoryBrowserProps> = ({
  onSelectEquipment,
  onNavigateToExercises,
  onNavigateToPlateCalculator,
}) => {
  const { profile, toggleEquipment, setEquipmentInventory, experienceMode } = useHealth();
  const isSimple = experienceMode === 'simple';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedEquipmentDetail, setSelectedEquipmentDetail] = useState<EquipmentItem | null>(null);
  const [onlyOwnedFilter, setOnlyOwnedFilter] = useState<boolean>(false);

  const ownedEquipmentIds = useMemo(() => {
    return new Set(profile.equipment_inventory || []);
  }, [profile.equipment_inventory]);

  // Symbiotic calculation: How many exercises in total library are unlocked by active equipment
  const unlockedExercisesCount = useMemo(() => {
    const owned = profile.equipment_inventory || [];
    return COMPREHENSIVE_EXERCISE_DATABASE.filter((ex) => {
      if (owned.length === 0) {
        return (
          ex.equipment_required === 'bodyweight' ||
          !ex.required_equipment_ids ||
          ex.required_equipment_ids.every((id) => id === 'bodyweight')
        );
      }
      if (ex.required_equipment_ids && ex.required_equipment_ids.length > 0) {
        return ex.required_equipment_ids.every(
          (id) => id === 'bodyweight' || owned.includes(id)
        );
      }
      return ex.equipment_required === 'bodyweight' || owned.includes(ex.equipment_required);
    }).length;
  }, [profile.equipment_inventory]);

  // Counts of owned items per category
  const categoryOwnedCounts = useMemo(() => {
    const counts: Record<string, { owned: number; total: number }> = {};
    MASTER_EQUIPMENT_DATABASE.forEach((item) => {
      if (!counts[item.category]) {
        counts[item.category] = { owned: 0, total: 0 };
      }
      counts[item.category].total += 1;
      if (ownedEquipmentIds.has(item.id)) {
        counts[item.category].owned += 1;
      }
    });
    return counts;
  }, [ownedEquipmentIds]);

  // Counts of owned items per sub-category
  const subCategoryOwnedCounts = useMemo(() => {
    const counts: Record<string, { owned: number; total: number }> = {};
    MASTER_EQUIPMENT_DATABASE.forEach((item) => {
      if (!counts[item.sub_category]) {
        counts[item.sub_category] = { owned: 0, total: 0 };
      }
      counts[item.sub_category].total += 1;
      if (ownedEquipmentIds.has(item.id)) {
        counts[item.sub_category].owned += 1;
      }
    });
    return counts;
  }, [ownedEquipmentIds]);

  // Filtered equipment items list
  const filteredEquipment = useMemo(() => {
    return MASTER_EQUIPMENT_DATABASE.filter((item) => {
      if (onlyOwnedFilter && !ownedEquipmentIds.has(item.id)) return false;

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesSub = item.sub_category.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesSub && !matchesDesc) return false;
      } else {
        if (selectedCategory && item.category !== selectedCategory) return false;
        if (selectedSubCategory && selectedSubCategory !== 'all' && item.sub_category !== selectedSubCategory) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedSubCategory, onlyOwnedFilter, ownedEquipmentIds]);

  const activeCategoryMeta = EQUIPMENT_CATEGORIES.find((c) => c.id === selectedCategory);
  const activeSubCategoryMeta = EQUIPMENT_SUB_CATEGORIES.find((s) => s.id === selectedSubCategory);
  const currentSubCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return EQUIPMENT_SUB_CATEGORIES.filter((sub) => sub.parentId === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner & Symbiotic Metric */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-100 border border-surface-border space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🛠️ EQUIPMENT INVENTORY DATABASE
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {ownedEquipmentIds.size} of {MASTER_EQUIPMENT_DATABASE.length} Pieces Selected
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Custom Equipment Inventory & Gym Setup
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
              {isSimple
                ? 'Select the equipment you have at home or at your gym. Your available workout exercises will automatically match what you check below.'
                : 'Manage your gym equipment matrix. Symbiotically calculates eligible movements and auto-populates periodized workout routines.'}
            </p>
          </div>

          {/* Symbiotic Unlocked Exercises Counter & Action Button */}
          <div className="p-3.5 rounded-2xl bg-surface-200/90 border border-surface-border flex items-center justify-between gap-4 self-start lg:self-auto">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Available Exercises</div>
              <div className="text-base font-black text-brand-400 font-mono">
                {unlockedExercisesCount.toLocaleString()}{' '}
                <span className="text-xs text-zinc-500 font-normal">
                  / {COMPREHENSIVE_EXERCISE_DATABASE.length.toLocaleString()} total
                </span>
              </div>
            </div>

            {onNavigateToExercises && (
              <button
                type="button"
                onClick={onNavigateToExercises}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-500 text-zinc-950 text-xs font-bold shadow-glow hover:bg-brand-400 transition-all cursor-pointer active:scale-95"
              >
                <span>View Exercises</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Setup Presets Row */}
        <div className="pt-2 border-t border-surface-border/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              ⚡ Fast Gym Setup Presets:
            </span>
            {ownedEquipmentIds.size > 0 && (
              <button
                type="button"
                onClick={() => setEquipmentInventory([])}
                className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All ({ownedEquipmentIds.size})</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setEquipmentInventory(preset.equipmentIds)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer active:scale-95"
                title={preset.description}
              >
                <span>{preset.name}</span>
              </button>
            ))}

            {onNavigateToPlateCalculator && (
              <button
                type="button"
                onClick={onNavigateToPlateCalculator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-brand-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <Scale className="w-3.5 h-3.5 text-brand-400" />
                <span>Plate Inventory & Barbell Math</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setOnlyOwnedFilter((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                onlyOwnedFilter
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-glow border border-emerald-400'
                  : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300'
              }`}
            >
              <span>{onlyOwnedFilter ? '✓ Showing Selected Only' : 'Show Only In My Gym'}</span>
            </button>
          </div>
        </div>

        {/* Global Instant Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            id="equipment-global-search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim().length > 0) {
                setSelectedCategory(null);
                setSelectedSubCategory(null);
              }
            }}
            placeholder="Search equipment (e.g. adjustable dumbbells, Olympic barbell, cable tower, incline bench, pull-up bar)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-surface-200/90 border border-surface-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-white bg-surface-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          TIER 1: MASTER EQUIPMENT CATEGORIES (Root Overview)
          ========================================================================= */}
      {!selectedCategory && !selectedSubCategory && searchQuery.trim().length === 0 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 flex-wrap">
              <span>Equipment Categories</span>
              <span className="text-zinc-600">•</span>
              <span className="text-brand-400 font-mono">{EQUIPMENT_CATEGORIES.length} Master Groups</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-mono font-semibold">
                {ownedEquipmentIds.size} Selected in Active Gym
              </span>
            </h3>
            <span className="text-xs text-zinc-500">Select any group to explore gear sub-categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {EQUIPMENT_CATEGORIES.map((cat) => {
              const counts = categoryOwnedCounts[cat.id] || { owned: 0, total: 0 };
              const hasOwned = counts.owned > 0;

              return (
                <div
                  key={cat.id}
                  id={`equipment-category-card-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubCategory(null);
                  }}
                  className="group p-5 rounded-3xl bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between shadow-lg cursor-pointer hover:scale-[1.02]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-2xl bg-surface-200/80 border border-surface-border/60 group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </span>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-full font-semibold border ${
                          hasOwned
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow'
                            : 'bg-surface-300/80 text-zinc-400 border-surface-border/60'
                        }`}
                      >
                        {counts.owned} / {counts.total} owned
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs text-zinc-400 group-hover:text-brand-400 font-medium">
                    <span>Explore Sub-Categories</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIER 2: EQUIPMENT SUB-CATEGORIES (When a Master Category is Chosen)
          ========================================================================= */}
      {selectedCategory && !selectedSubCategory && searchQuery.trim().length === 0 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 rounded-2xl bg-surface-100 border border-surface-border gap-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border font-semibold text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-brand-400" />
                <span>All Categories</span>
              </button>
              <span className="text-zinc-600">/</span>
              <span className="font-bold text-zinc-100 flex items-center gap-1">
                <span>{activeCategoryMeta?.icon}</span>
                <span>{activeCategoryMeta?.name}</span>
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-emerald-400 font-mono font-semibold">
                {(categoryOwnedCounts[selectedCategory]?.owned || 0)} of{' '}
                {(categoryOwnedCounts[selectedCategory]?.total || 0)} Selected
              </span>
            </div>

            <button
              onClick={() => setSelectedSubCategory('all')}
              className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>View All {(categoryOwnedCounts[selectedCategory]?.total || 0)} Items in Category</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {currentSubCategories.map((sub) => {
              const counts = subCategoryOwnedCounts[sub.id] || { owned: 0, total: 0 };
              const hasOwned = counts.owned > 0;

              return (
                <div
                  key={sub.id}
                  id={`equipment-subcategory-card-${sub.id}`}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className="group p-5 rounded-3xl bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between shadow-md cursor-pointer hover:scale-[1.02]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl p-2 rounded-2xl bg-surface-200/80 border border-surface-border/60 group-hover:scale-110 transition-transform">
                        {sub.icon}
                      </span>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-full font-semibold border ${
                          hasOwned
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow'
                            : 'bg-surface-300/80 text-zinc-400 border-surface-border/60'
                        }`}
                      >
                        {counts.owned} / {counts.total} in gym
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">
                      {sub.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs text-zinc-400 group-hover:text-brand-400 font-medium">
                    <span>View Equipment List</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIER 3: EQUIPMENT ITEMS LIST (When Sub-Category or Global Search is Active)
          ========================================================================= */}
      {(selectedSubCategory !== null || searchQuery.trim().length > 0) && (
        <div className="space-y-4 animate-fadeIn">
          {/* Breadcrumb Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 rounded-2xl bg-surface-100 border border-surface-border gap-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setSearchQuery('');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border font-semibold text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-brand-400" />
                <span>All Categories</span>
              </button>

              {selectedCategory && activeCategoryMeta && (
                <>
                  <span className="text-zinc-600">/</span>
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className="font-semibold text-zinc-300 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{activeCategoryMeta.icon}</span>
                    <span>{activeCategoryMeta.name}</span>
                  </button>
                </>
              )}

              {selectedSubCategory && selectedSubCategory !== 'all' && activeSubCategoryMeta && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="font-bold text-brand-400 flex items-center gap-1">
                    <span>{activeSubCategoryMeta.icon}</span>
                    <span>{activeSubCategoryMeta.name}</span>
                  </span>
                </>
              )}

              {selectedSubCategory === 'all' && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="font-bold text-brand-400">All Items in Category</span>
                </>
              )}

              {searchQuery.trim().length > 0 && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="font-bold text-brand-400">
                    Results for &ldquo;{searchQuery}&rdquo;
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-surface-200 text-zinc-300 font-medium">
                {filteredEquipment.length} {filteredEquipment.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Empty State */}
          {filteredEquipment.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-surface-100/90 border border-surface-border space-y-3">
              <div className="text-4xl">🔍</div>
              <h4 className="text-base font-bold text-zinc-200">No equipment items found</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try clearing your search term or unchecking &ldquo;Show Only In My Gym&rdquo;.
              </p>
            </div>
          )}

          {/* Equipment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredEquipment.map((item) => {
              const isOwned = ownedEquipmentIds.has(item.id);

              return (
                <div
                  key={item.id}
                  id={`equipment-item-${item.id}`}
                  className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between shadow-md group select-none ${
                    isOwned
                      ? 'bg-surface-100/95 border-emerald-500/40 ring-1 ring-emerald-500/20'
                      : 'bg-surface-100/80 hover:bg-surface-200/90 border-surface-border hover:border-brand-500/30'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-2xl bg-surface-200/90 border border-surface-border">
                          {item.icon}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-300 transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">
                            Footprint: {item.footprint.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Owned Status Tag */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border flex-shrink-0 ${
                          isOwned
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-surface-300/80 text-zinc-400 border-surface-border/60'
                        }`}
                      >
                        {isOwned ? '✓ In Gym' : 'Not Selected'}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-brand-300 font-mono">
                      <span>⚡ Unlocks ~{item.typical_exercises_unlocked}+ targeted exercises</span>
                    </div>
                  </div>

                  {/* 1-Tap Toggle Action Button */}
                  <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedEquipmentDetail(item)}
                      className="text-xs text-zinc-400 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleEquipment(item.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                        isOwned
                          ? 'bg-emerald-500 text-zinc-950 shadow-glow hover:bg-emerald-400'
                          : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-200 hover:text-white'
                      }`}
                    >
                      {isOwned ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Selected in Gym</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to My Gym</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL WINDOW: EQUIPMENT DETAIL & SPECS
          ========================================================================= */}
      {selectedEquipmentDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-surface-200 border border-surface-border">
                  {selectedEquipmentDetail.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedEquipmentDetail.name}</h3>
                  <span className="text-xs font-mono text-zinc-400">
                    Category: {selectedEquipmentDetail.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEquipmentDetail(null)}
                className="p-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {selectedEquipmentDetail.description}
            </p>

            <div className="p-3 rounded-2xl bg-surface-200/80 border border-surface-border space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Footprint Type:</span>
                <span className="font-bold text-zinc-200 capitalize">
                  {selectedEquipmentDetail.footprint.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Estimated Exercise Variations:</span>
                <span className="font-bold text-brand-400">
                  {selectedEquipmentDetail.typical_exercises_unlocked}+
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedEquipmentDetail(null)}
                className="px-4 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleEquipment(selectedEquipmentDetail.id);
                  setSelectedEquipmentDetail(null);
                }}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow active:scale-95 cursor-pointer ${
                  ownedEquipmentIds.has(selectedEquipmentDetail.id)
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950'
                }`}
              >
                {ownedEquipmentIds.has(selectedEquipmentDetail.id) ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Remove from Gym</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Add to My Gym</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
