'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  ExerciseCategory,
  ExerciseItem,
} from '@/lib/types';
import {
  EXERCISE_CATEGORIES,
  EXERCISE_SUB_CATEGORIES,
  COMPREHENSIVE_EXERCISE_DATABASE,
} from '@/lib/exercise-database';
import { MASTER_EQUIPMENT_DATABASE, calculateTotalPlateWeight } from '@/lib/equipment-database';
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
  AlertCircle,
  Play,
  Layers,
  Scale,
  Filter,
  Zap,
  Target,
  Compass,
} from 'lucide-react';

interface ExerciseDatabaseBrowserProps {
  onSelectExercise?: (exercise: ExerciseItem) => void;
  onNavigateToEquipment?: () => void;
}

export const ExerciseDatabaseBrowser: React.FC<ExerciseDatabaseBrowserProps> = ({
  onSelectExercise,
  onNavigateToEquipment,
}) => {
  const { profile, toggleEquipment, experienceMode } = useHealth();
  const isSimple = experienceMode === 'simple';

  // Fast Instant-Response Debounced Search State
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // 120ms debounce effect so typing is 100% instant and non-blocking
  useEffect(() => {
    if (inputValue === searchQuery) return;
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      setVisibleCount(36);
      if (inputValue.trim().length > 0) {
        setSelectedCategory(null);
        setSelectedSubCategory(null);
      }
      setIsSearching(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery]);

  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<ExerciseItem | null>(null);
  const [showFilterMatrixModal, setShowFilterMatrixModal] = useState<boolean>(false);

  // Stackable Filter Toggles
  const [filterAvailableOnly, setFilterAvailableOnly] = useState<boolean>(false);
  const [filterHypertrophy, setFilterHypertrophy] = useState<boolean>(false);
  const [filterStrength, setFilterStrength] = useState<boolean>(false);
  const [filterHiit, setFilterHiit] = useState<boolean>(false);
  const [filterMobility, setFilterMobility] = useState<boolean>(false);
  const [filterBeginner, setFilterBeginner] = useState<boolean>(false);
  const [filterCompoundOnly, setFilterCompoundOnly] = useState<boolean>(false);

  const ownedEquipmentIds = useMemo(() => {
    return new Set(profile.equipment_inventory || []);
  }, [profile.equipment_inventory]);

  const plateStats = useMemo(() => {
    return calculateTotalPlateWeight(profile.plate_inventory);
  }, [profile.plate_inventory]);

  // Symbiotic Helper: Checks if the user owns all required equipment for an exercise
  const isExerciseAvailable = (ex: ExerciseItem) => {
    if (ownedEquipmentIds.size === 0) {
      return (
        ex.equipment_required === 'bodyweight' ||
        !ex.required_equipment_ids ||
        ex.required_equipment_ids.every((id) => id === 'bodyweight')
      );
    }
    if (ex.required_equipment_ids && ex.required_equipment_ids.length > 0) {
      return ex.required_equipment_ids.every(
        (id) => id === 'bodyweight' || ownedEquipmentIds.has(id)
      );
    }
    return ex.equipment_required === 'bodyweight' || ownedEquipmentIds.has(ex.equipment_required);
  };

  // Stacked filter matching predicate
  const matchesFilters = (ex: ExerciseItem) => {
    if (filterAvailableOnly && !isExerciseAvailable(ex)) return false;
    if (filterHypertrophy && ex.category !== 'hypertrophy') return false;
    if (filterStrength && ex.category !== 'strength') return false;
    if (filterHiit && ex.category !== 'hiit_interval') return false;
    if (filterMobility && ex.category !== 'mobility' && ex.category !== 'warmup') return false;
    if (filterBeginner && ex.difficulty !== 'beginner') return false;
    if (filterCompoundOnly && ex.mechanics !== 'compound') return false;
    return true;
  };

  const activeFiltersCount = [
    filterAvailableOnly,
    filterHypertrophy,
    filterStrength,
    filterHiit,
    filterMobility,
    filterBeginner,
    filterCompoundOnly,
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setFilterAvailableOnly(false);
    setFilterHypertrophy(false);
    setFilterStrength(false);
    setFilterHiit(false);
    setFilterMobility(false);
    setFilterBeginner(false);
    setFilterCompoundOnly(false);
  };

  // Counts of matching & available exercises per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, { matching: number; available: number; total: number }> = {};
    COMPREHENSIVE_EXERCISE_DATABASE.forEach((ex) => {
      const cat = ex.exercise_category || 'chest_pecs';
      if (!counts[cat]) {
        counts[cat] = { matching: 0, available: 0, total: 0 };
      }
      counts[cat].total += 1;
      if (isExerciseAvailable(ex)) {
        counts[cat].available += 1;
      }
      if (matchesFilters(ex)) {
        counts[cat].matching += 1;
      }
    });
    return counts;
  }, [ownedEquipmentIds, filterAvailableOnly, filterHypertrophy, filterStrength, filterHiit, filterMobility, filterBeginner, filterCompoundOnly]);

  // Counts of matching & available exercises per sub-category
  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, { matching: number; available: number; total: number }> = {};
    COMPREHENSIVE_EXERCISE_DATABASE.forEach((ex) => {
      const sub = ex.sub_category || 'general';
      if (!counts[sub]) {
        counts[sub] = { matching: 0, available: 0, total: 0 };
      }
      counts[sub].total += 1;
      if (isExerciseAvailable(ex)) {
        counts[sub].available += 1;
      }
      if (matchesFilters(ex)) {
        counts[sub].matching += 1;
      }
    });
    return counts;
  }, [ownedEquipmentIds, filterAvailableOnly, filterHypertrophy, filterStrength, filterHiit, filterMobility, filterBeginner, filterCompoundOnly]);

  // Filtered exercises for Tier 3 display
  const filteredExercises = useMemo(() => {
    return COMPREHENSIVE_EXERCISE_DATABASE.filter((ex) => {
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscle = ex.target_muscle.toLowerCase().includes(q);
        const matchesCat = (ex.exercise_category || '').toLowerCase().includes(q);
        const matchesSub = (ex.sub_category || '').toLowerCase().includes(q);
        const matchesEq = ex.equipment_required.toLowerCase().includes(q);
        if (!matchesName && !matchesMuscle && !matchesCat && !matchesSub && !matchesEq) return false;
      } else {
        if (selectedCategory && ex.exercise_category !== selectedCategory) return false;
        if (selectedSubCategory && selectedSubCategory !== 'all' && ex.sub_category !== selectedSubCategory) return false;
      }

      if (!matchesFilters(ex)) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedSubCategory, filterAvailableOnly, filterHypertrophy, filterStrength, filterHiit, filterMobility, filterBeginner, filterCompoundOnly, ownedEquipmentIds]);

  const activeCategoryMeta = EXERCISE_CATEGORIES.find((c) => c.id === selectedCategory);
  const activeSubCategoryMeta = EXERCISE_SUB_CATEGORIES.find((s) => s.id === selectedSubCategory);
  const currentSubCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return EXERCISE_SUB_CATEGORIES.filter((sub) => sub.parentId === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner with Stackable Filters & Equipment Link */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                🏋️‍♂️ COMPLETE EXERCISE DATABASE
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {COMPREHENSIVE_EXERCISE_DATABASE.length.toLocaleString()} Verified Movements
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Movement Library & Exercise Biomechanics
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
              {isSimple
                ? 'Browse hundreds of exercises by muscle group or search by movement name. Toggle "Available in My Gym" to only see what you have gear for.'
                : 'Expansive multi-tier exercise database with equipment prerequisites, movement planes, hypertrophy rep schemes and execution cues.'}
            </p>
          </div>

          {/* Active Equipment Symbiotic Status Indicator */}
          <div className="p-3.5 rounded-2xl bg-surface-200/90 border border-surface-border flex items-center justify-between gap-4 self-start lg:self-auto">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Gym Inventory Status</div>
              <div className="text-xs font-semibold text-zinc-200 mt-0.5">
                {ownedEquipmentIds.size === 0 ? (
                  <span className="text-amber-400 font-bold">0 Items Selected (Bodyweight Mode)</span>
                ) : (
                  <span className="text-emerald-400 font-bold font-mono">
                    {ownedEquipmentIds.size} Equipment Items Selected
                  </span>
                )}
              </div>
            </div>

            {onNavigateToEquipment && (
              <button
                type="button"
                onClick={onNavigateToEquipment}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-300 hover:bg-surface-border border border-surface-border text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
              >
                <span>Edit Gym Gear</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Stackable Filter Toggles Row */}
        <div className="pt-2 border-t border-surface-border/60 flex flex-wrap items-center gap-2">
          {/* 1. Available in My Gym Only */}
          <button
            type="button"
            id="filter-btn-available-only"
            onClick={() => setFilterAvailableOnly((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              filterAvailableOnly
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-glow border border-emerald-400'
                : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300 hover:text-white'
            }`}
          >
            <span>🟢 Available in My Gym</span>
            {filterAvailableOnly && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* 2. Hypertrophy */}
          <button
            type="button"
            id="filter-btn-hypertrophy"
            onClick={() => setFilterHypertrophy((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              filterHypertrophy
                ? 'bg-brand-500 text-zinc-950 font-bold shadow-glow border border-brand-400'
                : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300 hover:text-white'
            }`}
          >
            <span>🏋️ Hypertrophy (8-12 Reps)</span>
            {filterHypertrophy && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* 3. Strength */}
          <button
            type="button"
            id="filter-btn-strength"
            onClick={() => setFilterStrength((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              filterStrength
                ? 'bg-purple-500 text-white font-bold shadow-glow border border-purple-400'
                : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300 hover:text-white'
            }`}
          >
            <span>⚡ Strength (3-6 Reps)</span>
            {filterStrength && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* 4. HIIT Interval */}
          <button
            type="button"
            id="filter-btn-hiit"
            onClick={() => setFilterHiit((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              filterHiit
                ? 'bg-rose-500 text-white font-bold shadow-glow border border-rose-400'
                : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300 hover:text-white'
            }`}
          >
            <span>⏱️ HIIT Conditioning</span>
            {filterHiit && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* 5. Mobility */}
          <button
            type="button"
            id="filter-btn-mobility"
            onClick={() => setFilterMobility((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              filterMobility
                ? 'bg-teal-500 text-zinc-950 font-bold shadow-glow border border-teal-400'
                : 'bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-300 hover:text-white'
            }`}
          >
            <span>🧘 Mobility & Warmup</span>
            {filterMobility && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* More Filters Trigger (Opens Modal) */}
          <button
            type="button"
            id="filter-btn-all-exercise-matrix"
            onClick={() => setShowFilterMatrixModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-zinc-200 transition-all cursor-pointer active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
            <span>All Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>

          {/* Quick Reset */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-200 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Global Instant Search */}
        <div className="relative">
          <Search className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-brand-400 animate-pulse' : 'text-zinc-400'}`} />
          <input
            type="text"
            id="exercise-global-search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search exercises by name, muscle (e.g. bench press, pull-ups, squats, lateral raise, deadlift)..."
            className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-surface-100 dark:bg-surface-100 border-2 border-surface-border hover:border-brand-500/40 text-base sm:text-sm font-semibold text-white dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20 transition-all shadow-inner caret-brand-400"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isSearching && (
              <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20 animate-pulse hidden sm:inline">
                Searching...
              </span>
            )}
            {inputValue.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  setSearchQuery('');
                  setVisibleCount(36);
                }}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-surface-300 hover:bg-surface-200 cursor-pointer transition-all active:scale-95 shadow-sm"
                title="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 1: MASTER MUSCLE CATEGORIES (Root Overview)
          ========================================================================= */}
      {!selectedCategory && !selectedSubCategory && searchQuery.trim().length === 0 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 flex-wrap">
              <span>Muscle Groups & Movements</span>
              <span className="text-zinc-600">•</span>
              <span className="text-brand-400 font-mono">{EXERCISE_CATEGORIES.length} Master Groups</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-mono font-semibold">
                {COMPREHENSIVE_EXERCISE_DATABASE.filter(isExerciseAvailable).length} Available in Your Gym
              </span>
            </h3>
            <span className="text-xs text-zinc-500">Select any group to view exercise sub-categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {EXERCISE_CATEGORIES.map((cat) => {
              const counts = categoryCounts[cat.id] || { matching: 0, available: 0, total: 0 };

              return (
                <div
                  key={cat.id}
                  id={`exercise-category-card-${cat.id}`}
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
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {counts.available} in gym
                        </span>
                        <span className="text-xs font-mono px-2 py-1 rounded-full font-medium bg-surface-300/80 text-zinc-400 border border-surface-border/60">
                          {counts.total} total
                        </span>
                      </div>
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
          TIER 2: EXERCISE SUB-CATEGORIES (When a Master Category is Chosen)
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
                {(categoryCounts[selectedCategory]?.available || 0)} of{' '}
                {(categoryCounts[selectedCategory]?.total || 0)} Available in Gym
              </span>
            </div>

            <button
              onClick={() => setSelectedSubCategory('all')}
              className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>View All {(categoryCounts[selectedCategory]?.total || 0)} Exercises in Group</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {currentSubCategories.map((sub) => {
              const counts = subCategoryCounts[sub.id] || { matching: 0, available: 0, total: 0 };

              return (
                <div
                  key={sub.id}
                  id={`exercise-subcategory-card-${sub.id}`}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className="group p-5 rounded-3xl bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between shadow-md cursor-pointer hover:scale-[1.02]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl p-2 rounded-2xl bg-surface-200/80 border border-surface-border/60 group-hover:scale-110 transition-transform">
                        {sub.icon}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {counts.available} in gym
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">
                      {sub.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs text-zinc-400 group-hover:text-brand-400 font-medium">
                    <span>View Exercises</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TIER 3: EXERCISES LIST (When Sub-Category or Global Search is Active)
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
                  <span className="font-bold text-brand-400">All Exercises in Group</span>
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
                {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}
              </span>
            </div>
          </div>

          {/* Empty State */}
          {filteredExercises.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-surface-100/90 border border-surface-border space-y-3">
              <div className="text-4xl">🔍</div>
              <h4 className="text-base font-bold text-zinc-200">No exercises found matching active filters</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try unchecking &ldquo;Available in My Gym&rdquo; or clearing active filters to see all movements.
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 rounded-xl bg-brand-500 text-zinc-950 font-bold text-xs cursor-pointer shadow-glow"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          )}

          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredExercises.slice(0, visibleCount).map((ex) => {
              const isAvailable = isExerciseAvailable(ex);
              const missingGear = (ex.required_equipment_ids || [ex.equipment_required]).filter(
                (id) => id !== 'bodyweight' && !ownedEquipmentIds.has(id)
              );

              return (
                <div
                  key={ex.id}
                  id={`exercise-card-${ex.id}`}
                  className="p-5 rounded-3xl bg-surface-100/90 hover:bg-surface-200/90 border border-surface-border hover:border-brand-500/30 transition-all duration-200 flex flex-col justify-between shadow-md group cursor-pointer"
                  onClick={() => setSelectedExerciseDetail(ex)}
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-brand-300 transition-colors flex items-center gap-1.5">
                          <span>{ex.name}</span>
                          <Info className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-zinc-400">
                          <span className="text-brand-400 uppercase font-bold">{ex.target_muscle}</span>
                          {ex.suggested_sets_reps && (
                            <>
                              <span>•</span>
                              <span>{ex.suggested_sets_reps}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Availability Pill */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border flex-shrink-0 ${
                          isAvailable
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {isAvailable ? '✓ Ready' : 'Needs Gear'}
                      </span>
                    </div>

                    {/* Instructions / Cues */}
                    <p className="text-xs text-zinc-400 mt-3 leading-relaxed line-clamp-2">
                      {ex.instructions || 'Follow biomechanical cues for optimal muscle recruitment and joint safety.'}
                    </p>

                    {/* Equipment Pill */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                      <Dumbbell className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span className="truncate">
                        Required: <strong className="text-zinc-200 capitalize">{ex.equipment_required.replace(/_/g, ' ')}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-400 font-mono capitalize">
                      {ex.category.replace('_', ' ')} • {ex.difficulty}
                    </span>

                    {onSelectExercise ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectExercise(ex);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-500 text-zinc-950 text-xs font-bold shadow-glow hover:bg-brand-400 transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Select</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExerciseDetail(ex);
                        }}
                        className="flex items-center gap-1 text-xs text-brand-400 hover:underline font-semibold"
                      >
                        <span>View Form Technique</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Pagination Control */}
          {filteredExercises.length > visibleCount && (
            <div className="text-center pt-4 pb-2">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 36)}
                className="px-6 py-3 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-bold text-brand-300 hover:text-brand-200 transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Load More Exercises ({filteredExercises.length - visibleCount} remaining)</span>
                <ChevronRight className="w-4 h-4 text-brand-400" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL WINDOW: ALL EXERCISE FILTERS MATRIX
          ========================================================================= */}
      {showFilterMatrixModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="w-full max-w-lg rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">Exercise & Movement Filter Matrix</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFilterMatrixModal(false)}
                className="p-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <button
                type="button"
                onClick={() => setFilterAvailableOnly((prev) => !prev)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  filterAvailableOnly
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-zinc-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span>🟢 Available in My Gym Only</span>
                    {filterAvailableOnly && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Filter strictly to equipment you own</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFilterHypertrophy((prev) => !prev)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  filterHypertrophy
                    ? 'bg-brand-500/20 border-brand-500/40 text-brand-200'
                    : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-zinc-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span>🏋️ Hypertrophy Protocols</span>
                    {filterHypertrophy && <Check className="w-3.5 h-3.5 text-brand-400 stroke-[3]" />}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Moderate rep schemes (8-12 reps) for muscle growth</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFilterStrength((prev) => !prev)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  filterStrength
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                    : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-zinc-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span>⚡ Heavy Strength Protocols</span>
                    {filterStrength && <Check className="w-3.5 h-3.5 text-purple-400 stroke-[3]" />}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Heavy compound overloads (3-6 reps)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFilterCompoundOnly((prev) => !prev)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  filterCompoundOnly
                    ? 'bg-orange-500/20 border-orange-500/40 text-orange-200'
                    : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-zinc-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span>🏗️ Multi-Joint Compound Movements</span>
                    {filterCompoundOnly && <Check className="w-3.5 h-3.5 text-orange-400 stroke-[3]" />}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Squats, deadlifts, presses, rows & dips</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFilterBeginner((prev) => !prev)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  filterBeginner
                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-200'
                    : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-zinc-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span>🛡️ Beginner Friendly Movements</span>
                    {filterBeginner && <Check className="w-3.5 h-3.5 text-teal-400 stroke-[3]" />}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Simple mechanics with minimal spinal compression</div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-border gap-3 text-xs">
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2.5 rounded-xl bg-surface-200 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-300 font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>

              <button
                type="button"
                onClick={() => setShowFilterMatrixModal(false)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 font-bold shadow-glow active:scale-95 cursor-pointer"
              >
                <span>Apply Filters ({filteredExercises.length} Movements)</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL WINDOW: EXERCISE FORM TECHNIQUE & VIDEO DEMONSTRATION
          ========================================================================= */}
      {selectedExerciseDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="w-full max-w-lg rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between pb-3 border-b border-surface-border">
              <div>
                <span className="text-xs font-mono text-brand-400 uppercase font-bold">
                  {selectedExerciseDetail.target_muscle} / {selectedExerciseDetail.sub_category || 'General'}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedExerciseDetail.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Mechanics: {selectedExerciseDetail.mechanics || 'Compound'} • Level: {selectedExerciseDetail.difficulty}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExerciseDetail(null)}
                className="p-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Demonstration Mock Player */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-surface-border flex items-center justify-center group">
              <img
                src={selectedExerciseDetail.video_url_mock}
                alt={selectedExerciseDetail.name}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-brand-500/90 text-zinc-950 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-zinc-950 ml-1" />
                </div>
              </div>
              <span className="absolute bottom-3 left-3 text-xs font-mono text-white/90 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm">
                4K Form Technique Loop
              </span>
            </div>

            {/* Execution Cues */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                🔬 Biomechanical Execution Cues:
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-surface-200/80 p-3.5 rounded-2xl border border-surface-border">
                {selectedExerciseDetail.instructions}
              </p>
            </div>

            {/* Required Equipment Badges */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Prerequisite Equipment:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedExerciseDetail.required_equipment_ids || [selectedExerciseDetail.equipment_required]).map((gearId) => {
                  const hasGear = gearId === 'bodyweight' || ownedEquipmentIds.has(gearId);
                  return (
                    <span
                      key={gearId}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1 ${
                        hasGear
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      <span>{hasGear ? '✓' : '⚠️'}</span>
                      <span>{gearId.replace('_', ' ')}</span>
                      {!hasGear && (
                        <button
                          type="button"
                          onClick={() => toggleEquipment(gearId)}
                          className="ml-1 text-[10px] underline hover:text-white cursor-pointer"
                        >
                          (Add)
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Barbell Plate Loading Capacity Indicator */}
            {selectedExerciseDetail.is_barbell_plate_loaded && (
              <div className="p-3.5 rounded-2xl bg-surface-200/90 border border-brand-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                      Barbell Plate Loading Capacity
                    </div>
                    <div className="text-xs font-mono text-brand-300">
                      {plateStats.maxBarbellLbs} lbs Max Safe Load ({plateStats.plateWeightLbs} lbs plates + {plateStats.barWeightLbs} lbs bar)
                    </div>
                  </div>
                </div>

                {onNavigateToEquipment && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedExerciseDetail(null);
                      onNavigateToEquipment();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-bold shadow-glow cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                  >
                    Adjust Plates
                  </button>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedExerciseDetail(null)}
                className="px-4 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              {onSelectExercise && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectExercise(selectedExerciseDetail);
                    setSelectedExerciseDetail(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-zinc-950 font-bold text-xs shadow-glow active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Select for Workout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
