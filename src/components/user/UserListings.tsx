import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceItem, ItemAvailability } from '../../types';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Power,
  ShieldCheck,
  Star,
  MapPin
} from 'lucide-react';

export const UserListings: React.FC = () => {
  const { 
    currentUser, 
    items, 
    bookings, 
    deleteItem, 
    updateItem, 
    setIsAddItemOpen, 
    setActiveItemModal 
  } = useApp();

  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Items listed by current user
  const myListedItems = items.filter(i => i.ownerId === currentUser.id);

  const handleDelete = (itemId: string, title: string) => {
    if (confirm(`Are you sure you want to remove your listing for "${title}"?`)) {
      const res = deleteItem(itemId);
      setFeedback({ text: res.message, isError: !res.success });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleToggleAvailability = (item: ResourceItem) => {
    const newStatus: ItemAvailability = item.availability === 'available' ? 'maintenance' : 'available';
    updateItem(item.id, { availability: newStatus });
    setFeedback({
      text: newStatus === 'available' ? `"${item.title}" is now marked Available for neighbors.` : `"${item.title}" is paused / set to Unavailable.`,
      isError: false
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="ios-glass p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              Resident Resource Registry
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
              My Listed Items
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Share appliances and tools with neighbors in {currentUser.block}. You maintain complete control over availability, rental rates, and deposit requirements.
            </p>
          </div>

          <button
            onClick={() => setIsAddItemOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>List a New Item</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between ${feedback.isError ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40' : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40'}`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-neutral-400 hover:text-neutral-700">✕</button>
        </div>
      )}

      {/* Grid of User Listings */}
      {myListedItems.length === 0 ? (
        <div className="ios-glass p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 rounded-3xl border border-white/50 dark:border-white/10">
          <Package className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
            You haven't listed any resources yet
          </h3>
          <p className="mt-1 max-w-md mx-auto">
            Got an extra drill, steam iron, ladder, or wet grinder sitting idle? List it to help your neighbors and earn rental fees safely through community escrow.
          </p>
          <button
            onClick={() => setIsAddItemOpen(true)}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Your First Listing</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myListedItems.map(item => {
            const pendingRequests = bookings.filter(b => b.itemId === item.id && b.status === 'pending');
            const activeBooking = bookings.find(b => b.itemId === item.id && b.status === 'in_use');

            return (
              <div 
                key={item.id}
                className="ios-glass rounded-2xl border border-neutral-200/60 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                        item.availability === 'available'
                          ? 'bg-emerald-600 text-white'
                          : item.availability === 'in_use'
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}>
                        {item.availability === 'maintenance' ? 'Unavailable' : item.availability.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mb-0.5">
                      {item.category}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-neutral-100 dark:border-white/5">
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white font-mono">₹{item.rentalPricePerDay}</span>
                        <span className="text-[11px] text-neutral-500"> / day</span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Deposit: <strong className="font-mono text-neutral-700 dark:text-neutral-300">₹{item.securityDeposit}</strong>
                      </div>
                    </div>

                    {pendingRequests.length > 0 && (
                      <div className="mt-3 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''} awaiting your approval!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-3 bg-neutral-50/70 dark:bg-neutral-800/40 border-t border-neutral-200/50 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => setActiveItemModal(item)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-1 text-[11px]"
                    title="Preview listing"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                        item.availability === 'available'
                          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                      }`}
                      title={item.availability === 'available' ? 'Mark item temporarily unavailable' : 'Make available for neighbors'}
                    >
                      {item.availability === 'available' ? 'Mark Unavailable' : 'Make Available'}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                      title="Delete this listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
