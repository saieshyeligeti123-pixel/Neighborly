import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserHeader } from './UserHeader';
import { UserHome } from './UserHome';
import { UserExplore } from './UserExplore';
import { UserRentals } from './UserRentals';
import { UserListings } from './UserListings';
import { UserMessages } from './UserMessages';
import { UserWishlist } from './UserWishlist';
import { UserProfile } from './UserProfile';
import { UserHelp } from './UserHelp';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { ProfileModal } from '../profile/ProfileModal';
import { RegisterModal } from '../auth/RegisterModal';
import { FileCheck, MessageSquare } from 'lucide-react';

export const UserPortal: React.FC = () => {
  const { 
    userNavTab, 
    setIsTraceabilityOpen, 
    isChatOpen, 
    setIsChatOpen, 
    conversations 
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Resident Navigation Header */}
      <UserHeader
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Main Resident Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {userNavTab === 'home' && <UserHome />}
        {userNavTab === 'explore' && <UserExplore />}
        {userNavTab === 'rentals' && <UserRentals />}
        {userNavTab === 'listings' && <UserListings />}
        {userNavTab === 'messages' && <UserMessages />}
        {userNavTab === 'wishlist' && <UserWishlist />}
        {userNavTab === 'profile' && <UserProfile onOpenEditProfile={() => setIsProfileOpen(true)} />}
        {userNavTab === 'help' && <UserHelp />}
      </main>

      {/* Resident Clean Footer */}
      <footer className="mt-auto border-t border-neutral-200/40 dark:border-white/10 ios-glass bg-white/40 dark:bg-black/40 py-6 no-print relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-900 dark:text-white">Neighborly</span>
            <span aria-hidden="true">·</span>
            <span>Green Meadows Resident Resource Sharing & Borrowing Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTraceabilityOpen(true)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-medium text-emerald-700 dark:text-emerald-400"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>IEEE Std 830-1998 Traceability Matrix</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Green Meadows Residences</span>
          </div>
        </div>
      </footer>

      {/* Floating Resident Chat Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <button
          onClick={() => setIsChatOpen(true)}
          className="ios-glass bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-full px-4 py-3 shadow-xl hover:shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20 active:scale-95 group"
          title="Open Resident Chat (Lender ↔ Taker)"
          aria-label="Open resident chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            {conversations.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-600 rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-xs font-bold tracking-wide">
            Resident Chat
          </span>
          {conversations.length > 0 && (
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
              {conversations.length}
            </span>
          )}
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* Register Resident Modal */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />

    </div>
  );
};
