import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Package, 
  Clock, 
  Shield, 
  FileText, 
  FlaskConical, 
  FileCheck, 
  Sun, 
  Moon, 
  LogOut, 
  ArrowRightLeft,
  Users,
  AlertTriangle
} from 'lucide-react';
import { AdminNavTab } from '../../types';

interface AdminHeaderProps {
  currentTab: AdminNavTab;
  onSelectTab: (tab: AdminNavTab) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ currentTab, onSelectTab }) => {
  const { 
    currentUser, 
    theme, 
    toggleTheme, 
    logout, 
    switchToPortal,
    users,
    reports,
    bookings,
    setIsTraceabilityOpen
  } = useApp();

  const pendingUsersCount = users.filter(u => u.verificationStatus === 'pending').length;
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;
  const overdueBookingsCount = bookings.filter(b => b.isOverdue || (b.status === 'in_use' && new Date(b.endDate) < new Date())).length;

  return (
    <header className="sticky top-0 z-30 ios-glass bg-white/80 dark:bg-black/75 border-b border-amber-500/20 dark:border-amber-400/20 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold text-base shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Neighborly
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-white dark:bg-amber-500 dark:text-neutral-950 shadow-2xs">
                  Admin Portal
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                Green Meadows Estate Office & Governance
              </p>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${currentTab === 'dashboard' ? 'text-amber-600 dark:text-amber-400 border-amber-500' : 'border-transparent'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
              {pendingUsersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-bold">
                  {pendingUsersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('catalog')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${currentTab === 'catalog' ? 'text-amber-600 dark:text-amber-400 border-amber-500' : 'border-transparent'}`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catalog & Moderation</span>
              {pendingReportsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 font-bold">
                  {pendingReportsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('rentals')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${currentTab === 'rentals' ? 'text-amber-600 dark:text-amber-400 border-amber-500' : 'border-transparent'}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Rental Monitoring</span>
              {overdueBookingsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  !
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('security')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${currentTab === 'security' ? 'text-amber-600 dark:text-amber-400 border-amber-500' : 'border-transparent'}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Gate Desk</span>
            </button>

            <button
              onClick={() => onSelectTab('reports')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${currentTab === 'reports' ? 'text-amber-600 dark:text-amber-400 border-amber-500' : 'border-transparent'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => onSelectTab('bioscience')}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${currentTab === 'bioscience' ? 'text-amber-600 dark:text-amber-400 border-amber-500' : 'border-transparent'}`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Bioscience Lab</span>
            </button>

            <button
              onClick={() => setIsTraceabilityOpen(true)}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>SRS Matrix</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Switch to Resident Portal */}
            <button
              onClick={() => switchToPortal('user')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="View resident experience"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>View User Portal</span>
            </button>

            {/* Admin Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 text-xs border border-amber-300/50 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/40 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <div className="font-semibold text-neutral-900 dark:text-white truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400">
                  Head Administrator
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              title="Log out and return to Portal Selection"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-neutral-200/50 dark:border-white/10 scrollbar-none text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-amber-500 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('catalog')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${currentTab === 'catalog' ? 'bg-amber-500 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Catalog & Moderation
          </button>
          <button
            onClick={() => onSelectTab('rentals')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${currentTab === 'rentals' ? 'bg-amber-500 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Rentals
          </button>
          <button
            onClick={() => onSelectTab('security')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${currentTab === 'security' ? 'bg-amber-500 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Gate Desk
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${currentTab === 'reports' ? 'bg-amber-500 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Reports
          </button>
          <button
            onClick={() => onSelectTab('bioscience')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${currentTab === 'bioscience' ? 'bg-amber-500 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Bioscience
          </button>
          <button
            onClick={() => switchToPortal('user')}
            className="px-3 py-1 rounded-lg whitespace-nowrap text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            User Portal →
          </button>
        </div>

      </div>
    </header>
  );
};
