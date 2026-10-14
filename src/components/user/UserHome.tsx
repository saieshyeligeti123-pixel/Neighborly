import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemCard } from '../catalog/ItemCard';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  MessageSquare, 
  Plus, 
  ShieldCheck, 
  Wrench, 
  UtensilsCrossed, 
  Tent, 
  Sparkle, 
  Tv, 
  Flower2, 
  Hammer, 
  Microscope,
  Bell,
  Heart
} from 'lucide-react';
import { ResourceItem } from '../../types';

export const UserHome: React.FC = () => {
  const { 
    currentUser, 
    items, 
    bookings, 
    conversations, 
    notifications, 
    setUserNavTab, 
    setSelectedCategory, 
    setSearchQuery, 
    setActiveItemModal,
    setIsAddItemOpen,
    setIsChatOpen
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');

  // Active bookings where user is borrower
  const myActiveBorrowings = bookings.filter(b => b.borrowerId === currentUser.id && (b.status === 'in_use' || b.status === 'approved'));
  
  // Incoming requests where user is owner
  const incomingRequests = bookings.filter(b => b.ownerId === currentUser.id && b.status === 'pending');

  // Featured community items
  const featuredItems = items.filter(i => i.isFeatured && i.availability === 'available').slice(0, 4);

  // Recently added listings
  const recentItems = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  // Popular items
  const popularItems = [...items].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 4);

  // Unread notifications for user
  const recentNotifs = notifications.filter(n => n.userId === currentUser.id).slice(0, 3);

  // Active chats
  const activeChats = conversations.filter(c => c.takerId === currentUser.id || c.lenderId === currentUser.id).slice(0, 2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setUserNavTab('explore');
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setUserNavTab('explore');
  };

  const categories = [
    { name: 'Indian Household & Kitchen', icon: UtensilsCrossed, count: items.filter(i => i.category === 'Indian Household & Kitchen').length, color: 'text-amber-500 bg-amber-500/10' },
    { name: 'Power Tools', icon: Wrench, count: items.filter(i => i.category === 'Power Tools').length, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Camping & Outdoors', icon: Tent, count: items.filter(i => i.category === 'Camping & Outdoors').length, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Cleaning & Washers', icon: Sparkle, count: items.filter(i => i.category === 'Cleaning & Washers').length, color: 'text-cyan-500 bg-cyan-500/10' },
    { name: 'Audio & Visual', icon: Tv, count: items.filter(i => i.category === 'Audio & Visual').length, color: 'text-purple-500 bg-purple-500/10' },
    { name: 'Gardening', icon: Flower2, count: items.filter(i => i.category === 'Gardening').length, color: 'text-lime-500 bg-lime-500/10' },
    { name: 'Home & DIY', icon: Hammer, count: items.filter(i => i.category === 'Home & DIY').length, color: 'text-orange-500 bg-orange-500/10' },
    { name: 'Bioscience & Lab', icon: Microscope, count: items.filter(i => i.category === 'Bioscience & Lab').length, color: 'text-teal-500 bg-teal-500/10' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Personalized Welcome Banner & Community Search */}
      <div className="ios-glass p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/70 border border-emerald-300/40 dark:border-emerald-800/50 mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Green Meadows Community Network</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Namaste, {currentUser.name}! 🌿
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Welcome to your resident dashboard for <strong className="text-neutral-900 dark:text-white">{currentUser.block}, Flat {currentUser.flatNumber}</strong> ({currentUser.residentType}). Borrow appliances and tools from trusted neighbors or earn by lending yours.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search mixer grinder, ladder, pressure washer, drill..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-300 dark:border-white/10 bg-white/80 dark:bg-black/60 text-neutral-900 dark:text-white text-xs sm:text-sm shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Search Catalog
            </button>
          </form>
        </div>

        {/* Action Shortcuts */}
        <div className="mt-6 pt-6 border-t border-neutral-200/50 dark:border-white/10 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-neutral-500 font-medium">Quick actions:</span>
          <button
            onClick={() => setIsAddItemOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300/40 dark:border-emerald-800/40 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List an Item You Own</span>
          </button>
          <button
            onClick={() => setUserNavTab('rentals')}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-200/70 transition-colors cursor-pointer"
          >
            View Active Bookings ({myActiveBorrowings.length})
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-200/70 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Open Resident Chat</span>
          </button>
        </div>
      </div>

      {/* Status Notifications / Action Banners (Upcoming returns, pending rental requests) */}
      {(myActiveBorrowings.length > 0 || incomingRequests.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Active borrowing alert */}
          {myActiveBorrowings.length > 0 && (
            <div className="p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900 dark:text-blue-300">
                    Active Rental in Progress
                  </div>
                  <div className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">
                    "{myActiveBorrowings[0].itemTitle}" is due on <span className="font-mono font-bold">{myActiveBorrowings[0].endDate}</span>.
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Lender: {myActiveBorrowings[0].ownerName} ({myActiveBorrowings[0].ownerFlat}) · Handover PIN: <strong className="font-mono">{myActiveBorrowings[0].handoverCode}</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setUserNavTab('rentals')}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Manage →
              </button>
            </div>
          )}

          {/* Incoming requests alert */}
          {incomingRequests.length > 0 && (
            <div className="p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    {incomingRequests.length} Incoming Rental Request{incomingRequests.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">
                    Neighbor {incomingRequests[0].borrowerName} ({incomingRequests[0].borrowerFlat}) requested your item.
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Schedule: {incomingRequests[0].startDate} to {incomingRequests[0].endDate}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setUserNavTab('rentals')}
                className="px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Review →
              </button>
            </div>
          )}

        </div>
      )}

      {/* Category Shortcuts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Browse by Category
            </h2>
            <p className="text-xs text-neutral-500">
              Popular household appliances and community gear at Green Meadows
            </p>
          </div>
          <button
            onClick={() => setUserNavTab('explore')}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="ios-glass p-3.5 rounded-2xl border border-neutral-200/60 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-center transition-all duration-200 hover:-translate-y-1 cursor-pointer group shadow-2xs flex flex-col items-center justify-between"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-tight">
                  {cat.name}
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">
                  {cat.count} item{cat.count === 1 ? '' : 's'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Items Showcase */}
      {featuredItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Featured Community Items
                </h2>
                <p className="text-xs text-neutral-500">
                  Verified high-quality gear frequently shared across towers
                </p>
              </div>
            </div>
            <button
              onClick={() => setUserNavTab('explore')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onSelect={(selected) => setActiveItemModal(selected)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Two Column Section: Recently Added & Resident Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Recently Added Listings */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Recently Added by Neighbors
              </h2>
              <p className="text-xs text-neutral-500">
                Fresh listings available for borrowing or renting this week
              </p>
            </div>
            <button
              onClick={() => setUserNavTab('explore')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onSelect={(selected) => setActiveItemModal(selected)} 
              />
            ))}
          </div>
        </section>

        {/* Right 1 Column: Activity, Recent Chats & Community Rules */}
        <div className="space-y-6">
          
          {/* Recent Messages Card */}
          <div className="ios-glass p-5 rounded-2xl border border-neutral-200/60 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>Recent Conversations</span>
              </h3>
              <button
                onClick={() => setUserNavTab('messages')}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer font-semibold"
              >
                View all
              </button>
            </div>

            {activeChats.length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-400">
                No active conversations yet. Chat with any lender directly from an item page!
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeChats.map(c => {
                  const otherName = c.lenderId === currentUser.id ? c.takerName : c.lenderName;
                  const otherFlat = c.lenderId === currentUser.id ? c.takerFlat : c.lenderFlat;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setUserNavTab('messages')}
                      className="w-full text-left p-3 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors text-xs cursor-pointer flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                        {otherName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-neutral-900 dark:text-white truncate">
                          {otherName} ({otherFlat})
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {c.lastMessage || 'Click to view conversation'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Green Meadows Community Sharing Trust */}
          <div className="ios-glass p-5 rounded-2xl border border-neutral-200/60 dark:border-white/10 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Neighborly Trust & Rules</span>
            </h3>

            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">1.</span>
                <span>All items are inspected at Gate 1 or directly between neighbors with 4-digit verification PINs.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">2.</span>
                <span>Security deposits in ₹ are held safely in community escrow until item return confirmation.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">3.</span>
                <span>Need support? The Estate Management Office and Gate Desk are available 24/7.</span>
              </div>
            </div>

            <button
              onClick={() => setUserNavTab('help')}
              className="w-full mt-2 py-2 px-3 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200/80 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-center cursor-pointer"
            >
              Read Community Borrowing Bylaws
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
