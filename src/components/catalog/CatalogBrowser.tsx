import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemCard } from './ItemCard';
import { ResourceItem, ItemCategory } from '../../types';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Plus, 
  Building2, 
  ShieldCheck, 
  RefreshCw,
  Tag,
  FlaskConical,
  MessageSquare,
  Heart,
  ArrowUpDown,
  Flame,
  Clock,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES: ('All' | ItemCategory)[] = [
  'All',
  'Indian Household & Kitchen',
  'Power Tools',
  'Camping & Outdoors',
  'Cleaning & Washers',
  'Audio & Visual',
  'Gardening',
  'Home & DIY',
  'Bioscience & Lab',
];

interface CatalogBrowserProps {
  onSelectItem: (item: ResourceItem) => void;
}

export const CatalogBrowser: React.FC<CatalogBrowserProps> = ({ onSelectItem }) => {
  const { 
    items, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    availabilityFilter, 
    setAvailabilityFilter,
    priceFilter, 
    setPriceFilter,
    setIsAddItemOpen,
    setActiveView,
    setIsChatOpen,
    savedItemIds,
    recentlyViewedIds
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [selectedTower, setSelectedTower] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'availability'>('featured');

  // Recently viewed items lookup
  const recentlyViewedItems = recentlyViewedIds
    .map(id => items.find(i => i.id === id))
    .filter((item): item is ResourceItem => Boolean(item));

  // Filter items according to search, category, price, tower, condition, and availability
  const filteredItems = items.filter(item => {
    // Saved filter
    if (onlySaved && !savedItemIds.includes(item.id)) {
      return false;
    }

    // Category match
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Tower match
    if (selectedTower !== 'All' && item.ownerBlock !== selectedTower) {
      return false;
    }

    // Condition match
    if (selectedCondition !== 'All' && item.condition !== selectedCondition) {
      return false;
    }

    // Availability match
    if (availabilityFilter === 'available' && item.availability !== 'available') {
      return false;
    }
    if (availabilityFilter === 'in_use' && item.availability !== 'in_use') {
      return false;
    }

    // Free filter
    if (onlyFree && item.rentalPricePerDay > 0) {
      return false;
    }

    // Price filter (in ₹)
    if (item.rentalPricePerDay > priceFilter) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchOwner = item.ownerName.toLowerCase().includes(q) || item.ownerFlat.toLowerCase().includes(q) || item.ownerBlock.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory && !matchOwner) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.viewsCount || 0) - (a.viewsCount || 0);
    }
    if (sortBy === 'price_asc') {
      return a.rentalPricePerDay - b.rentalPricePerDay;
    }
    if (sortBy === 'price_desc') {
      return b.rentalPricePerDay - a.rentalPricePerDay;
    }
    if (sortBy === 'rating') {
      return b.ownerRating - a.ownerRating;
    }
    if (sortBy === 'availability') {
      if (a.availability === 'available' && b.availability !== 'available') return -1;
      if (a.availability !== 'available' && b.availability === 'available') return 1;
      return 0;
    }
    return 0;
  });

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setOnlyFree(false);
    setOnlySaved(false);
    setSelectedTower('All');
    setSelectedCondition('All');
    setAvailabilityFilter('all');
    setPriceFilter(2000);
    setSortBy('featured');
  };

  return (
    <div className="space-y-6">
      
      {/* Community Hero Introduction & Trust Banner */}
      <section className="ios-glass p-6 sm:p-8 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm relative overflow-hidden bg-white/70 dark:bg-neutral-900/60">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
              Green Meadows Residences · Neighborly Portal
            </span>
            <span className="text-xs text-neutral-400">Bangalore</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Borrow, Lend & Rent Trusted Household Resources
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2.5 leading-relaxed">
            Why buy what you only need once? Share wet grinders, pooja brass sets, high-torque power drills, camping tents, patio washers, and scientific equipment directly with verified neighbors. Coordinated with built-in instant resident chat and escrow deposit protection in ₹.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-neutral-200/60 dark:border-white/10 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Resident Identity Verified</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Escrow Deposit Protection in ₹</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsChatOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Lender ↔ Taker Chat</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveView('bioscience')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Community Bioscience Lab</span>
            </button>
          </div>
        </div>
      </section>

      {/* Recently Viewed Strip (Marketplace Feature) */}
      {recentlyViewedItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Recently Viewed by You</span>
            </div>
            <span className="text-[11px] text-neutral-400">{recentlyViewedItems.length} items</span>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {recentlyViewedItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 shrink-0 text-left cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="pr-2">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1 max-w-[150px]">{item.title}</div>
                  <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {item.rentalPricePerDay === 0 ? 'Free' : `₹${item.rentalPricePerDay}/day`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar & Filter Controls */}
      <div className="space-y-3">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, item name, category, or owner flat (e.g. 'mixer', 'drill', 'pressure cooker', 'A-402')..."
              className="w-full pl-10 pr-16 py-2.5 text-xs sm:text-sm ios-glass bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs text-neutral-900 dark:text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-2.5 text-xs font-medium border rounded-xl ios-glass bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 border-neutral-200/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
              >
                <option value="featured">Sort: Featured Picks</option>
                <option value="price_asc">Price: Low to High (₹)</option>
                <option value="price_desc">Price: High to Low (₹)</option>
                <option value="rating">Highest Neighbor Rating</option>
                <option value="availability">Available Immediately</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Wishlist quick filter */}
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                onlySaved 
                  ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300' 
                  : 'ios-glass bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 border-neutral-200/60 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5'
              }`}
              title="Filter by saved items"
            >
              <Heart className={`w-3.5 h-3.5 ${onlySaved ? 'fill-current text-rose-600' : ''}`} />
              <span className="hidden sm:inline">Wishlist ({savedItemIds.length})</span>
            </button>

            {/* Toggle Filter Panel */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3.5 py-2.5 text-xs font-medium border rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                showFilters 
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white' 
                  : 'ios-glass bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 border-neutral-200/60 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Primary Action on mobile */}
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="sm:hidden px-3.5 py-2.5 text-xs font-semibold text-white bg-emerald-700 dark:bg-emerald-600 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Item</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm font-semibold' 
                  : 'ios-glass bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Advanced Filter Drawer */}
        {showFilters && (
          <div className="ios-glass p-5 rounded-2xl border border-neutral-200/60 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Availability Filter */}
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">Availability Status</label>
              <select 
                value={availabilityFilter}
                onChange={e => setAvailabilityFilter(e.target.value)}
                className="w-full p-2.5 border border-neutral-200 dark:border-white/10 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Items</option>
                <option value="available">Available Now Only</option>
                <option value="in_use">Currently Borrowed / In Use</option>
              </select>
            </div>

            {/* Tower Filter */}
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">Owner Tower / Block</label>
              <select 
                value={selectedTower}
                onChange={e => setSelectedTower(e.target.value)}
                className="w-full p-2.5 border border-neutral-200 dark:border-white/10 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Towers</option>
                <option value="Tower A">Tower A (Flats 101-504)</option>
                <option value="Tower B">Tower B (Flats 101-504)</option>
                <option value="Tower C">Tower C (Flats 101-504)</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">Condition</label>
              <select 
                value={selectedCondition}
                onChange={e => setSelectedCondition(e.target.value)}
                className="w-full p-2.5 border border-neutral-200 dark:border-white/10 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Conditions</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Price Filter Slider in ₹ */}
            <div>
              <div className="flex justify-between font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                <span>Max Daily Rate:</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">₹{priceFilter} / day</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="50"
                value={priceFilter}
                onChange={e => setPriceFilter(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                <span>₹0 (Free)</span>
                <span>₹500</span>
                <span>₹1,000+</span>
              </div>
            </div>

            {/* Free Community Borrowing Only Toggle */}
            <div className="col-span-full pt-2 flex flex-wrap items-center gap-4 border-t border-neutral-200/40 dark:border-white/5">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-800 dark:text-neutral-200 font-medium">
                <input 
                  type="checkbox"
                  checked={onlyFree}
                  onChange={e => setOnlyFree(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Free Community Borrowing Only (₹0/day)</span>
              </label>

              <button
                onClick={resetAllFilters}
                className="text-xs text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 ml-auto cursor-pointer"
              >
                Reset to default
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Catalog Grid View */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Showing <span className="font-bold text-neutral-900 dark:text-white font-mono tabular-nums">{sortedItems.length}</span> verified community resource{sortedItems.length === 1 ? '' : 's'}
            {selectedCategory !== 'All' && <span> in <strong className="text-emerald-600 dark:text-emerald-400">{selectedCategory}</strong></span>}
          </div>
          {(selectedCategory !== 'All' || searchQuery || onlyFree || onlySaved || selectedTower !== 'All' || selectedCondition !== 'All' || availabilityFilter !== 'all') && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {sortedItems.length === 0 ? (
          <div className="ios-glass border border-neutral-200/60 dark:border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">No resources match your search</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              We couldn't find items matching your criteria. Try adjusting your search keywords, raising your daily price limit, or checking other categories.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 dark:bg-emerald-600 rounded-xl hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
            >
              Clear filters & view all items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onSelect={onSelectItem} 
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
