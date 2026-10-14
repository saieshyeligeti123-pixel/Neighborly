import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, Lock, Building2 } from 'lucide-react';

export const AdminAccessDenied: React.FC = () => {
  const { currentUser, setPortalMode, logout } = useApp();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="ios-glass max-w-md w-full p-8 rounded-3xl border border-rose-300/50 dark:border-rose-900/40 bg-white/80 dark:bg-neutral-900/80 shadow-2xl text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Access Denied
        </h2>

        <div className="mt-2 text-xs text-rose-700 dark:text-rose-400 font-semibold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/40 inline-block">
          Administrator Privileges Required
        </div>

        <p className="mt-4 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          You are currently signed in as <strong className="text-neutral-900 dark:text-white">{currentUser.name}</strong> ({currentUser.block}, Flat {currentUser.flatNumber}). This account has role <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono font-bold text-neutral-800 dark:text-neutral-200">resident</code> and is not authorized to access the Green Meadows Administrator Portal.
        </p>

        <div className="mt-6 p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-500 text-left space-y-1">
          <div className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <p>
            Administrative privileges are strictly restricted to Estate Office accounts with verified claims. Unauthorized URL or state overrides are blocked.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => setPortalMode('user')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Return to Resident Portal</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2 px-4 rounded-xl border border-neutral-300 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Switch Account / Log Out
          </button>
        </div>

      </div>
    </div>
  );
};
