import React, { useState } from 'react';
import { ResourceItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, MapPin, MessageSquare, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface ItemCardProps {
  item: ResourceItem;
  onSelect: (item: ResourceItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => {
  const { currentUser, openChatWithLenderOrTaker, savedItemIds, toggleSaveItem } = useApp();
  const [imageError, setImageError] = useState(false);

  const isSaved = savedItemIds.includes(item.id);

  // Availability styling as clean text
  const getAvailabilityStatus = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="text-emerald-600 dark:text-emerald-400 font-medium">Available</span>;
      case 'reserved':
        return <span className="text-amber-600 dark:text-amber-400 font-medium">Reserved</span>;
      case 'in_use':
        return <span className="text-neutral-500 dark:text-neutral-400 font-medium">In Use</span>;
      case 'maintenance':
        return <span className="text-rose-600 dark:text-rose-400 font-medium">Maintenance</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const handleQuickChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    openChatWithLenderOrTaker({
      itemId: item.id,
      otherUserId: item.ownerId,
      initialMessage: `Hi ${item.ownerName}! I'm interested in borrowing your "${item.title}". Is it available?`
    });
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveItem(item.id);
  };

  return (
    <article 
      onClick={() => onSelect(item)}
      className="group ios-glass bg-white/85 dark:bg-neutral-900/70 border border-neutral-200/70 dark:border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/40 dark:hover:border-emerald-400/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col h-full focus-within:ring-2 focus-within:ring-emerald-500"
    >
      {/* Visual Media Frame */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800/60 overflow-hidden">
        {!imageError ? (
          <img 
            src={item.imageUrl} 
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 text-neutral-400 p-4 text-center">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">{item.category}</span>
            <span className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{item.title}</span>
          </div>
        )}

        {/* Category tag overlaid cleanly */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
            {item.category}
          </span>
          {item.isFeatured && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/90 text-white backdrop-blur-md shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Quick Action Buttons on Photo (Save & Chat) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {/* Wishlist Button */}
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
              isSaved 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400' 
                : 'bg-white/90 dark:bg-neutral-900/90 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
            title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Chat with Lender */}
          {currentUser.id !== item.ownerId && (
            <button
              onClick={handleQuickChat}
              className="p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-105 backdrop-blur-md shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100"
              title={`Chat with ${item.ownerName}`}
              aria-label={`Chat with ${item.ownerName}`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
            <span className="font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px]">
              {item.condition}
            </span>
            <span aria-hidden="true">·</span>
            {getAvailabilityStatus(item.availability)}
          </div>

          {/* Primary Title */}
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Pricing in ₹ and Owner Info */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-white/10 flex items-end justify-between">
          <div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Daily Rate</div>
            <div className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white font-mono tabular-nums">
              {item.rentalPricePerDay === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-sans font-semibold">Free Borrowing</span>
              ) : (
                <span>₹{item.rentalPricePerDay} <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">/ day</span></span>
              )}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono tabular-nums flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
              <span>₹{item.securityDeposit} deposit</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-end gap-1">
              <span>{item.ownerName}</span>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-end gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-neutral-400" />
              <span>{item.ownerFlat}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center text-amber-500 font-mono tabular-nums font-medium">
                <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                {item.ownerRating}
              </span>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
};
