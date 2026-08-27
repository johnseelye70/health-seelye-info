'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useHealth } from '@/context/HealthContext';
import { MASTER_SCHEDULE_TEMPLATES } from '@/lib/schedule-templates';
import { ScheduledDayPlan, ScheduledPlannedMeal, FastingProtocol } from '@/lib/types';
import {
  Calendar,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Dumbbell,
  UtensilsCrossed,
  Timer,
  Droplets,
  Footprints,
  ShoppingCart,
  ChefHat,
  RotateCcw,
  Zap,
  Layers,
  ArrowRight,
  Clock,
  Info,
  CalendarDays,
  ListFilter,
  Check,
} from 'lucide-react';
import { CalendarDatePicker } from '@/components/ui/CalendarDatePicker';

export const RollingSchedulePlanner: React.FC = () => {
  const {
    profile,
    scheduledPlans,
    saveScheduledDayPlan,
    deployMasterScheduleTemplate,
    deleteScheduledDayPlan,
    clearScheduledRange,
    generateGroceryFromScheduledRange,
    experienceMode,
    setActiveTab,
  } = useHealth();

  const isStandard = experienceMode === 'standard' || experienceMode === 'tutorial';

  // Active View Mode: 'horizon_90' | 'calendar_month' | 'week_agenda' | 'template_deployer'
  const [viewMode, setViewMode] = useState<'horizon_90' | 'calendar_month' | 'week_agenda' | 'template_deployer'>('horizon_90');

  // Selected Date for Inline Day Inspector
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  // Current Month Anchor for Calendar View
  const [calendarMonthDate, setCalendarMonthDate] = useState<Date>(() => new Date());

  // Week Offset for Agenda View
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Template Deployment Wizard State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template_5x5_concept2_hybrid');
  const [deployStartDate, setDeployStartDate] = useState<string>(() => {
    // Next upcoming Monday or Today
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? 1 : (8 - day) % 7; // days until next Monday
    const nextMon = new Date(d);
    nextMon.setDate(d.getDate() + (diff === 0 ? 7 : diff));
    const y = nextMon.getFullYear();
    const m = String(nextMon.getMonth() + 1).padStart(2, '0');
    const dayNum = String(nextMon.getDate()).padStart(2, '0');
    return `${y}-${m}-${dayNum}`;
  });
  const [deployDurationWeeks, setDeployDurationWeeks] = useState<number>(12);
  const [preserveCustomOverrides, setPreserveCustomOverrides] = useState<boolean>(true);
  const [deploySuccessToast, setDeploySuccessToast] = useState<string | null>(null);

  // Grocery Requisition Generator State
  const [groceryRangeDays, setGroceryRangeDays] = useState<number>(7);
  const [grocerySuccessToast, setGrocerySuccessToast] = useState<string | null>(null);

  // Day Inspector Edit State
  const activePlan: ScheduledDayPlan | undefined = scheduledPlans[selectedDate];
  const [isEditingDay, setIsEditingDay] = useState<boolean>(false);
  const [editWorkoutTitle, setEditWorkoutTitle] = useState<string>('');
  const [editWorkoutCategory, setEditWorkoutCategory] = useState<string>('strength_5x5');
  const [editTargetCalories, setEditTargetCalories] = useState<number>(2000);
  const [editTargetProtein, setEditTargetProtein] = useState<number>(160);
  const [editTargetCarbs, setEditTargetCarbs] = useState<number>(200);
  const [editTargetFat, setEditTargetFat] = useState<number>(65);
  const [editFastingProtocol, setEditFastingProtocol] = useState<FastingProtocol>('16_8');
  const [editWaterOz, setEditWaterOz] = useState<number>(100);
  const [editSteps, setEditSteps] = useState<number>(10000);
  const [editIsGroceryDay, setEditIsGroceryDay] = useState<boolean>(false);
  const [editIsBatchPrepDay, setEditIsBatchPrepDay] = useState<boolean>(false);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editMeals, setEditMeals] = useState<ScheduledPlannedMeal[]>([]);
  const [newMealName, setNewMealName] = useState<string>('');
  const [newMealType, setNewMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [newMealCals, setNewMealCals] = useState<number>(500);

  // Helper to open edit mode with current day's values
  const startEditingCurrentDay = useCallback(() => {
    if (activePlan) {
      setEditWorkoutTitle(activePlan.workout_title || 'Custom Workout');
      setEditWorkoutCategory(activePlan.workout_category || 'strength_5x5');
      setEditTargetCalories(activePlan.target_calories || profile.daily_calorie_target || 2000);
      setEditTargetProtein(activePlan.target_protein_g || profile.protein_target_g || 160);
      setEditTargetCarbs(activePlan.target_carbs_g || profile.carb_target_g || 200);
      setEditTargetFat(activePlan.target_fat_g || profile.fat_target_g || 65);
      setEditFastingProtocol(activePlan.fasting_protocol || profile.fasting_protocol || '16_8');
      setEditWaterOz(activePlan.water_goal_oz || 100);
      setEditSteps(activePlan.target_steps || 10000);
      setEditIsGroceryDay(Boolean(activePlan.is_grocery_shopping_day));
      setEditIsBatchPrepDay(Boolean(activePlan.is_batch_prep_day));
      setEditNotes(activePlan.day_notes || '');
      setEditMeals(activePlan.planned_meals || []);
    } else {
      setEditWorkoutTitle('Custom Training Session');
      setEditWorkoutCategory('strength_5x5');
      setEditTargetCalories(profile.daily_calorie_target || 2000);
      setEditTargetProtein(profile.protein_target_g || 160);
      setEditTargetCarbs(profile.carb_target_g || 200);
      setEditTargetFat(profile.fat_target_g || 65);
      setEditFastingProtocol(profile.fasting_protocol || '16_8');
      setEditWaterOz(100);
      setEditSteps(10000);
      setEditIsGroceryDay(false);
      setEditIsBatchPrepDay(false);
      setEditNotes('');
      setEditMeals([]);
    }
    setIsEditingDay(true);
  }, [activePlan, profile]);

  // Handle Save Day Edits
  const handleSaveDayEdits = () => {
    saveScheduledDayPlan(selectedDate, {
      workout_title: editWorkoutTitle,
      workout_category: editWorkoutCategory,
      target_calories: editTargetCalories,
      target_protein_g: editTargetProtein,
      target_carbs_g: editTargetCarbs,
      target_fat_g: editTargetFat,
      fasting_protocol: editFastingProtocol,
      water_goal_oz: editWaterOz,
      target_steps: editSteps,
      is_grocery_shopping_day: editIsGroceryDay,
      is_batch_prep_day: editIsBatchPrepDay,
      day_notes: editNotes,
      planned_meals: editMeals,
    });
    setIsEditingDay(false);
  };

  // Add meal to edit list
  const handleAddMealToEdit = () => {
    if (!newMealName.trim()) return;
    const newMeal: ScheduledPlannedMeal = {
      id: `pm-custom-${Date.now()}`,
      meal_type: newMealType,
      meal_title: newMealName.trim(),
      calories: newMealCals,
      protein_g: Math.round((newMealCals * 0.3) / 4),
      carbs_g: Math.round((newMealCals * 0.4) / 4),
      fat_g: Math.round((newMealCals * 0.3) / 9),
      is_batch_prep: editIsBatchPrepDay && newMealType === 'lunch',
    };
    setEditMeals((prev) => [...prev, newMeal]);
    setNewMealName('');
    setNewMealCals(500);
  };

  const handleRemoveMealFromEdit = (id: string) => {
    setEditMeals((prev) => prev.filter((m) => m.id !== id));
  };

  // Handle Master Template Deployment
  const handleDeployTemplate = () => {
    deployMasterScheduleTemplate(selectedTemplateId, deployStartDate, deployDurationWeeks, preserveCustomOverrides);
    setDeploySuccessToast(
      `Successfully scheduled ${deployDurationWeeks} weeks (${deployDurationWeeks * 7} days) starting ${deployStartDate}!`
    );
    setTimeout(() => {
      setDeploySuccessToast(null);
      setViewMode('horizon_90');
    }, 2500);
  };

  // Handle Forward Grocery Requisition Generation
  const handleGenerateGrocery = () => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + groceryRangeDays);

    const fmt = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const count = generateGroceryFromScheduledRange(fmt(start), fmt(end));
    setGrocerySuccessToast(
      `Added ${count > 0 ? count : 'planned'} ingredients across the next ${groceryRangeDays} days directly to your shopping list!`
    );
    setTimeout(() => setGrocerySuccessToast(null), 3000);
  };

  // 90-Day Rolling Horizon Days Array
  const rolling90Days = useMemo(() => {
    const days: { dateStr: string; dateObj: Date; dayName: string; dayNum: number; plan?: ScheduledDayPlan }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 90; i++) {
      const curr = new Date(today);
      curr.setDate(today.getDate() + i);

      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, '0');
      const d = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      const dayName = curr.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = curr.getDate();

      days.push({
        dateStr,
        dateObj: curr,
        dayName,
        dayNum,
        plan: scheduledPlans[dateStr],
      });
    }
    return days;
  }, [scheduledPlans]);

  // Current Calendar Month Days Matrix
  const monthCalendarData = useMemo(() => {
    const year = calendarMonthDate.getFullYear();
    const month = calendarMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
    const totalDays = lastDayOfMonth.getDate();

    const cells: ({ dateStr: string; dayNum: number; isCurrentMonth: boolean; plan?: ScheduledDayPlan } | null)[] = [];

    // Pad leading days
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(null);
    }

    // Fill days
    for (let d = 1; d <= totalDays; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      cells.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        plan: scheduledPlans[dateStr],
      });
    }

    return cells;
  }, [calendarMonthDate, scheduledPlans]);

  // Weekly Agenda Days Array
  const weeklyAgendaDays = useMemo(() => {
    const days: { dateStr: string; dateObj: Date; dayName: string; dayNum: number; plan?: ScheduledDayPlan }[] = [];
    const base = new Date();
    base.setDate(base.getDate() + weekOffset * 7);

    // Find start of week (Sunday or Monday)
    const currentDay = base.getDay();
    const diff = base.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Monday start
    const monday = new Date(base.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${dayNum}`;

      days.push({
        dateStr,
        dateObj: d,
        dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
        dayNum: d.getDate(),
        plan: scheduledPlans[dateStr],
      });
    }
    return days;
  }, [weekOffset, scheduledPlans]);

  // Today Date String
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const totalScheduledDaysCount = Object.keys(scheduledPlans).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-100 via-surface-100 to-surface-50 border border-surface-border p-6 md:p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                <span>ROLLING 90-DAY MASTER SCHEDULE & PLANNER</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-surface-200 border border-surface-border text-brand-400">
                {totalScheduledDaysCount} Days Planned
              </span>
              <span className="text-zinc-500 text-xs hidden sm:inline">•</span>
              <span className="text-zinc-400 text-xs font-mono">
                {isStandard ? 'Intuitive Multi-Week Rhythm' : 'Periodized Barbell, Concept2 & Macro Forward Engine'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Forward Master Schedule
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Plan out your workouts, target macros, meals, 16:8 fasting windows, and grocery restocking up to 90 days in advance. Every single day remains 100% customizable as your life happens.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setViewMode('template_deployer')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Deploy 90-Day Master Template</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateGrocery}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground text-xs font-bold transition-all active:scale-95 cursor-pointer"
              title="Generate shopping list for upcoming planned meals"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span>Sync Next {groceryRangeDays} Days to Grocery</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Toasts */}
      {deploySuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{deploySuccessToast}</span>
        </div>
      )}
      {grocerySuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <ShoppingCart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{grocerySuccessToast}</span>
        </div>
      )}

      {/* View Switcher Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-surface-200/80 border border-surface-border">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setViewMode('horizon_90')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'horizon_90'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-400 hover:text-foreground hover:bg-surface-300/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>90-Day Rolling Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('calendar_month')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'calendar_month'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-400 hover:text-foreground hover:bg-surface-300/50'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Month Calendar Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('week_agenda')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'week_agenda'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-400 hover:text-foreground hover:bg-surface-300/50'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Weekly Detailed Agenda</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('template_deployer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'template_deployer'
                ? 'bg-brand-500 text-zinc-950 shadow-glow'
                : 'text-zinc-400 hover:text-foreground hover:bg-surface-300/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Master Templates</span>
          </button>
        </div>

        {/* Fast Date Picker Dropdown & Jump to Today Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-48">
            <CalendarDatePicker
              value={selectedDate}
              onChange={(d) => {
                setSelectedDate(d);
                setIsEditingDay(false);
              }}
              quickPicks={true}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedDate(todayStr);
              setCalendarMonthDate(new Date());
              setWeekOffset(0);
            }}
            className="px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-xs text-brand-400 font-semibold transition-all cursor-pointer whitespace-nowrap"
          >
            Today
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: ROLLING 90-DAY HORIZON TIMELINE ================= */}
      {viewMode === 'horizon_90' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>Showing next 90 days rolling forward from today</span>
            <span className="text-brand-400 font-semibold">Click any day to inspect & customize</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {rolling90Days.map((item, idx) => {
              const isSelected = item.dateStr === selectedDate;
              const isToday = item.dateStr === todayStr;
              const hasPlan = Boolean(item.plan);
              const isCustom = item.plan?.is_custom_override;

              return (
                <div
                  key={item.dateStr}
                  onClick={() => {
                    setSelectedDate(item.dateStr);
                    setIsEditingDay(false);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] relative ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500 shadow-glow'
                      : isToday
                      ? 'bg-surface-100 border-brand-500/50 hover:border-brand-500'
                      : hasPlan
                      ? 'bg-surface-100/90 border-surface-border hover:border-zinc-600'
                      : 'bg-surface-200/40 border-surface-border/60 hover:border-zinc-700 opacity-60'
                  }`}
                >
                  {/* Top Day Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase">{item.dayName}</span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
                      )}
                    </div>
                    <span className={`text-xs font-mono font-bold ${isToday ? 'text-brand-400' : 'text-foreground'}`}>
                      {item.dayNum}
                    </span>
                  </div>

                  {/* Day Content Badges */}
                  <div className="my-1.5 space-y-1">
                    {hasPlan ? (
                      <>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-200 truncate">
                          <Dumbbell className="w-3 h-3 text-coral-400 flex-shrink-0" />
                          <span className="truncate">{item.plan?.workout_title || 'Rest'}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                          <UtensilsCrossed className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />
                          <span>{item.plan?.target_calories || profile.daily_calorie_target} kcal</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-[10px] text-zinc-600 italic">No plan set</span>
                    )}
                  </div>

                  {/* Bottom Flags */}
                  <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-surface-border/40 text-[9px]">
                    {item.plan?.is_grocery_shopping_day && (
                      <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">🛒 Shop</span>
                    )}
                    {item.plan?.is_batch_prep_day && (
                      <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">🍳 Prep</span>
                    )}
                    {isCustom && (
                      <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">✏️ Edit</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: MONTHLY CALENDAR GRID ================= */}
      {viewMode === 'calendar_month' && (
        <div className="space-y-4 rounded-3xl bg-surface-100/90 border border-surface-border p-6 backdrop-blur-xl">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-foreground">
                {calendarMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const prev = new Date(calendarMonthDate);
                  prev.setMonth(prev.getMonth() - 1);
                  setCalendarMonthDate(prev);
                }}
                className="p-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = new Date(calendarMonthDate);
                  next.setMonth(next.getMonth() + 1);
                  setCalendarMonthDate(next);
                }}
                className="p-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-400 uppercase py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Cells Grid */}
          <div className="grid grid-cols-7 gap-2">
            {monthCalendarData.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="p-2 min-h-[90px] rounded-2xl bg-surface-200/20 border border-transparent"></div>;
              }

              const isSelected = cell.dateStr === selectedDate;
              const isToday = cell.dateStr === todayStr;
              const hasPlan = Boolean(cell.plan);

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => {
                    setSelectedDate(cell.dateStr);
                    setIsEditingDay(false);
                  }}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[95px] ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500 shadow-glow'
                      : isToday
                      ? 'bg-surface-200 border-brand-500/50'
                      : hasPlan
                      ? 'bg-surface-200/60 border-surface-border hover:border-zinc-600'
                      : 'bg-surface-300/30 border-surface-border/40 hover:border-zinc-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isToday ? 'text-brand-400' : 'text-foreground'}`}>
                      {cell.dayNum}
                    </span>
                    {cell.plan?.is_custom_override && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Customized Day"></span>
                    )}
                  </div>

                  <div className="my-1 text-[11px] truncate">
                    {cell.plan?.workout_title ? (
                      <span className="text-zinc-200 font-semibold truncate block">{cell.plan.workout_title}</span>
                    ) : (
                      <span className="text-zinc-600 italic text-[10px]">Rest</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{cell.plan?.target_calories ? `${cell.plan.target_calories}k` : '—'}</span>
                    {cell.plan?.is_grocery_shopping_day && <span>🛒</span>}
                    {cell.plan?.is_batch_prep_day && <span>🍳</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 3: WEEKLY DETAILED AGENDA ================= */}
      {viewMode === 'week_agenda' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-100 border border-surface-border">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="p-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-foreground">
                {weekOffset === 0 ? 'Current Week' : weekOffset > 0 ? `+${weekOffset} Weeks Ahead` : `${weekOffset} Weeks Ago`}
              </span>
              <button
                type="button"
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="p-2 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-foreground transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="text-xs text-brand-400 hover:underline font-semibold"
            >
              Reset to This Week
            </button>
          </div>

          <div className="space-y-3">
            {weeklyAgendaDays.map((day) => {
              const isSelected = day.dateStr === selectedDate;
              const isToday = day.dateStr === todayStr;

              return (
                <div
                  key={day.dateStr}
                  onClick={() => {
                    setSelectedDate(day.dateStr);
                    setIsEditingDay(false);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-500/10 border-brand-500 shadow-glow'
                      : isToday
                      ? 'bg-surface-100 border-brand-500/40'
                      : 'bg-surface-100/90 border-surface-border hover:border-zinc-600'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono ${
                        isToday ? 'bg-brand-500 text-zinc-950 font-black' : 'bg-surface-200 text-foreground font-bold'
                      }`}>
                        <span className="text-[10px] uppercase leading-tight">{day.dayName.slice(0, 3)}</span>
                        <span className="text-base leading-tight">{day.dayNum}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-foreground">
                            {day.plan?.workout_title || 'Rest / Recovery Day'}
                          </h3>
                          {day.plan?.is_custom_override && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                              Customized
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {day.plan?.day_notes || 'Standard daily nutrition and recovery'}
                        </p>
                      </div>
                    </div>

                    {/* Metrics Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-xl bg-surface-200 border border-surface-border flex items-center gap-1.5 text-zinc-300">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                        <span>{day.plan?.target_calories || profile.daily_calorie_target} kcal</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-xl bg-surface-200 border border-surface-border flex items-center gap-1.5 text-zinc-300">
                        <Timer className="w-3.5 h-3.5 text-purple-400" />
                        <span>{day.plan?.fasting_protocol || '16:8'} Fast</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-xl bg-surface-200 border border-surface-border flex items-center gap-1.5 text-zinc-300">
                        <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{(day.plan?.target_steps || 10000).toLocaleString()} steps</span>
                      </span>

                      {day.plan?.is_grocery_shopping_day && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                          🛒 Grocery Day
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 4: MASTER TEMPLATE DEPLOYMENT WIZARD ================= */}
      {viewMode === 'template_deployer' && (
        <div className="space-y-6 rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl">
          <div className="border-b border-surface-border pb-4">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              MULTI-WEEK PROGRAM STAGING
            </span>
            <h2 className="text-xl md:text-2xl font-black text-foreground mt-2">
              Deploy 90-Day Master Training & Nutrition Blueprint
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Select a pre-engineered master template below to map out your upcoming 4, 8, or 12 weeks of training, nutrition, fasting, and grocery schedules.
            </p>
          </div>

          {/* Template Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MASTER_SCHEDULE_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500 shadow-glow'
                      : 'bg-surface-200/60 border-surface-border hover:border-zinc-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{tmpl.icon}</span>
                      <h3 className="font-bold text-sm text-foreground">{tmpl.title}</h3>
                    </div>
                    <p className="text-xs text-brand-400 font-semibold mb-2">{tmpl.subtitle}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{tmpl.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-zinc-400">
                    <span>Duration: <strong>{tmpl.recommended_duration_weeks} Weeks</strong></span>
                    <span className="text-brand-400 font-bold">{isSelected ? '✓ Selected' : 'Select'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deployment Settings */}
          <div className="p-5 rounded-2xl bg-surface-200/60 border border-surface-border space-y-4">
            <h3 className="text-sm font-bold text-foreground">Deployment Parameters</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Start Date */}
              <div>
                <CalendarDatePicker
                  value={deployStartDate}
                  onChange={setDeployStartDate}
                  label="Start Date"
                />
              </div>

              {/* Duration Weeks */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-semibold">Duration (Weeks)</label>
                <select
                  value={deployDurationWeeks}
                  onChange={(e) => setDeployDurationWeeks(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-foreground text-xs font-semibold focus:outline-none focus:border-brand-500"
                >
                  <option value={4}>4 Weeks (1 Month Trial)</option>
                  <option value={8}>8 Weeks (2 Months Phase)</option>
                  <option value={12}>12 Weeks (90-Day Full Transformation)</option>
                </select>
              </div>

              {/* Preserve Custom Edits Toggle */}
              <div className="flex flex-col justify-center">
                <label className="text-xs text-zinc-400 block mb-1 font-semibold">Preserve Custom Day Edits</label>
                <button
                  type="button"
                  onClick={() => setPreserveCustomOverrides(!preserveCustomOverrides)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-xs text-left transition-all"
                >
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                    preserveCustomOverrides ? 'bg-brand-500 text-zinc-950' : 'bg-surface-300 text-zinc-400'
                  }`}>
                    {preserveCustomOverrides ? '✓' : ''}
                  </span>
                  <span className="text-zinc-300">Don't overwrite my manual edits</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDeployTemplate}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-teal hover:from-brand-600 hover:to-accent-teal/90 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 cursor-pointer"
              >
                🚀 Deploy {deployDurationWeeks}-Week Schedule Starting {deployStartDate}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INLINE DAY INSPECTOR & LIVE CUSTOMIZER ================= */}
      <div className="rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">
                {selectedDate}
              </span>
              {selectedDate === todayStr && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Today's Active Plan
                </span>
              )}
              {activePlan?.is_custom_override && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Customized Override
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingDay ? (
              <button
                type="button"
                onClick={startEditingCurrentDay}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-500 hover:bg-brand-600 text-zinc-950 text-xs font-bold transition-all shadow-glow cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize This Day</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveDayEdits}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold transition-all shadow-glow cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Day Plan</span>
              </button>
            )}

            {activePlan && (
              <button
                type="button"
                onClick={() => deleteScheduledDayPlan(selectedDate)}
                className="p-2 rounded-xl bg-surface-200 hover:bg-red-500/20 border border-surface-border text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
                title="Clear day plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Day Inspector Content View / Edit Mode */}
        {!isEditingDay ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: Fitness & Training Plan */}
            <div className="p-5 rounded-2xl bg-surface-200/60 border border-surface-border space-y-3">
              <div className="flex items-center gap-2 text-coral-400 font-bold text-xs">
                <Dumbbell className="w-4 h-4" />
                <span>FITNESS & MOVEMENT</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {activePlan?.workout_title || 'Rest & Recovery'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Target Steps: <strong className="text-foreground font-mono">{(activePlan?.target_steps || 10000).toLocaleString()}</strong>
                </p>
              </div>

              {activePlan?.exercises && activePlan.exercises.length > 0 && (
                <div className="pt-2 border-t border-surface-border/60 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Scheduled Exercises:</span>
                  {activePlan.exercises.map((ex, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-surface-100/60 text-xs flex items-center justify-between">
                      <span className="font-semibold text-zinc-200">{ex.name}</span>
                      <span className="text-[11px] text-brand-400 font-mono">{ex.suggested_sets} × {ex.suggested_reps}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Nutrition & Planned Meals */}
            <div className="p-5 rounded-2xl bg-surface-200/60 border border-surface-border space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <UtensilsCrossed className="w-4 h-4" />
                <span>NUTRITION & MACROS</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground font-mono">
                  {activePlan?.target_calories || profile.daily_calorie_target} kcal
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  P: <strong className="text-foreground">{activePlan?.target_protein_g || profile.protein_target_g}g</strong> • 
                  C: <strong className="text-foreground">{activePlan?.target_carbs_g || profile.carb_target_g}g</strong> • 
                  F: <strong className="text-foreground">{activePlan?.target_fat_g || profile.fat_target_g}g</strong>
                </p>
              </div>

              {activePlan?.planned_meals && activePlan.planned_meals.length > 0 ? (
                <div className="pt-2 border-t border-surface-border/60 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Planned Plates:</span>
                  {activePlan.planned_meals.map((meal) => (
                    <div key={meal.id} className="p-2 rounded-xl bg-surface-100/60 text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 block">{meal.meal_type}</span>
                        <span className="font-semibold text-zinc-200">{meal.meal_title}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">{meal.calories} kcal</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic pt-2">No specific meal plates logged.</p>
              )}
            </div>

            {/* Column 3: Fasting, Hydration & Logistics */}
            <div className="p-5 rounded-2xl bg-surface-200/60 border border-surface-border space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                <Timer className="w-4 h-4" />
                <span>FASTING & LOGISTICS</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-100/60">
                  <span className="text-zinc-400">Fasting Protocol:</span>
                  <span className="font-bold text-foreground font-mono">{activePlan?.fasting_protocol || '16_8'}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-100/60">
                  <span className="text-zinc-400">Target Water:</span>
                  <span className="font-bold text-foreground font-mono">{activePlan?.water_goal_oz || 100} oz</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-100/60">
                  <span className="text-zinc-400">Grocery Shopping:</span>
                  <span className={activePlan?.is_grocery_shopping_day ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                    {activePlan?.is_grocery_shopping_day ? '🛒 Yes (Designated Day)' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-100/60">
                  <span className="text-zinc-400">Batch Meal Prep:</span>
                  <span className={activePlan?.is_batch_prep_day ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                    {activePlan?.is_batch_prep_day ? '🍳 Yes (Cook Ahead)' : 'No'}
                  </span>
                </div>
              </div>

              {activePlan?.day_notes && (
                <div className="pt-2 border-t border-surface-border/60">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Day Notes:</span>
                  <p className="text-xs text-zinc-300 mt-1 italic">{activePlan.day_notes}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= EDITING FORM MODE ================= */
          <div className="p-6 rounded-2xl bg-surface-200/80 border border-surface-border space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-foreground">Customize Plan for {selectedDate}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workout Title */}
              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">Workout Title</label>
                <input
                  type="text"
                  value={editWorkoutTitle}
                  onChange={(e) => setEditWorkoutTitle(e.target.value)}
                  placeholder="e.g. StrongLifts 5×5 Workout A, Concept2 Pete Plan"
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-foreground text-xs font-semibold focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Target Calories */}
              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">Target Calories (kcal)</label>
                <input
                  type="number"
                  value={editTargetCalories}
                  onChange={(e) => setEditTargetCalories(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-foreground text-xs font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Fasting Protocol */}
              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">Fasting Window</label>
                <select
                  value={editFastingProtocol}
                  onChange={(e) => setEditFastingProtocol(e.target.value as FastingProtocol)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-foreground text-xs font-semibold focus:outline-none focus:border-brand-500"
                >
                  <option value="16_8">16:8 LeanGains (12:00 PM – 8:00 PM)</option>
                  <option value="14_10">14:10 Gentle Circadian</option>
                  <option value="18_6">18:6 Fasting</option>
                  <option value="20_4">20:4 Warrior</option>
                  <option value="23_1_omad">23:1 OMAD</option>
                  <option value="standard_3_meal">Standard 3-Meal (No Fasting)</option>
                </select>
              </div>

              {/* Step Goal */}
              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">Target Steps</label>
                <input
                  type="number"
                  value={editSteps}
                  onChange={(e) => setEditSteps(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-foreground text-xs font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Checkbox Flags */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editIsGroceryDay}
                  onChange={(e) => setEditIsGroceryDay(e.target.checked)}
                  className="w-4 h-4 rounded bg-surface-100 border-surface-border text-brand-500"
                />
                <span>🛒 Mark as Grocery Shopping Day</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editIsBatchPrepDay}
                  onChange={(e) => setEditIsBatchPrepDay(e.target.checked)}
                  className="w-4 h-4 rounded bg-surface-100 border-surface-border text-brand-500"
                />
                <span>🍳 Mark as Batch Meal Prep Day</span>
              </label>
            </div>

            {/* Day Notes */}
            <div>
              <label className="text-xs text-zinc-400 font-semibold block mb-1">Day Notes / Reminders</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="e.g. Traveling for work, hotel gym dumbbell workout, heavy squat PR attempt"
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-surface-border text-foreground text-xs focus:outline-none focus:border-brand-500"
              ></textarea>
            </div>

            {/* Planned Meals Builder */}
            <div className="space-y-3 pt-2 border-t border-surface-border">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Planned Meals for this Day</h4>

              {editMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-100 border border-surface-border text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">{meal.meal_type}</span>
                    <span className="font-semibold text-foreground">{meal.meal_title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 font-mono">{meal.calories} kcal</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMealFromEdit(meal.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Meal Inputs */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-surface-100/50 border border-surface-border">
                <select
                  value={newMealType}
                  onChange={(e) => setNewMealType(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-200 border border-surface-border text-xs text-foreground font-semibold"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>

                <input
                  type="text"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  placeholder="Meal or plate name..."
                  className="flex-1 min-w-[150px] px-2.5 py-1.5 rounded-lg bg-surface-200 border border-surface-border text-xs text-foreground"
                />

                <input
                  type="number"
                  value={newMealCals}
                  onChange={(e) => setNewMealCals(parseInt(e.target.value, 10) || 0)}
                  placeholder="Calories"
                  className="w-20 px-2.5 py-1.5 rounded-lg bg-surface-200 border border-surface-border text-xs text-foreground font-mono"
                />

                <button
                  type="button"
                  onClick={handleAddMealToEdit}
                  className="px-3 py-1.5 rounded-lg bg-brand-500 text-zinc-950 text-xs font-bold shadow-glow cursor-pointer"
                >
                  + Add Meal
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveDayEdits}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-zinc-950 text-xs font-bold shadow-glow transition-all active:scale-95 cursor-pointer"
              >
                Save Changes to {selectedDate}
              </button>

              <button
                type="button"
                onClick={() => setIsEditingDay(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-zinc-400 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
