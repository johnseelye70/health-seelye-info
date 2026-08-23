'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  GroceryItem,
  GroceryDepartment,
  GroceryStoreTag,
  CatalogGroceryItem,
  SmartGrocerySubstitute,
} from '@/lib/types';
import {
  GROCERY_DEPARTMENTS,
  GROCERY_STORE_TAGS,
  DEFAULT_NAMED_LISTS,
  MASTER_GROCERY_DATABASE,
  getSmartSubstitutesForItem,
} from '@/lib/grocery-database';
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
  Search,
  ArrowRightLeft,
  Copy,
  Check,
  Store,
  Boxes,
  Layers,
  ChevronRight,
  Filter,
  ListPlus,
  RefreshCw,
  Home,
  CheckSquare,
  Square,
  Tag,
  Share2,
} from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';

export const GroceryManager: React.FC = () => {
  const {
    groceryList,
    groceryMultiplier,
    setGroceryMultiplier,
    toggleGroceryItem,
    togglePantryStatus,
    addGroceryItem,
    updateGroceryItem,
    swapGroceryItem,
    deleteGroceryItem,
    clearCheckedGrocery,
    syncGroceryFromMealPlan,
    profile,
  } = useHealth();

  // Active Named List
  const [activeListId, setActiveListId] = useState<string>('main');

  // Department & Store Filter
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStoreTag, setSelectedStoreTag] = useState<GroceryStoreTag>('all');
  const [activeViewMode, setActiveViewMode] = useState<'shopping_list' | 'pantry_inventory'>('shopping_list');

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [showCustomItemModal, setShowCustomItemModal] = useState<boolean>(false);
  const [itemToSwap, setItemToSwap] = useState<GroceryItem | null>(null);
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);

  // Custom Item Form
  const [customItemForm, setCustomItemForm] = useState<{
    item_name: string;
    category: 'fresh_weekly' | 'pantry_monthly';
    department: GroceryDepartment;
    quantity: number;
    unit: string;
    store_tag: GroceryStoreTag;
    notes: string;
  }>({
    item_name: '',
    category: 'fresh_weekly',
    department: 'produce',
    quantity: 1,
    unit: 'lbs',
    store_tag: 'supermarket',
    notes: '',
  });

  // Catalog Browser Modal Filter
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('all');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');

  // Items for active list & active view mode
  const currentListItems = useMemo(() => {
    return groceryList.filter((item) => {
      // List check
      const matchesList = !item.list_id || item.list_id === activeListId;
      if (!matchesList) return false;

      // Pantry vs Shopping Mode
      if (activeViewMode === 'shopping_list' && item.in_pantry) return false;
      if (activeViewMode === 'pantry_inventory' && !item.in_pantry) return false;

      // Department Filter
      if (selectedDepartment !== 'all' && item.department !== selectedDepartment) return false;

      // Store Filter
      if (selectedStoreTag !== 'all' && item.store_tag && item.store_tag !== selectedStoreTag) return false;

      // Search Query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.item_name.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesNotes) return false;
      }

      return true;
    });
  }, [groceryList, activeListId, activeViewMode, selectedDepartment, selectedStoreTag, searchQuery]);

  // Grouped items by department for in-store navigation
  const groupedByDepartment = useMemo(() => {
    const groups: { [key in GroceryDepartment]?: GroceryItem[] } = {};
    currentListItems.forEach((item) => {
      const dept = item.department || (item.category === 'pantry_monthly' ? 'pantry_spices' : 'produce');
      if (!groups[dept]) groups[dept] = [];
      groups[dept]!.push(item);
    });
    return groups;
  }, [currentListItems]);

  // Overall Statistics
  const shoppingItems = groceryList.filter((item) => (!item.list_id || item.list_id === activeListId) && !item.in_pantry);
  const pantryItems = groceryList.filter((item) => (!item.list_id || item.list_id === activeListId) && item.in_pantry);
  const checkedCount = shoppingItems.filter((item) => item.is_checked).length;
  const totalShoppingCount = shoppingItems.length;
  const progressPercent = totalShoppingCount > 0 ? Math.round((checkedCount / totalShoppingCount) * 100) : 0;

  // Catalog filtered items for Quick-Add Modal
  const filteredCatalogItems = useMemo(() => {
    return MASTER_GROCERY_DATABASE.filter((item) => {
      if (catalogCategoryFilter !== 'all' && item.department !== catalogCategoryFilter) return false;
      if (catalogSearchQuery.trim().length > 0) {
        const q = catalogSearchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDept = item.department.toLowerCase().includes(q);
        if (!matchesName && !matchesDept) return false;
      }
      return true;
    });
  }, [catalogCategoryFilter, catalogSearchQuery]);

  // Actions
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleCopyToClipboard = () => {
    const lines: string[] = [];
    lines.push(`🛒 SEELYE FAMILY HEALTH — GROCERY LIST (${DEFAULT_NAMED_LISTS.find(l => l.id === activeListId)?.name || 'Shopping List'})`);
    lines.push(`📅 Date: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • Serving Multiplier: ${groceryMultiplier}x\n`);

    GROCERY_DEPARTMENTS.forEach((dept) => {
      const items = groupedByDepartment[dept.id];
      if (items && items.length > 0) {
        lines.push(`${dept.icon} ${dept.label.toUpperCase()}:`);
        items.forEach((item) => {
          const checkMark = item.is_checked ? '[✓]' : '[ ]';
          const store = item.store_tag ? ` (${item.store_tag.toUpperCase()})` : '';
          lines.push(`  ${checkMark} ${item.item_name} — ${item.quantity} ${item.unit}${store}`);
        });
        lines.push('');
      }
    });

    if (lines.length > 2) {
      navigator.clipboard.writeText(lines.join('\n'));
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    }
  };

  const handleAddCatalogItem = (catalogItem: CatalogGroceryItem, quantityMultiplier: number = 1) => {
    addGroceryItem({
      item_name: catalogItem.name,
      category: catalogItem.shelf_life,
      department: catalogItem.department,
      quantity: catalogItem.default_quantity * quantityMultiplier * groceryMultiplier,
      unit: catalogItem.default_unit,
      is_checked: false,
      in_pantry: false,
      store_tag: catalogItem.store_tags[0] || 'supermarket',
      list_id: activeListId,
      notes: `${catalogItem.department.replace('_', ' ')} staple`,
    });
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemForm.item_name) return;
    addGroceryItem({
      item_name: customItemForm.item_name,
      category: customItemForm.category,
      department: customItemForm.department,
      quantity: Number(customItemForm.quantity) * groceryMultiplier,
      unit: customItemForm.unit,
      is_checked: false,
      in_pantry: false,
      store_tag: customItemForm.store_tag,
      list_id: activeListId,
      notes: customItemForm.notes || undefined,
    });
    setShowCustomItemModal(false);
    setCustomItemForm({
      item_name: '',
      category: 'fresh_weekly',
      department: 'produce',
      quantity: 1,
      unit: 'lbs',
      store_tag: 'supermarket',
      notes: '',
    });
  };

  const handleExecuteSwap = (originalItem: GroceryItem, substitute: SmartGrocerySubstitute) => {
    const updatedQty = Math.round(originalItem.quantity * (substitute.conversion_ratio || 1.0) * 10) / 10;
    swapGroceryItem(originalItem.id, {
      item_name: substitute.name,
      department: substitute.department,
      quantity: updatedQty > 0 ? updatedQty : originalItem.quantity,
      unit: substitute.default_unit,
      notes: substitute.reason ? `Substituted: ${substitute.reason}` : `Swapped from ${originalItem.item_name}`,
    });
    setItemToSwap(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {showCopyToast && (
        <div className="fixed top-16 sm:top-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-2xl bg-emerald-500 text-zinc-950 font-bold text-xs shadow-2xl flex items-center gap-3 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Shopping list copied to clipboard! Ready to paste into Apple Reminders, Notes, or iMessage.</span>
        </div>
      )}

      {/* Non-Printable Header Banner */}
      <div className="no-print rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                🛒 SMART GROCERY & PANTRY REQUISITION ENGINE
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {MASTER_GROCERY_DATABASE.length}+ Catalog Items & Substitutes Available
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Weekly Grocery & Pantry Manager
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
              1-tap quick add from 150+ supermarket staples, smart item swapping, aisle/department sorting, pantry stock tracking, and instant export to Apple Reminders or printable physical sheets.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              id="btn-open-catalog"
              onClick={() => setShowCatalogModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-black shadow-glow transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Quick Add from Catalog</span>
            </button>

            <button
              type="button"
              id="btn-copy-clipboard"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
              title="Copy formatted list for Apple Reminders / Notes"
            >
              <Copy className="w-4 h-4 text-accent-cyan" />
              <span className="hidden sm:inline">Copy List</span>
            </button>

            <button
              type="button"
              id="btn-print-grocery"
              onClick={handlePrint}
              className="p-2.5 rounded-2xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-zinc-200 transition-all cursor-pointer"
              title="Print Physical Checklist / Save PDF"
            >
              <Printer className="w-4 h-4 text-brand-400" />
            </button>
          </div>
        </div>

        {/* Multi-List Selector Pills & Serving Multiplier */}
        <div className="pt-3 border-t border-surface-border/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Named Lists Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 whitespace-nowrap hidden sm:inline">
              Active List:
            </span>
            {DEFAULT_NAMED_LISTS.map((list) => (
              <button
                key={list.id}
                type="button"
                onClick={() => setActiveListId(list.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeListId === list.id
                    ? 'bg-brand-500 text-zinc-950 shadow-glow'
                    : 'bg-surface-200 hover:bg-surface-300 text-zinc-300 hover:text-white'
                }`}
              >
                <span>{list.icon}</span>
                <span>{list.name}</span>
              </button>
            ))}
          </div>

          {/* Controls: Multiplier & Sync from Meal Plan */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Serving Multiplier */}
            <div className="flex items-center gap-1.5 bg-surface-200/90 p-1 rounded-xl border border-surface-border">
              <span className="text-[10px] font-bold text-zinc-400 px-1.5">Scale:</span>
              {[
                { val: 1, label: '1x Solo' },
                { val: 2, label: '2x Couple' },
                { val: 4, label: '4x Family/Bulk' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setGroceryMultiplier(opt.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    groceryMultiplier === opt.val
                      ? 'bg-brand-500 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sync from Meal Plan */}
            <button
              type="button"
              onClick={syncGroceryFromMealPlan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-surface-border text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Reset & synchronize items based on your daily meal plan"
            >
              <RefreshCw className="w-3.5 h-3.5 text-accent-teal" />
              <span>Sync from Meals</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Switcher (Shopping List vs Pantry Inventory) & Filters */}
      <div className="no-print p-4 rounded-2xl bg-surface-100/90 border border-surface-border backdrop-blur-xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-200 border border-surface-border self-start">
            <button
              type="button"
              onClick={() => setActiveViewMode('shopping_list')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeViewMode === 'shopping_list'
                  ? 'bg-brand-500 text-zinc-950 shadow-glow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Need to Buy ({totalShoppingCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('pantry_inventory')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeViewMode === 'pantry_inventory'
                  ? 'bg-emerald-500 text-zinc-950 shadow-glow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>In Pantry ({pantryItems.length})</span>
            </button>
          </div>

          {/* Progress & Clear Completed */}
          {activeViewMode === 'shopping_list' && (
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-zinc-400">
                Cart Progress: <strong className="text-brand-400 font-bold">{checkedCount}</strong> / {totalShoppingCount} ({progressPercent}%)
              </div>
              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={clearCheckedGrocery}
                  className="text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Checked</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filter Pills & In-List Search */}
        <div className="pt-3 border-t border-surface-border/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Department Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedDepartment('all')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedDepartment === 'all'
                  ? 'bg-surface-300 text-brand-400 border border-brand-500/40'
                  : 'bg-surface-200/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Aisles
            </button>
            {GROCERY_DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDepartment(dept.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedDepartment === dept.id
                    ? 'bg-surface-300 text-brand-400 border border-brand-500/40 font-bold'
                    : 'bg-surface-200/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{dept.icon}</span>
                <span>{dept.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Search in Current List */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter items..."
                className="w-full pl-8 pr-3 py-1 rounded-xl bg-surface-200 border border-surface-border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowCustomItemModal(true)}
              className="p-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 hover:text-white border border-surface-border text-xs font-bold transition-all cursor-pointer shrink-0"
              title="Add a custom item from scratch"
            >
              + Custom
            </button>
          </div>
        </div>
      </div>

      {/* Printable Physical Sheet Header (Visible only when printing) */}
      <div className="hidden print:block border-b-2 border-black pb-4 mb-6 select-none">
        <div className="flex justify-between items-baseline">
          <h1 className="text-2xl font-black tracking-tight text-black font-sans">
            SEELYE FAMILY HEALTH — GROCERY CHECKLIST
          </h1>
          <span className="text-xs text-zinc-600 font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="text-xs text-zinc-700 mt-1">
          List: {DEFAULT_NAMED_LISTS.find(l => l.id === activeListId)?.name} • Serving Multiplier: {groceryMultiplier}x • User Target: {profile.daily_calorie_target} kcal
        </div>
      </div>

      {/* Main Shopping Items Rendered by Supermarket Department */}
      <div className="printable-area space-y-6">
        {GROCERY_DEPARTMENTS.map((dept) => {
          const items = groupedByDepartment[dept.id];
          if (!items || items.length === 0) return null;

          return (
            <div
              key={dept.id}
              className="rounded-3xl bg-surface-100/90 border border-surface-border p-5 sm:p-6 backdrop-blur-xl shadow-sm print:bg-transparent print:border print:border-black print:rounded-none print:p-4 print:mb-4 print:break-inside-avoid"
            >
              {/* Department Section Title */}
              <div className="flex items-center justify-between pb-3 border-b border-surface-border print:border-black print:pb-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl print:text-base">{dept.icon}</span>
                  <div>
                    <h2 className="text-base font-bold text-zinc-100 print:text-black font-sans">
                      {dept.label}
                    </h2>
                    <p className="text-[11px] text-zinc-400 print:text-gray-600 hidden sm:block">
                      {dept.description}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-200 text-zinc-300 border border-surface-border print:border-black print:text-black">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List in this Department */}
              <div className="space-y-2.5">
                {items.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.is_checked
                          ? 'bg-surface-200/40 border-surface-border/50 opacity-65 print:opacity-100'
                          : 'bg-surface-200/80 border-surface-border hover:border-zinc-600'
                      } print:bg-transparent print:border-b print:border-t-0 print:border-r-0 print:border-l-0 print:border-gray-300 print:rounded-none print:p-2`}
                    >
                      {/* Left: Checkbox & Item Name */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleGroceryItem(item.id)}
                          className={`min-w-[28px] min-h-[28px] rounded-xl flex items-center justify-center border transition-all cursor-pointer print:border print:border-black print:bg-white ${
                            item.is_checked
                              ? 'bg-brand-500 text-zinc-950 border-brand-400 shadow-glow'
                              : 'bg-surface-300 border-surface-border text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {item.is_checked ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Circle className="w-4 h-4 text-transparent" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold text-zinc-100 print:text-black ${
                                item.is_checked ? 'line-through text-zinc-400' : ''
                              }`}
                            >
                              {item.item_name}
                            </span>
                            {item.store_tag && item.store_tag !== 'all' && (
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-md bg-surface-300 text-zinc-300 border border-surface-border print:text-black print:border-black capitalize">
                                {item.store_tag.replace('_', ' ')}
                              </span>
                            )}
                          </div>

                          {item.notes && (
                            <p className="text-xs text-zinc-400 font-mono mt-0.5 print:text-gray-700 truncate">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Quantity & Action Buttons */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto shrink-0 print:gap-4">
                        {/* Quantity Badge */}
                        <div className="px-3 py-1 rounded-xl bg-surface-300/80 border border-surface-border text-xs font-mono font-bold text-brand-300 print:text-black print:border-black">
                          {item.quantity} {item.unit}
                        </div>

                        {/* Interactive Actions (Hidden in Print) */}
                        <div className="flex items-center gap-1.5 print:hidden">
                          {/* Swap / Substitute Button */}
                          <button
                            type="button"
                            onClick={() => setItemToSwap(item)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-300 hover:bg-surface-border text-[11px] font-bold text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
                            title="Swap item with a direct macro or culinary substitute"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-accent-cyan" />
                            <span className="hidden xs:inline">Swap</span>
                          </button>

                          {/* Toggle Pantry Status */}
                          <button
                            type="button"
                            onClick={() => togglePantryStatus(item.id)}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                              item.in_pantry
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-surface-300 text-zinc-400 hover:text-zinc-200 border-surface-border'
                            }`}
                            title={item.in_pantry ? 'Move to Need to Buy' : 'Mark as Already in Pantry'}
                          >
                            <Home className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Item */}
                          <button
                            type="button"
                            onClick={() => deleteGroceryItem(item.id)}
                            className="p-1.5 rounded-xl hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove from list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Printable Check Box on physical sheet */}
                        <div className="hidden print:block border border-black w-5 h-5 text-center text-xs">
                          {item.is_checked ? '✓' : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {currentListItems.length === 0 && (
          <div className="p-12 rounded-3xl bg-surface-100/90 border border-surface-border text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-200 border border-surface-border flex items-center justify-center mx-auto text-zinc-400">
              <ShoppingCart className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Items in this View</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                {activeViewMode === 'pantry_inventory'
                  ? 'You currently have no items marked as stocked in your pantry.'
                  : 'Your shopping list is empty. Click below to add items from the 150+ master grocery catalog or synchronize from your meal plan.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowCatalogModal(true)}
                className="px-4 py-2 rounded-xl bg-brand-500 text-zinc-950 font-bold text-xs shadow-glow cursor-pointer"
              >
                + Browse Catalog
              </button>
              <button
                type="button"
                onClick={syncGroceryFromMealPlan}
                className="px-4 py-2 rounded-xl bg-surface-200 text-zinc-200 font-bold text-xs border border-surface-border cursor-pointer hover:bg-surface-300"
              >
                Sync from Meals
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: QUICK-ADD MASTER GROCERY CATALOG MODAL
          ========================================================================= */}
      {showCatalogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowCatalogModal(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-surface-100 border border-surface-border shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-surface-200/90 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1.5 rounded-xl bg-surface-300 border border-surface-border">
                    🛒
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      Master Grocery & Ingredient Catalog
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">
                      1-Tap Quick Add to "{DEFAULT_NAMED_LISTS.find(l => l.id === activeListId)?.name}"
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="p-2 rounded-xl hover:bg-surface-300 text-zinc-400 hover:text-white cursor-pointer transition-all self-end sm:self-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Department Pills & Search */}
            <div className="p-4 bg-surface-200/40 border-b border-surface-border space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCatalogCategoryFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    catalogCategoryFilter === 'all'
                      ? 'bg-brand-500 text-zinc-950 shadow-glow'
                      : 'bg-surface-200 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All Categories ({MASTER_GROCERY_DATABASE.length})
                </button>
                {GROCERY_DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setCatalogCategoryFilter(dept.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                      catalogCategoryFilter === dept.id
                        ? 'bg-brand-500 text-zinc-950 font-bold shadow-glow'
                        : 'bg-surface-200 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>{dept.icon}</span>
                    <span>{dept.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={catalogSearchQuery}
                  onChange={(e) => setCatalogSearchQuery(e.target.value)}
                  placeholder="Search 150+ catalog foods (Chicken, Salmon, Oats, Spinach, Olive Oil)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Catalog Items Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredCatalogItems.map((catItem) => (
                <div
                  key={catItem.id}
                  className="p-4 rounded-2xl bg-surface-200/70 hover:bg-surface-200 border border-surface-border hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-3 shadow-sm group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-surface-300 border border-surface-border shrink-0">
                      {catItem.icon_emoji || '🛒'}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                        {catItem.name}
                      </h4>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        Standard: {catItem.default_quantity} {catItem.default_unit}
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {catItem.store_tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-300 text-zinc-300 uppercase"
                          >
                            {t.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {catItem.common_substitutes.length} Swaps Available
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddCatalogItem(catItem, 1)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-black shadow-glow transition-all cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-200/90 border-t border-surface-border flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">
                {filteredCatalogItems.length} items matching criteria
              </span>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-300 hover:bg-surface-border text-zinc-200 text-xs font-bold cursor-pointer"
              >
                Done Adding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: 1-CLICK SMART ITEM SWAP & SUBSTITUTE ENGINE
          ========================================================================= */}
      {itemToSwap && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setItemToSwap(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Smart Item Substitute & Swap Engine
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Replace <strong>"{itemToSwap.item_name}"</strong> ({itemToSwap.quantity} {itemToSwap.unit})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setItemToSwap(null)}
                className="p-1.5 rounded-xl hover:bg-surface-200 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recommended Smart Substitutes */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Suggested Direct Alternatives:
              </label>

              <div className="space-y-2">
                {getSmartSubstitutesForItem(itemToSwap.item_name).map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-surface-200/80 hover:bg-surface-200 border border-surface-border hover:border-brand-500/50 transition-all flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{sub.name}</h4>
                      <p className="text-[11px] text-brand-300 font-mono mt-0.5">
                        {sub.reason || `Equivalent portion in ${sub.default_unit}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExecuteSwap(itemToSwap, sub)}
                      className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 text-xs font-bold shadow-glow transition-all cursor-pointer active:scale-95 shrink-0"
                    >
                      Swap to This
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setItemToSwap(null)}
              className="w-full py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 text-xs font-bold cursor-pointer"
            >
              Keep Original Item
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CUSTOM GROCERY ITEM CREATOR MODAL
          ========================================================================= */}
      {showCustomItemModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowCustomItemModal(false)}
        >
          <form
            onSubmit={handleAddCustomItem}
            className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h3 className="text-base sm:text-lg font-bold text-white">Add Custom Grocery Item</h3>
              <button
                type="button"
                onClick={() => setShowCustomItemModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-300">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grass-Fed Ribeye Steak"
                  value={customItemForm.item_name}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, item_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300">Department / Aisle</label>
                  <select
                    value={customItemForm.department}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, department: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  >
                    {GROCERY_DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300">Store Destination</label>
                  <select
                    value={customItemForm.store_tag}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, store_tag: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  >
                    {GROCERY_STORE_TAGS.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300">Quantity</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={customItemForm.quantity}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300">Unit (lbs, bags, cans)</label>
                  <input
                    type="text"
                    value={customItemForm.unit}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300">Optional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Look for organic USDA Choice"
                  value={customItemForm.notes}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomItemModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs shadow-glow cursor-pointer"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
