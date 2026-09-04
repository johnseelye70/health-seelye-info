'use client';

import React, { useState, useMemo } from 'react';
import {
  SimpleMovementActivity,
  POPULAR_MOVEMENT_CHOICES,
} from '@/lib/movement-database';
import { getPreMadeActivitiesAsSimpleMovements } from '@/lib/premade-programs';
import {
  X,
  Plus,
  Check,
  Sparkles,
  Flame,
  Clock,
  Footprints,
  Heart,
  ChevronRight,
  Filter,
  Search,
  Dumbbell,
  Award,
} from 'lucide-react';

interface SimpleMovementPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectActivity: (activity: SimpleMovementActivity) => void;
  selectedActivityIds: string[];
  swapTargetId?: string | null;
}

export const SimpleMovementPickerModal: React.FC<SimpleMovementPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectActivity,
  selectedActivityIds,
  swapTargetId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  // Custom activity state
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDuration, setCustomDuration] = useState<number>(20);
  const [customCalories, setCustomCalories] = useState<number>(100);
  const [customSteps, setCustomSteps] = useState<number>(1500);
  const [customIcon, setCustomIcon] = useState<string>('⭐');
  const [customDesc, setCustomDesc] = useState<string>('Personal feel-good movement session.');

  const allAvailableChoices = useMemo(() => {
    const premades = getPreMadeActivitiesAsSimpleMovements();
    return [...POPULAR_MOVEMENT_CHOICES, ...premades];
  }, []);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'premade', label: '🏆 Pre-Made Workouts (42+)' },
    { id: 'walking', label: '🚶 Walking & Steps' },
    { id: 'mobility', label: '🧘 Mobility & Yoga' },
    { id: 'strength', label: '💪 Strength & Tone' },
    { id: 'cardio_fun', label: '🚴 Active Fun & Cardio' },
  ];

  const filteredChoices = allAvailableChoices.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      (selectedCategory === 'premade' && (item.category === 'premade' || item.category_label.toLowerCase().includes('pre-made'))) ||
      (selectedCategory === 'strength' && (item.category === 'strength' || item.category_label.toLowerCase().includes('5x5') || item.category_label.toLowerCase().includes('strength') || item.category_label.toLowerCase().includes('arnold'))) ||
      (selectedCategory === 'mobility' && (item.category === 'mobility' || item.category_label.toLowerCase().includes('tai chi') || item.category_label.toLowerCase().includes('mobility'))) ||
      (selectedCategory === 'cardio_fun' && (item.category === 'cardio_fun' || item.category_label.toLowerCase().includes('crossfit') || item.category_label.toLowerCase().includes('insanity') || item.category_label.toLowerCase().includes('rower')));

    if (!matchesCat) return false;

    if (searchQuery.trim() === '') return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category_label.toLowerCase().includes(q) ||
      (item.benefits && item.benefits.toLowerCase().includes(q))
    );
  });

  const handlePick = (activity: SimpleMovementActivity) => {
    onSelectActivity({
      ...activity,
      completed: false,
    });
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newActivity: SimpleMovementActivity = {
      id: `custom_${Date.now()}`,
      title: customTitle.trim(),
      category: 'custom',
      category_label: 'Custom Activity',
      icon: customIcon || '⭐',
      duration_minutes: Number(customDuration) || 20,
      estimated_calories: Number(customCalories) || 100,
      estimated_steps: Number(customSteps) || 0,
      description: customDesc.trim() || 'Personal feel-good movement session.',
      benefits: 'Custom feel-good active movement designed by you.',
      intensity: 'moderate',
      completed: false,
    };

    onSelectActivity(newActivity);
    setShowCustomForm(false);
    setCustomTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-surface-100 border border-surface-border shadow-2xl overflow-hidden animate-scaleUp">
        {/* Pinned Header */}
        <div className="p-5 sm:p-6 border-b border-surface-border shrink-0 bg-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-accent-coral shadow-glow-coral">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {swapTargetId ? 'Swap Today’s Movement' : 'Choose Today’s Movement'}
              </h2>
              <p className="text-xs text-zinc-500">
                Pick any feel-good activity you enjoy, or create your own.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-foreground hover:bg-surface-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:px-6 border-b border-surface-border shrink-0 bg-surface-100/90 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search all workouts & pre-made programs (P90X, 5x5, CrossFit, Cindy, walk, yoga)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-200 border border-surface-border text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showCustomForm
                  ? 'bg-brand-500 text-white border-brand-500 shadow-glow'
                  : 'bg-surface-200 hover:bg-surface-300 border-surface-border text-foreground'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom Activity</span>
            </button>
          </div>

          {/* Category Tabs */}
          {!showCustomForm && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-accent-coral text-white font-bold shadow-sm'
                      : 'bg-surface-200 text-zinc-500 hover:text-foreground hover:bg-surface-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {showCustomForm ? (
            /* Custom Activity Creator Form */
            <form onSubmit={handleCreateCustom} className="p-5 rounded-2xl bg-surface-200/80 border border-surface-border space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>Create Custom Feel-Good Activity</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="text-xs text-zinc-500 hover:text-foreground underline"
                >
                  Back to Library
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-400">Activity Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 30-Min Golf Range, Kayaking, Tai Chi, Pilates"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-foreground mt-1 text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-400">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-foreground mt-1 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-400">Estimated Active Calories (kcal)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-foreground mt-1 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-400">Estimated Steps (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    value={customSteps}
                    onChange={(e) => setCustomSteps(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-foreground mt-1 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-400">Activity Emoji Icon</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    {['🚶', '🧘', '💪', '🚴', '🏊', '🎾', '💃', '🌿', '⭐'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCustomIcon(emoji)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                          customIcon === emoji
                            ? 'bg-brand-500/20 border border-brand-500 text-white'
                            : 'bg-surface-100 border border-surface-border hover:bg-surface-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-400">Short Note or Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Fun afternoon with friends"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-surface-border text-foreground mt-1 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-300 text-zinc-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow"
                >
                  Add Custom Choice
                </button>
              </div>
            </form>
          ) : (
            /* Movement Activities Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredChoices.map((item) => {
                const isAlreadySelected = selectedActivityIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isAlreadySelected
                        ? 'bg-accent-coral/10 border-accent-coral/40 shadow-sm'
                        : 'bg-surface-200/70 border-surface-border hover:border-accent-coral/40 hover:bg-surface-200'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-foreground leading-tight">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                              {item.category_label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.premade_program_id && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-400" />
                              <span>Pre-Made</span>
                            </span>
                          )}
                          {isAlreadySelected && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-coral/20 text-accent-coral border border-accent-coral/30 shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Metrics Footer & Choose Button */}
                    <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1 font-bold text-foreground">
                          <Clock className="w-3 h-3 text-accent-coral" />
                          {item.duration_minutes}m
                        </span>
                        <span>~{item.estimated_calories} kcal</span>
                        {item.estimated_steps > 0 && (
                          <span>{item.estimated_steps.toLocaleString()} steps</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePick(item)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                          isAlreadySelected
                            ? 'bg-surface-100 hover:bg-surface-300 text-zinc-300 border border-surface-border'
                            : 'bg-accent-coral hover:bg-rose-600 text-white shadow-glow-coral'
                        }`}
                      >
                        {isAlreadySelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-accent-coral" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{swapTargetId ? 'Swap In' : 'Select'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pinned Action Footer */}
        <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 bg-surface-100 flex items-center justify-between text-xs">
          <span className="text-zinc-500">
            {filteredChoices.length} wholesome feel-good activities available
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-foreground font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
