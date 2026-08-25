'use client';

import React, { useState, useMemo } from 'react';
import { useHealth } from '@/context/HealthContext';
import {
  GroceryItem,
  GroceryDepartment,
  GroceryStoreTag,
  CatalogGroceryItem,
  SmartGrocerySubstitute,
  FoodCategory,
} from '@/lib/types';
import {
  GROCERY_DEPARTMENTS,
  GROCERY_STORE_TAGS,
  DEFAULT_NAMED_LISTS,
  MASTER_GROCERY_DATABASE,
  getSmartSubstitutesForItem,
  generateStoreSpecificRequisition,
} from '@/lib/grocery-database';
import {
  SAMS_CLUB_PRODUCTS,
  ALDI_PRODUCTS,
  MEIJER_PRODUCTS,
  COSTCO_PRODUCTS,
  WALMART_PRODUCTS,
} from '@/lib/store-products-database';
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
  Zap,
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
    foods,
    experienceMode,
  } = useHealth();

  const isSimple = experienceMode === 'simple';

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
  const [toastMessage, setToastMessage] = useState<string>('Copied to clipboard!');

  // Custom Item Form
  const [customItemForm, setCustomItemForm] = useState<{
    item_name: string;
    brand: string;
    package_size: string;
    category: 'fresh_weekly' | 'pantry_monthly' | 'freezer_monthly';
    department: string;
    quantity: number;
    unit: string;
    store_tag: GroceryStoreTag;
    notes: string;
  }>({
    item_name: '',
    brand: '',
    package_size: '',
    category: 'fresh_weekly',
    department: 'poultry_meat',
    quantity: 1,
    unit: 'lbs',
    store_tag: 'meijer',
    notes: '',
  });

  // Catalog Browser Modal Filter
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('all');
  const [catalogStoreFilter, setCatalogStoreFilter] = useState<GroceryStoreTag>('all');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');

  // Items for active list & active view mode
  const currentListItems = useMemo(() => {
    return groceryList.filter((item) => {
      // List check: 'main' displays all active shopping items. Specific store run tabs filter by store tag or list_id.
      let matchesList = true;
      if (activeListId === 'main') {
        matchesList = true;
      } else if (activeListId === 'aldi_run') {
        matchesList = item.list_id === 'aldi_run' || item.store_tag === 'aldi';
      } else if (activeListId === 'meijer_run') {
        matchesList = item.list_id === 'meijer_run' || item.store_tag === 'meijer';
      } else if (activeListId === 'sams_club_bulk') {
        matchesList = item.list_id === 'sams_club_bulk' || item.store_tag === 'sams_club';
      } else if (activeListId === 'costco_bulk') {
        matchesList = item.list_id === 'costco_bulk' || item.store_tag === 'costco';
      } else if (activeListId === 'walmart_run') {
        matchesList = item.list_id === 'walmart_run' || item.store_tag === 'walmart';
      } else if (activeListId === 'prep_day') {
        matchesList = item.list_id === 'prep_day';
      } else {
        matchesList = !item.list_id || item.list_id === activeListId;
      }
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
        const matchesBrand = item.brand?.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesNotes) return false;
      }

      return true;
    });
  }, [groceryList, activeListId, activeViewMode, selectedDepartment, selectedStoreTag, searchQuery]);

  // Grouped items by department for in-store navigation
  const groupedByDepartment = useMemo(() => {
    const groups: { [key: string]: GroceryItem[] } = {};
    currentListItems.forEach((item) => {
      const dept = item.department || (item.category === 'pantry_monthly' ? 'snacks_pantry' : 'vegetables');
      if (!groups[dept]) groups[dept] = [];
      groups[dept]!.push(item);
    });
    return groups;
  }, [currentListItems]);

  // Overall Statistics
  const shoppingItems = groceryList.filter((item) => !item.in_pantry);
  const pantryItems = groceryList.filter((item) => item.in_pantry);
  const checkedCount = currentListItems.filter((item) => item.is_checked).length;
  const totalShoppingCount = currentListItems.length;
  const progressPercent = totalShoppingCount > 0 ? Math.round((checkedCount / totalShoppingCount) * 100) : 0;

  // Catalog filtered items for Quick-Add Modal
  const filteredCatalogItems = useMemo(() => {
    return MASTER_GROCERY_DATABASE.filter((item) => {
      if (catalogCategoryFilter !== 'all' && item.department !== catalogCategoryFilter) return false;
      if (catalogStoreFilter !== 'all' && !item.store_tags.includes(catalogStoreFilter)) return false;
      if (catalogSearchQuery.trim().length > 0) {
        const q = catalogSearchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brand?.toLowerCase().includes(q);
        const matchesDept = (item.department as string).toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDept) return false;
      }
      return true;
    });
  }, [catalogCategoryFilter, catalogStoreFilter, catalogSearchQuery]);

  // Store Brand Item Counts
  const storeCounts = useMemo(() => ({
    sams: SAMS_CLUB_PRODUCTS.length,
    aldi: ALDI_PRODUCTS.length,
    meijer: MEIJER_PRODUCTS.length,
    costco: COSTCO_PRODUCTS.length,
    walmart: WALMART_PRODUCTS.length,
  }), []);

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
          const brandText = item.brand ? ` [${item.brand}]` : '';
          const sizeText = item.package_size ? ` (${item.package_size})` : '';
          lines.push(`  ${checkMark} ${item.item_name}${brandText} — ${item.quantity} ${item.unit}${sizeText}`);
        });
        lines.push('');
      }
    });

    if (lines.length > 2) {
      navigator.clipboard.writeText(lines.join('\n'));
      setToastMessage('Shopping list copied to clipboard! Ready to paste into Apple Reminders, Notes, or iMessage.');
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3500);
    }
  };

  const handleLoadStoreRun = (store: 'sams_club' | 'aldi' | 'meijer' | 'costco' | 'walmart') => {
    const items = generateStoreSpecificRequisition(store, groceryMultiplier);
    const listMap = {
      sams_club: 'sams_club_bulk',
      aldi: 'aldi_run',
      meijer: 'meijer_run',
      costco: 'costco_bulk',
      walmart: 'walmart_run',
    };
    const listId = listMap[store] || 'main';
    setActiveListId(listId);
    setSelectedStoreTag(store);

    items.forEach((newItem) => {
      addGroceryItem(newItem);
    });

    const storeNames = {
      sams_club: "Sam's Club Member's Mark Bulk",
      aldi: "Aldi Simply Nature & Friendly Farms",
      meijer: "Meijer True Goodness & Frederik's",
      costco: "Costco Kirkland Signature Bulk",
      walmart: "Walmart Great Value & Marketside",
    };

    setToastMessage(`Loaded ${items.length} signature ${storeNames[store]} items into your list!`);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 3500);
  };

  const handleAddCatalogItem = (catalogItem: CatalogGroceryItem, quantityMultiplier: number = 1) => {
    addGroceryItem({
      item_name: catalogItem.name,
      brand: catalogItem.brand,
      package_size: catalogItem.package_size,
      category: catalogItem.shelf_life,
      department: catalogItem.department as any,
      quantity: catalogItem.default_quantity * quantityMultiplier * groceryMultiplier,
      unit: catalogItem.default_unit,
      is_checked: false,
      in_pantry: false,
      store_tag: catalogItem.store_tags[0] || 'meijer',
      list_id: activeListId,
      notes: catalogItem.brand ? `${catalogItem.brand}${catalogItem.package_size ? ` • ${catalogItem.package_size}` : ''}` : `${(catalogItem.department as string).replace('_', ' ')} item`,
    });
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemForm.item_name) return;
    addGroceryItem({
      item_name: customItemForm.item_name,
      brand: customItemForm.brand || undefined,
      package_size: customItemForm.package_size || undefined,
      category: customItemForm.category,
      department: customItemForm.department as any,
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
      brand: '',
      package_size: '',
      category: 'fresh_weekly',
      department: 'poultry_meat',
      quantity: 1,
      unit: 'lbs',
      store_tag: 'meijer',
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
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Non-Printable Header Banner */}
      <div className="no-print rounded-3xl bg-surface-100/90 border border-surface-border p-6 md:p-8 backdrop-blur-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
                {isSimple ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>WHOLESOME SHOPPING LIST</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 text-brand-400" />
                    <span>SAM'S CLUB • ALDI • MEIJER REQUISITION</span>
                  </>
                )}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {isSimple ? 'Aisle-By-Aisle Pantry & Cart' : 'Real Store Brand Items & Macro Engine'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {isSimple ? 'Weekly Grocery & Pantry List' : 'Weekly Grocery & Pantry Manager'}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
              {isSimple
                ? 'Your clear, organized shopping list. Add real store items from Sam’s Club, Aldi, and Meijer, check them off as you shop, or track what you have in your kitchen pantry.'
                : 'Add authentic signature products from Sam’s Club (Member’s Mark), Aldi (Simply Nature / Friendly Farms), and Meijer (True Goodness / Frederik’s), or pull from the 1,000+ item master food database.'}
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
              <span>+ Quick Add from Store Catalogs</span>
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

        {/* 1-Click Store Run Presets Bar */}
        <div className="p-3.5 rounded-2xl bg-surface-200/60 border border-surface-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-zinc-200">
              1-Click Store Run Presets:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleLoadStoreRun('aldi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold transition-all cursor-pointer border border-surface-border hover:border-brand-400 active:scale-95"
            >
              <span>🛒</span>
              <span>+ Aldi ({storeCounts.aldi} items)</span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadStoreRun('meijer')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold transition-all cursor-pointer border border-surface-border hover:border-brand-400 active:scale-95"
            >
              <span>🏷️</span>
              <span>+ Meijer ({storeCounts.meijer} items)</span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadStoreRun('sams_club')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold transition-all cursor-pointer border border-surface-border hover:border-brand-400 active:scale-95"
            >
              <span>📦</span>
              <span>+ Sam's Club ({storeCounts.sams} items)</span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadStoreRun('costco')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold transition-all cursor-pointer border border-surface-border hover:border-brand-400 active:scale-95"
            >
              <span>🏬</span>
              <span>+ Costco ({storeCounts.costco} items)</span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadStoreRun('walmart')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-300 hover:bg-brand-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold transition-all cursor-pointer border border-surface-border hover:border-brand-400 active:scale-95"
            >
              <span>🏪</span>
              <span>+ Walmart ({storeCounts.walmart} items)</span>
            </button>
          </div>
        </div>

        {/* Multi-List Selector Pills & Serving Multiplier */}
        <div className="pt-2 border-t border-surface-border/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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

        {/* Store Tags Filter Bar */}
        <div className="pt-3 border-t border-surface-border/60 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-500 whitespace-nowrap">
            Store Filter:
          </span>
          {GROCERY_STORE_TAGS.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedStoreTag(st.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedStoreTag === st.id
                  ? 'bg-brand-500 text-zinc-950 font-bold shadow-glow'
                  : 'bg-surface-200/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Department Pills & In-List Search */}
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
              All Food Aisles
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
                placeholder="Filter current list..."
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

      {/* Main Shopping Items Rendered by Food Database Department */}
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
                            {item.brand && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30 print:text-black print:border-black">
                                {item.brand}
                              </span>
                            )}
                            {item.store_tag && item.store_tag !== 'all' && !item.brand && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-300 text-zinc-300 border border-surface-border print:text-black print:border-black uppercase">
                                {item.store_tag === 'sams_club' ? "Sam's Club" : item.store_tag === 'aldi' ? 'Aldi' : item.store_tag === 'meijer' ? 'Meijer' : item.store_tag}
                              </span>
                            )}
                          </div>

                          {(item.package_size || item.notes) && (
                            <p className="text-xs text-zinc-400 font-mono mt-0.5 print:text-gray-700 truncate">
                              {item.package_size ? `${item.package_size}${item.notes ? ` • ${item.notes}` : ''}` : item.notes}
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
                  : 'Your shopping list is empty. Click below to add signature store brand products or browse the master catalog.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => handleLoadStoreRun('sams_club')}
                className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-200 font-bold text-xs border border-surface-border cursor-pointer"
              >
                📦 + Sam's Club Bulk
              </button>
              <button
                type="button"
                onClick={() => handleLoadStoreRun('aldi')}
                className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-200 font-bold text-xs border border-surface-border cursor-pointer"
              >
                🛒 + Aldi Organics
              </button>
              <button
                type="button"
                onClick={() => handleLoadStoreRun('meijer')}
                className="px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-zinc-200 font-bold text-xs border border-surface-border cursor-pointer"
              >
                🏷️ + Meijer Weekly
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: QUICK-ADD MASTER STORE & FOOD DATABASE MODAL
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
                      Store Brand & Food Catalog
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">
                      Member's Mark (Sam's Club) • Simply Nature / Friendly Farms (Aldi) • True Goodness / Frederik's (Meijer)
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

            {/* Filters: Store Selection & Category Tabs */}
            <div className="p-4 bg-surface-200/40 border-b border-surface-border space-y-3">
              {/* Store Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-zinc-500 whitespace-nowrap">Store:</span>
                {GROCERY_STORE_TAGS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCatalogStoreFilter(st.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                      catalogStoreFilter === st.id
                        ? 'bg-brand-500 text-zinc-950 shadow-glow'
                        : 'bg-surface-200 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>{st.icon}</span>
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>

              {/* Department Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCatalogCategoryFilter('all')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    catalogCategoryFilter === 'all'
                      ? 'bg-surface-300 text-brand-400 border border-brand-500/40'
                      : 'bg-surface-200 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All Categories
                </button>
                {GROCERY_DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setCatalogCategoryFilter(dept.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                      catalogCategoryFilter === dept.id
                        ? 'bg-surface-300 text-brand-400 border border-brand-500/40 font-bold'
                        : 'bg-surface-200 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>{dept.icon}</span>
                    <span>{dept.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={catalogSearchQuery}
                  onChange={(e) => setCatalogSearchQuery(e.target.value)}
                  placeholder="Search products (Member's Mark Chicken, Simply Nature Beef, True Goodness Oats, Greek Yogurt)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Catalog Items Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredCatalogItems.slice(0, 150).map((catItem) => (
                <div
                  key={catItem.id}
                  className="p-4 rounded-2xl bg-surface-200/70 hover:bg-surface-200 border border-surface-border hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-3 shadow-sm group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-surface-300 border border-surface-border shrink-0">
                      {catItem.icon_emoji || '🛒'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                        {catItem.name}
                      </h4>
                      {catItem.brand && (
                        <div className="text-[10px] font-semibold text-brand-400 mt-0.5 truncate">
                          {catItem.brand}
                        </div>
                      )}
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {catItem.package_size ? (
                          <span>Pack: {catItem.package_size}</span>
                        ) : catItem.protein_g !== undefined && catItem.calories_per_serving !== undefined ? (
                          <span>{catItem.protein_g}g P • {catItem.calories_per_serving} kcal/100g</span>
                        ) : (
                          <span>Standard: {catItem.default_quantity} {catItem.default_unit}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {catItem.store_tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-300 text-zinc-300 uppercase font-bold"
                          >
                            {t === 'sams_club' ? "Sam's Club" : t === 'aldi' ? 'Aldi' : t === 'meijer' ? 'Meijer' : t}
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
                Showing {Math.min(filteredCatalogItems.length, 150)} of {filteredCatalogItems.length} products
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
                Suggested Direct Store Brand & Macro Substitutes:
              </label>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {getSmartSubstitutesForItem(itemToSwap.item_name, foods).map((sub, idx) => (
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
                  <label className="font-semibold text-zinc-300">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Member's Mark"
                    value={customItemForm.brand}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300">Package Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 lb Bag"
                    value={customItemForm.package_size}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, package_size: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-200 border border-surface-border text-zinc-100 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300">Department / Aisle</label>
                  <select
                    value={customItemForm.department}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, department: e.target.value })}
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
                  <label className="font-semibold text-zinc-300">Unit (lbs, packs, bags)</label>
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
