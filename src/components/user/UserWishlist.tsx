import React from 'react';
import { useApp } from '../../context/AppContext';
import { ItemCard } from '../catalog/ItemCard';
import { Heart, Compass, ArrowRight } from 'lucide-react';

export const UserWishlist: React.FC = () => {
  const { items, savedItemIds, setActiveItemModal, setUserNavTab } = useApp();

  const savedItems = items.filter(i => savedItemIds.includes(i.id));

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="ios-glass p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              Saved For Later
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Household appliances, tools, and gear you have bookmarked for upcoming home projects or celebrations.
            </p>
          </div>

          <span className="text-xs px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 font-semibold">
            {savedItems.length} Saved Item{savedItems.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="ios-glass p-16 text-center text-xs text-neutral-500 dark:text-neutral-400 rounded-3xl border border-white/50 dark:border-white/10">
          <Heart className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
            Your Wishlist is Empty
          </h3>
          <p className="mt-1 max-w-sm mx-auto">
            Click the heart icon on any community listing in the catalog to save it here for quick access when you need it!
          </p>
          <button
            onClick={() => setUserNavTab('explore')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse Community Catalog</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {savedItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={(selected) => setActiveItemModal(selected)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
