import React from 'react';
import { CatalogBrowser } from '../catalog/CatalogBrowser';
import { useApp } from '../../context/AppContext';

export const UserExplore: React.FC = () => {
  const { setActiveItemModal } = useApp();

  return (
    <div className="space-y-6">
      <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              Green Meadows Community Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Explore Household Resources
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Discover tools, kitchen appliances, and gear shared by neighbors across Towers A, B, C, and D. All prices in INR (₹) with refundable deposit terms.
            </p>
          </div>
        </div>
      </div>

      <CatalogBrowser onSelectItem={(item) => setActiveItemModal(item)} />
    </div>
  );
};
