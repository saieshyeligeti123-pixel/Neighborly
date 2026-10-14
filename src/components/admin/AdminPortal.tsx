import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { AdminCatalogManager } from './AdminCatalogManager';
import { AdminRentalMonitor } from './AdminRentalMonitor';
import { SecurityDesk } from '../security/SecurityDesk';
import { ReportsView } from '../reports/ReportsView';
import { BioscienceLab } from '../science/BioscienceLab';
import { AdminAccessDenied } from './AdminAccessDenied';
import { AdminNavTab } from '../../types';
import { FileCheck } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    currentUser, 
    isAdminAuthenticated, 
    adminNavTab, 
    setAdminNavTab,
    setIsTraceabilityOpen 
  } = useApp();

  // Strict role and auth guard (Requirement 2):
  // Never allow resident to access the Admin Portal even if manipulated.
  if (currentUser.role !== 'admin' || !isAdminAuthenticated) {
    return <AdminAccessDenied />;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Admin Header */}
      <AdminHeader 
        currentTab={adminNavTab} 
        onSelectTab={(tab) => setAdminNavTab(tab)} 
      />

      {/* Main Admin View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {adminNavTab === 'dashboard' && (
          <AdminDashboard />
        )}

        {adminNavTab === 'catalog' && (
          <AdminCatalogManager />
        )}

        {adminNavTab === 'rentals' && (
          <AdminRentalMonitor />
        )}

        {adminNavTab === 'security' && (
          <SecurityDesk />
        )}

        {adminNavTab === 'reports' && (
          <ReportsView />
        )}

        {adminNavTab === 'bioscience' && (
          <BioscienceLab />
        )}
      </main>

      {/* Clean Admin Footer */}
      <footer className="mt-auto border-t border-amber-500/20 dark:border-amber-400/20 ios-glass bg-white/40 dark:bg-black/40 py-6 no-print relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-900 dark:text-white">Neighborly Admin</span>
            <span aria-hidden="true">·</span>
            <span>Estate Office & Governance Interface (Green Meadows Gated Community)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTraceabilityOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-medium text-amber-700 dark:text-amber-400"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>IEEE Std 830-1998 Traceability Matrix</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Logged in as Head Admin</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
