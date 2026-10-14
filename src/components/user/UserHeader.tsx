import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Home, 
  Compass, 
  Clock, 
  Package, 
  MessageSquare, 
  Heart, 
  User as UserIcon, 
  HelpCircle, 
  Bell, 
  Plus, 
  Sun, 
  Moon, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRightLeft,
  Search
} from 'lucide-react';
import { UserNavTab } from '../../types';

interface UserHeaderProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenRegister: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  onOpenNotifications,
  onOpenProfile,
  onOpenRegister,
}) => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    userNavTab, 
    setUserNavTab, 
    notifications, 
    setIsAddItemOpen, 
    theme, 
    toggleTheme, 
    isChatOpen, 
    setIsChatOpen, 
    conversations,
    savedItemIds,
    switchToPortal,
    logout
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read && n.userId === currentUser.id).length;
  const residentUsers = users.filter(u => u.role !== 'admin');

  return (
    <header className="sticky top-0 z-30 ios-glass bg-white/75 dark:bg-black/65 border-b border-neutral-200/40 dark:border-white/10 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Brand Wordmark & Resident Portal Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setUserNavTab('home')}
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform font-bold text-base">
                N
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors whitespace-nowrap">
                    Neighborly
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 px-2 py-0.5 bg-emerald-100/80 dark:bg-emerald-950/70 rounded-md border border-emerald-300/40 dark:border-emerald-800/40">
                    Resident Portal
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                  Green Meadows Gated Community
                </div>
              </div>
            </button>
          </div>

          {/* Resident Navigation - 8 Core Tabs */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <button
              onClick={() => setUserNavTab('home')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${userNavTab === 'home' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500' : 'border-transparent'}`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setUserNavTab('explore')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${userNavTab === 'explore' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500' : 'border-transparent'}`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Items</span>
            </button>

            <button
              onClick={() => setUserNavTab('rentals')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${userNavTab === 'rentals' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500' : 'border-transparent'}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>My Rentals</span>
            </button>

            <button
              onClick={() => setUserNavTab('listings')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${userNavTab === 'listings' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500' : 'border-transparent'}`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>My Listings</span>
            </button>

            <button
              onClick={() => setUserNavTab('messages')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${userNavTab === 'messages' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500' : 'border-transparent'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Messages</span>
              {conversations.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 font-mono">
                  {conversations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setUserNavTab('wishlist')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${userNavTab === 'wishlist' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500' : 'border-transparent'}`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist</span>
              {savedItemIds.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-neutral-300 font-mono">
                  {savedItemIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setUserNavTab('profile')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${userNavTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500' : 'border-transparent'}`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setUserNavTab('help')}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${userNavTab === 'help' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500' : 'border-transparent'}`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help & Support</span>
            </button>
          </nav>

          {/* Right Action & Persona Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick Chat launcher */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer relative"
              title="Open Resident Chat Modal"
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
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <button 
              onClick={onOpenNotifications}
              className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {/* Primary Action CTA: List an Item */}
            <button 
              onClick={() => setIsAddItemOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Item</span>
            </button>

            {/* Resident Persona Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 text-xs border border-neutral-200 dark:border-white/10 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors text-left focus:outline-none cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {currentUser.block} · {currentUser.flatNumber}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-64 ios-glass bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl shadow-xl py-2 z-40"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-neutral-100 dark:border-white/10 text-[11px] text-neutral-400 font-semibold tracking-wider uppercase">
                    Current Resident Persona
                  </div>

                  <div className="px-3.5 py-2">
                    <div className="font-bold text-neutral-900 dark:text-white text-xs">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {currentUser.block}, Flat {currentUser.flatNumber} ({currentUser.residentType})
                    </div>
                    <div className="flex items-center gap-1 text-[11px] mt-1">
                      {currentUser.verificationStatus === 'verified' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Resident</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Pending Verification</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-white/10 my-1 pt-1">
                    <div className="px-3.5 py-1 text-[10px] text-neutral-400 uppercase font-semibold">
                      Switch Resident Account
                    </div>
                    {residentUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-white/5 cursor-pointer ${u.id === currentUser.id ? 'bg-neutral-50 dark:bg-white/5 font-semibold text-emerald-700 dark:text-emerald-400' : 'text-neutral-700 dark:text-neutral-300'}`}
                      >
                        <span>{u.name} ({u.flatNumber})</span>
                        <span className="text-[10px] text-neutral-400 font-normal">{u.block}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-neutral-100 dark:border-white/10 my-1 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Edit My Resident Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenRegister();
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Register Another Flat</span>
                    </button>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-white/10 my-1 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out / Switch Portal</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-neutral-200/50 dark:border-white/10 scrollbar-none text-xs">
          <button
            onClick={() => setUserNavTab('home')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${userNavTab === 'home' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Home
          </button>
          <button
            onClick={() => setUserNavTab('explore')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${userNavTab === 'explore' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Explore
          </button>
          <button
            onClick={() => setUserNavTab('rentals')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${userNavTab === 'rentals' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            My Rentals
          </button>
          <button
            onClick={() => setUserNavTab('listings')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${userNavTab === 'listings' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            My Listings
          </button>
          <button
            onClick={() => setUserNavTab('messages')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${userNavTab === 'messages' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Messages
          </button>
          <button
            onClick={() => setUserNavTab('wishlist')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${userNavTab === 'wishlist' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Wishlist
          </button>
          <button
            onClick={() => setUserNavTab('profile')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${userNavTab === 'profile' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setUserNavTab('help')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${userNavTab === 'help' ? 'bg-emerald-700 text-white font-bold' : 'text-neutral-600 dark:text-neutral-300'}`}
          >
            Help
          </button>
        </div>

      </div>
    </header>
  );
};
