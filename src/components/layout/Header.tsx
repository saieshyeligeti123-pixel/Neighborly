import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  Sun,
  Moon,
  FlaskConical,
  MessageSquare
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenNotifications, 
  onOpenProfile, 
  onOpenRegister 
}) => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    activeView, 
    setActiveView, 
    notifications, 
    setIsAddItemOpen, 
    setIsTraceabilityOpen,
    theme,
    toggleTheme,
    setIsChatOpen,
    conversations
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read && (n.userId === currentUser.id || currentUser.role === 'admin')).length;

  return (
    <header className="sticky top-0 z-30 ios-glass bg-white/75 dark:bg-black/65 border-b border-neutral-200/40 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveView('browse')}
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform font-bold text-base">
                N
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors whitespace-nowrap">
                  Neighborly
                </span>
                <span className="hidden sm:inline-block text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                  Green Meadows
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <button 
              onClick={() => setActiveView('browse')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${activeView === 'browse' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
            >
              Catalog
            </button>
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${activeView === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
            >
              My Dashboard
            </button>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 border-transparent flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Resident Chat</span>
              {conversations.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 font-mono">
                  {conversations.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveView('bioscience')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 flex items-center gap-1.5 ${activeView === 'bioscience' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bioscience Lab</span>
            </button>
            {currentUser.role === 'admin' && (
              <button 
                onClick={() => setActiveView('admin')}
                className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${activeView === 'admin' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
              >
                Admin
              </button>
            )}
            <button 
              onClick={() => setActiveView('reports')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${activeView === 'reports' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
            >
              Reports
            </button>
            <button 
              onClick={() => setActiveView('security')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${activeView === 'security' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold' : 'border-transparent'}`}
            >
              Gate Desk
            </button>
            <button 
              onClick={() => setIsTraceabilityOpen(true)}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>SRS Matrix</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Direct Resident Chat Icon */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer relative"
              title="Open Resident Chat (Lender ↔ Taker)"
              aria-label="Open chat"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {conversations.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            {/* iOS Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {/* Notification Bell */}
            <button 
              onClick={onOpenNotifications}
              className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors focus:outline-none cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {/* List an Item Primary CTA */}
            <button 
              onClick={() => setIsAddItemOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Item</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 text-xs border border-neutral-200 dark:border-white/10 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors text-left focus:outline-none cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block">
                  <div className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {currentUser.flatNumber} · {currentUser.verificationStatus}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-64 ios-glass bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl shadow-xl py-1.5 z-40"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-neutral-100 dark:border-white/10 text-[11px] text-neutral-400 font-semibold tracking-wider uppercase">
                    Switch Test Persona (SRS Team)
                  </div>
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-white/5 cursor-pointer ${u.id === currentUser.id ? 'bg-neutral-50 dark:bg-white/5 font-medium text-emerald-700 dark:text-emerald-400' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <div>
                        <div className="font-medium text-neutral-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{u.block} · {u.flatNumber}</div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        {u.verificationStatus === 'verified' ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                  
                  <div className="border-t border-neutral-100 dark:border-white/10 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Edit My Resident Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenRegister();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Register New Resident</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
