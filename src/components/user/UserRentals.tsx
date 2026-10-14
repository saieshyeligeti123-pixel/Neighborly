import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, PaymentTransaction } from '../../types';
import { 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  ShieldCheck, 
  Key, 
  Calendar, 
  MessageSquare, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Star,
  MapPin
} from 'lucide-react';

export const UserRentals: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    transactions, 
    approveBooking, 
    rejectBooking, 
    completeReturn, 
    openChatWithLenderOrTaker, 
    setActiveBookingForPayment,
    setIsPaymentModalOpen,
    setActiveReviewBooking,
    reviews
  } = useApp();

  const [activeTab, setActiveTab] = useState<'borrowed' | 'incoming' | 'escrow'>('borrowed');
  const [actionAlert, setActionAlert] = useState<{ text: string; isError: boolean } | null>(null);

  // My Borrowings (Outgoing)
  const myBorrowings = bookings.filter(b => b.borrowerId === currentUser.id);

  // Requests for my items (Incoming)
  const myLendingRequests = bookings.filter(b => b.ownerId === currentUser.id);

  // My Transactions
  const myTransactions = transactions.filter(t => t.payerId === currentUser.id || t.recipientId === currentUser.id);

  const handleApprove = (bookingId: string) => {
    approveBooking(bookingId);
    setActionAlert({ text: 'Booking request approved! Borrower has been notified to provide deposit & pickup.', isError: false });
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleReject = (bookingId: string) => {
    rejectBooking(bookingId, 'Unavailable during selected period');
    setActionAlert({ text: 'Booking request declined.', isError: false });
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleReturnItem = (bookingId: string, itemTitle: string) => {
    if (confirm(`Confirm physical return and condition check for "${itemTitle}"? Deposit will be marked for refund.`)) {
      const res = completeReturn(bookingId);
      setActionAlert({ text: res.message, isError: !res.success });
      setTimeout(() => setActionAlert(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="ios-glass p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              Rental & Borrowing Schedule
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
              My Community Rentals
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Manage your active reservations, incoming neighbor requests, pickup verification PINs, and refundable security deposits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40 font-semibold">
              {myBorrowings.length} Outgoing · {myLendingRequests.length} Incoming
            </span>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-neutral-200/50 dark:border-white/10 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('borrowed')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'borrowed' ? 'bg-emerald-700 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>My Borrowings (Outgoing) ({myBorrowings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'incoming' ? 'bg-emerald-700 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Requests for My Items (Incoming) ({myLendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'escrow' ? 'bg-emerald-700 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Security Deposit & Escrow Ledger</span>
          </button>
        </div>
      </div>

      {actionAlert && (
        <div className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between ${actionAlert.isError ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40' : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40'}`}>
          <span>{actionAlert.text}</span>
          <button onClick={() => setActionAlert(null)} className="text-neutral-400 hover:text-neutral-700">✕</button>
        </div>
      )}

      {/* Tab 1: My Borrowings */}
      {activeTab === 'borrowed' && (
        <div className="space-y-4">
          {myBorrowings.length === 0 ? (
            <div className="ios-glass p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 rounded-3xl border border-white/50 dark:border-white/10">
              <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">No active or past borrowing requests.</p>
              <p className="mt-1">Browse the Explore catalog to find appliances, power tools, or camping gear for your home!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myBorrowings.map(b => {
                const isOverdue = b.isOverdue || (b.status === 'in_use' && new Date(b.endDate) < new Date());
                const hasReviewed = reviews.some(r => r.bookingId === b.id && r.reviewerId === currentUser.id);

                return (
                  <div 
                    key={b.id} 
                    className="ios-glass p-5 rounded-2xl border border-neutral-200/60 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img 
                        src={b.itemImage} 
                        alt={b.itemTitle}
                        className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-white/10 shrink-0 bg-neutral-100"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isOverdue
                              ? 'bg-rose-600 text-white'
                              : b.status === 'in_use'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : b.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : b.status === 'completed'
                              ? 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {isOverdue ? 'Overdue Return' : b.status.replace('_', ' ')}
                          </span>

                          <span className="text-[11px] text-neutral-500">
                            Lender: <strong className="text-neutral-800 dark:text-neutral-200">{b.ownerName}</strong> ({b.ownerFlat})
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                          {b.itemTitle}
                        </h3>

                        <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{b.startDate} → {b.endDate}</span>
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                            Total: ₹{b.totalAmount} (Fee: ₹{b.rentalFee} + Deposit: ₹{b.securityDeposit})
                          </span>
                        </div>

                        {b.status === 'in_use' && (
                          <div className="mt-2 text-xs flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                            <Key className="w-3.5 h-3.5" />
                            <span>Handover PIN: <strong className="font-mono tracking-widest bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded">{b.handoverCode}</strong></span>
                            <span className="text-neutral-400 text-[11px]">(Show at Gate 1 or directly to lender upon return)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-white/5 shrink-0">
                      
                      {b.status === 'approved' && b.paymentStatus === 'pending' && (
                        <button
                          onClick={() => {
                            setActiveBookingForPayment(b);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Deposit (₹{b.totalAmount})</span>
                        </button>
                      )}

                      {b.status === 'in_use' && (
                        <button
                          onClick={() => handleReturnItem(b.id, b.itemTitle)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Initiate Return Handover</span>
                        </button>
                      )}

                      {b.status === 'completed' && !hasReviewed && (
                        <button
                          onClick={() => setActiveReviewBooking(b)}
                          className="px-3.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Rate Lender</span>
                        </button>
                      )}

                      <button
                        onClick={() => openChatWithLenderOrTaker({ itemId: b.itemId, bookingId: b.id, otherUserId: b.ownerId, initialMessage: `Hello ${b.ownerName}, regarding my booking for "${b.itemTitle}"...` })}
                        className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Chat Lender</span>
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Requests for My Items */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {myLendingRequests.length === 0 ? (
            <div className="ios-glass p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 rounded-3xl border border-white/50 dark:border-white/10">
              <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">No incoming rental requests from neighbors right now.</p>
              <p className="mt-1">List your high-utility appliances or tools to start lending to residents in your tower!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myLendingRequests.map(b => (
                <div 
                  key={b.id} 
                  className="ios-glass p-5 rounded-2xl border border-neutral-200/60 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={b.itemImage} 
                      alt={b.itemTitle}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-white/10 shrink-0 bg-neutral-100"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : b.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>

                        <span className="text-[11px] text-neutral-500">
                          Borrower: <strong className="text-neutral-800 dark:text-neutral-200">{b.borrowerName}</strong> (Flat {b.borrowerFlat})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {b.itemTitle}
                      </h3>

                      <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 flex flex-wrap items-center gap-3">
                        <span className="font-mono">{b.startDate} to {b.endDate} ({b.daysCount} days)</span>
                        <span>·</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Rental Fee Earned: ₹{b.rentalFee}
                        </span>
                        <span>·</span>
                        <span className="text-neutral-500">
                          Refundable Escrow: ₹{b.securityDeposit}
                        </span>
                      </div>

                      {b.purposeNote && (
                        <div className="mt-2 text-xs italic text-neutral-500">
                          Note from neighbor: "{b.purposeNote}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Incoming Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-white/5 shrink-0">
                    
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(b.id)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Request</span>
                        </button>

                        <button
                          onClick={() => handleReject(b.id)}
                          className="px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-xl transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => openChatWithLenderOrTaker({ itemId: b.itemId, bookingId: b.id, otherUserId: b.borrowerId, initialMessage: `Hello ${b.borrowerName}, regarding your request to borrow my ${b.itemTitle}...` })}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Chat Borrower</span>
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Security Deposit & Escrow Ledger */}
      {activeTab === 'escrow' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
              <div className="font-bold text-neutral-900 dark:text-white">
                Green Meadows Escrow Protection Policy
              </div>
              <p>
                All security deposits in INR (₹) are held securely by the Resident Association account until the item is returned in agreed condition. Returns verified at Gate 1 release escrow back to your original payment method automatically.
              </p>
            </div>
          </div>

          <div className="ios-glass rounded-2xl border border-white/50 dark:border-white/10 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 font-semibold border-b border-neutral-200/50 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3">Receipt / Date</th>
                    <th className="px-4 py-3">Resource Item</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Rental Fee</th>
                    <th className="px-4 py-3">Refundable Deposit</th>
                    <th className="px-4 py-3">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/40 dark:divide-white/5">
                  {myTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div className="font-bold text-neutral-800 dark:text-neutral-200">{t.receiptNumber}</div>
                        <div className="text-neutral-400">{t.timestamp}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                        {t.itemTitle}
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                        {t.paymentMethod}
                      </td>
                      <td className="px-4 py-3 font-mono text-neutral-900 dark:text-white">
                        ₹{t.rentalAmount}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        ₹{t.securityDeposit}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          t.depositStatus === 'held_in_escrow'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {t.depositStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
