import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, PaymentTransaction, ResourceItem } from '../../types';
import { 
  Package, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  ShieldCheck, 
  Star, 
  Trash2, 
  ExternalLink, 
  AlertCircle,
  Key,
  Calendar,
  MessageSquare,
  Heart,
  Plus,
  RefreshCw,
  Info
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    items, 
    bookings, 
    transactions, 
    approveBooking, 
    rejectBooking, 
    completeReturn, 
    deleteItem,
    setActiveItemModal,
    setActiveBookingForPayment,
    setIsPaymentModalOpen,
    setActiveReviewBooking,
    reviews,
    openChatWithLenderOrTaker,
    setIsAddItemOpen,
    conversations,
    savedItemIds,
    toggleSaveItem,
    setIsChatOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'borrowed' | 'incoming' | 'listed' | 'saved' | 'chats' | 'payments'>('borrowed');
  const [deleteAlert, setDeleteAlert] = useState<{ message: string; isError: boolean } | null>(null);

  // Filter bookings where currentUser is borrower
  const myBorrowings = bookings.filter(b => b.borrowerId === currentUser.id);

  // Filter bookings where currentUser is owner
  const myLendingRequests = bookings.filter(b => b.ownerId === currentUser.id);

  // Filter items owned by currentUser
  const myListedItems = items.filter(i => i.ownerId === currentUser.id);

  // Saved items
  const mySavedItems = items.filter(i => savedItemIds.includes(i.id));

  // Filter transactions involving currentUser
  const myTransactions = transactions.filter(
    t => t.payerId === currentUser.id || t.recipientId === currentUser.id
  );

  // Active conversations for current user
  const myConversations = conversations.filter(
    c => c.lenderId === currentUser.id || c.takerId === currentUser.id
  );

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <span className="text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 text-[11px]">Pending Approval</span>;
      case 'approved':
        return <span className="text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 text-[11px]">Approved · Pay Escrow</span>;
      case 'in_use':
        return <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px]">Active (In Use)</span>;
      case 'completed':
        return <span className="text-neutral-500 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-[11px]">Returned & Completed</span>;
      case 'rejected':
        return <span className="text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800 text-[11px]">Declined</span>;
      case 'cancelled':
        return <span className="text-neutral-400 font-medium text-[11px]">Cancelled</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      const res = deleteItem(id);
      if (!res.success) {
        setDeleteAlert({ message: res.message, isError: true });
      } else {
        setDeleteAlert({ message: res.message, isError: false });
        setTimeout(() => setDeleteAlert(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Header & Metrics Banner */}
      <div className="ios-glass p-6 sm:p-7 rounded-3xl border border-white/60 dark:border-white/10 shadow-xs bg-white/80 dark:bg-neutral-900/70">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Green Meadows Resident Dashboard
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Welcome back, {currentUser.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 flex-wrap">
              <span>{currentUser.block}, Flat {currentUser.flatNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{currentUser.residentType}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Verified Resident</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-5 sm:gap-6 text-right">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">My Items</div>
              <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono tabular-nums">{myListedItems.length}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Active Loans</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {myBorrowings.filter(b => b.status === 'in_use' || b.status === 'approved').length}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Resident Rating</div>
              <div className="text-lg font-bold text-amber-500 font-mono tabular-nums flex items-center justify-end">
                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                {currentUser.rating}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-neutral-200/60 dark:border-white/10 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('borrowed')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'borrowed' 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            My Borrowings ({myBorrowings.length})
          </button>
          
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'incoming' 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Incoming Requests ({myLendingRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('listed')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'listed' 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            My Listed Resources ({myListedItems.length})
          </button>

          <button
            onClick={() => setActiveTab('chats')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chats' 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Resident Chats ({myConversations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved' 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Wishlist ({mySavedItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'payments' 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Escrow & Payments ({myTransactions.length})
          </button>
        </div>
      </div>

      {deleteAlert && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${deleteAlert.isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{deleteAlert.message}</span>
          </div>
          <button onClick={() => setDeleteAlert(null)} className="text-neutral-400 hover:text-neutral-800 cursor-pointer">
            ×
          </button>
        </div>
      )}

      {/* Tab 1: Borrowed Resources */}
      {activeTab === 'borrowed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Outgoing Borrowing Requests & Active Loans
            </h3>
          </div>

          {myBorrowings.length === 0 ? (
            <div className="ios-glass border border-neutral-200/60 dark:border-white/10 rounded-3xl p-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
              You haven't requested any resources yet. Browse the community catalog to borrow tools or kitchen items!
            </div>
          ) : (
            <div className="space-y-3">
              {myBorrowings.map(b => (
                <div key={b.id} className="ios-glass bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  
                  <div className="flex items-start gap-3.5">
                    <img 
                      src={b.itemImage} 
                      alt={b.itemTitle} 
                      className="w-16 h-16 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200/50"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">{b.itemTitle}</span>
                        {getStatusBadge(b.status)}
                        {b.isOverdue && (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800 animate-pulse">
                            Overdue ({b.overdueDays}d)
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        Lender: <strong className="text-neutral-800 dark:text-neutral-200">{b.ownerName}</strong> ({b.ownerFlat})
                      </div>

                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-3 font-mono tabular-nums flex-wrap">
                        <span>Dates: {b.startDate} to {b.endDate} ({b.daysCount} days)</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Total: ₹{b.totalAmount} (₹{b.rentalFee} rent + ₹{b.securityDeposit} deposit)
                        </span>
                      </div>

                      {/* Handover Code if approved or in use */}
                      {(b.status === 'approved' || b.status === 'in_use') && (
                        <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                          <Key className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-neutral-600 dark:text-neutral-300">Pickup Handover Verification Code:</span>
                          <span className="font-mono font-bold tracking-widest text-emerald-800 dark:text-emerald-300 text-sm">{b.handoverCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for Borrower */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
                    <button
                      onClick={() => openChatWithLenderOrTaker({
                        itemId: b.itemId,
                        bookingId: b.id,
                        otherUserId: b.ownerId,
                        initialMessage: `Hi ${b.ownerName}! Quick question about our booking for "${b.itemTitle}".`
                      })}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Lender</span>
                    </button>

                    {b.status === 'approved' && b.paymentStatus === 'pending' && (
                      <button
                        onClick={() => {
                          setActiveBookingForPayment(b);
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Escrow (₹{b.totalAmount})</span>
                      </button>
                    )}

                    {b.status === 'completed' && (
                      <button
                        onClick={() => setActiveReviewBooking(b)}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Review Lender</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Requests on My Listed Items */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Requests Received from Neighbors on My Resources
            </h3>
          </div>

          {myLendingRequests.length === 0 ? (
            <div className="ios-glass border border-neutral-200/60 dark:border-white/10 rounded-3xl p-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
              No borrowing requests currently pending for your listed items.
            </div>
          ) : (
            <div className="space-y-3">
              {myLendingRequests.map(b => (
                <div key={b.id} className="ios-glass bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1 flex-wrap">
                      <span>Resource: <strong className="text-neutral-900 dark:text-white">{b.itemTitle}</strong></span>
                      <span aria-hidden="true">·</span>
                      {getStatusBadge(b.status)}
                    </div>
                    <div className="text-xs text-neutral-700 dark:text-neutral-300">
                      Neighbor: <strong className="text-neutral-900 dark:text-white">{b.borrowerName}</strong> ({b.borrowerFlat}) · Phone: {b.borrowerPhone}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-3 font-mono tabular-nums flex-wrap">
                      <span>Dates: {b.startDate} to {b.endDate} ({b.daysCount} days)</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        ₹{b.totalAmount} (₹{b.rentalFee} rent + ₹{b.securityDeposit} deposit)
                      </span>
                    </div>
                    {b.purposeNote && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 italic">
                        "{b.purposeNote}"
                      </div>
                    )}
                  </div>

                  {/* Actions for Lender */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
                    <button
                      onClick={() => openChatWithLenderOrTaker({
                        itemId: b.itemId,
                        bookingId: b.id,
                        otherUserId: b.borrowerId,
                        initialMessage: `Hi ${b.borrowerName}! Regarding your request for "${b.itemTitle}".`
                      })}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Taker</span>
                    </button>

                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveBooking(b.id)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => rejectBooking(b.id, 'Resource unavailable for requested dates')}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {b.status === 'in_use' && (
                      <button
                        onClick={() => {
                          if (confirm(`Confirm safe return inspection of "${b.itemTitle}" and release deposit back to borrower?`)) {
                            completeReturn(b.id);
                          }
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-xl cursor-pointer"
                      >
                        Confirm Return & Release Deposit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Listed Resources */}
      {activeTab === 'listed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              My Listed Household Resources
            </h3>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List New Resource</span>
            </button>
          </div>

          {myListedItems.length === 0 ? (
            <div className="ios-glass border border-neutral-200/60 dark:border-white/10 rounded-3xl p-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
              <Package className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p>You haven't listed any household resources yet.</p>
              <button
                onClick={() => setIsAddItemOpen(true)}
                className="mt-3 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl cursor-pointer"
              >
                List your first item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListedItems.map(item => (
                <div key={item.id} className="ios-glass bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      <span>{item.category}</span>
                      <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">{item.availability}</span>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">{item.title}</h4>
                    <div className="text-xs font-mono tabular-nums text-neutral-700 dark:text-neutral-300 mt-1">
                      {item.rentalPricePerDay === 0 ? 'Free Borrowing' : `₹${item.rentalPricePerDay} / day`} · ₹{item.securityDeposit} deposit
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={() => setActiveItemModal(item)}
                      className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 font-semibold cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Resident Chats */}
      {activeTab === 'chats' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Resident-to-Resident Messages
            </h3>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl cursor-pointer"
            >
              Open Full Chat Window
            </button>
          </div>

          {myConversations.length === 0 ? (
            <div className="ios-glass border border-neutral-200/60 dark:border-white/10 rounded-3xl p-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
              <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p>No chat conversations yet. You can start a chat with any lender directly from the catalog!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myConversations.map(conv => {
                const isLender = conv.lenderId === currentUser.id;
                const otherName = isLender ? conv.takerName : conv.lenderName;
                const otherFlat = isLender ? conv.takerFlat : conv.lenderFlat;
                const myRole = isLender ? 'Lender' : 'Taker';

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      openChatWithLenderOrTaker({
                        itemId: conv.itemId,
                        bookingId: conv.bookingId,
                        otherUserId: isLender ? conv.takerId : conv.lenderId
                      });
                    }}
                    className="ios-glass bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-emerald-500/50 transition-colors cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                        {otherName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">{otherName}</span>
                          <span className="text-[11px] text-neutral-400">{otherFlat}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            You: {myRole}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-300 font-medium mt-0.5">
                          Resource: {conv.itemTitle}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1 italic">
                          "{conv.lastMessage || 'Click to continue conversation'}"
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-neutral-400 font-mono">{conv.lastMessageTimestamp}</div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
                        Open Chat →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Wishlist / Saved Items */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              My Saved Items & Wishlist
            </h3>
            <span className="text-xs text-neutral-400">{mySavedItems.length} saved</span>
          </div>

          {mySavedItems.length === 0 ? (
            <div className="ios-glass border border-neutral-200/60 dark:border-white/10 rounded-3xl p-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
              <Heart className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p>You haven't saved any items yet. Click the heart icon on any resource card to save it here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySavedItems.map(item => (
                <div key={item.id} className="ios-glass bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="relative aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleSaveItem(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 text-rose-600 shadow cursor-pointer"
                      title="Remove from saved"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{item.category}</div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1 mt-0.5">{item.title}</h4>
                      <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {item.rentalPricePerDay === 0 ? 'Free' : `₹${item.rentalPricePerDay}/day`} · ₹{item.securityDeposit} deposit
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">{item.ownerFlat}</span>
                      <button
                        onClick={() => setActiveItemModal(item)}
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Borrow Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Escrow Deposits & Transactions */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Green Meadows Escrow Protection & Transactions
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Escrow Protection Active:</strong> Security deposits are safely locked in the Green Meadows Resident Escrow Fund. When you return the borrowed resource undamaged, the deposit is instantly refunded to your UPI account or resident wallet.
            </div>
          </div>

          {myTransactions.length === 0 ? (
            <div className="ios-glass border border-neutral-200/60 dark:border-white/10 rounded-3xl p-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {myTransactions.map(tx => (
                <div key={tx.id} className="ios-glass bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">{tx.itemTitle}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Method: {tx.paymentMethod} · TxID: <span className="font-mono">{tx.id}</span>
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 flex items-center gap-2">
                      <span>Deposit Status: <strong className="text-emerald-700 dark:text-emerald-400 capitalize">{tx.depositStatus.replace(/_/g, ' ')}</strong></span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-extrabold font-mono text-neutral-900 dark:text-white tabular-nums">
                      ₹{tx.totalPaid}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      (₹{tx.rentalAmount} rent + ₹{tx.securityDeposit} deposit)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
