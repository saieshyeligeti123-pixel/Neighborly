import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  ShieldCheck, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Calendar,
  Key,
  Layers
} from 'lucide-react';

export const AdminRentalMonitor: React.FC = () => {
  const { bookings, transactions, completeReturn } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Summary Metrics
  const activeBookings = bookings.filter(b => b.status === 'in_use');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const overdueBookings = bookings.filter(b => b.isOverdue || (b.status === 'in_use' && new Date(b.endDate) < new Date()));
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const totalEscrowHeld = transactions
    .filter(t => t.depositStatus === 'held_in_escrow')
    .reduce((acc, t) => acc + t.securityDeposit, 0);

  const filtered = bookings.filter(b => {
    const matchesSearch = b.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.borrowerFlat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.ownerFlat.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'in_use') return b.status === 'in_use';
    if (filterStatus === 'pending') return b.status === 'pending';
    if (filterStatus === 'overdue') return b.isOverdue || (b.status === 'in_use' && new Date(b.endDate) < new Date());
    if (filterStatus === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="ios-glass p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xs">
        <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
          Community Operations & Lending Oversight
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
          Rental Request Monitoring
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
          Live monitor of all community borrowing requests, active loans, Gate Desk handovers, return schedules, and escrow deposits in ₹.
        </p>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40">
            <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">
              Active Loans
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-white mt-1">
              {activeBookings.length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40">
            <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              Pending Approvals
            </div>
            <div className="text-2xl font-bold text-amber-900 dark:text-white mt-1">
              {pendingBookings.length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/40">
            <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
              Overdue Returns
            </div>
            <div className="text-2xl font-bold text-rose-900 dark:text-white mt-1">
              {overdueBookings.length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              Escrow Held
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-white mt-1 font-mono">
              ₹{totalEscrowHeld.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="ios-glass p-4 rounded-xl border border-white/40 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by item, borrower, owner or flat..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${filterStatus === 'all' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setFilterStatus('in_use')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${filterStatus === 'in_use' ? 'bg-blue-600 text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            In Use ({activeBookings.length})
          </button>
          <button
            onClick={() => setFilterStatus('overdue')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${filterStatus === 'overdue' ? 'bg-rose-600 text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            Overdue ({overdueBookings.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${filterStatus === 'completed' ? 'bg-emerald-600 text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            Completed ({completedBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="ios-glass rounded-2xl border border-white/40 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 font-semibold border-b border-neutral-200/50 dark:border-white/10">
              <tr>
                <th className="px-4 py-3">Resource Item</th>
                <th className="px-4 py-3">Borrower (Taker)</th>
                <th className="px-4 py-3">Owner (Lender)</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Charges & Deposit</th>
                <th className="px-4 py-3">Handover PIN</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/40 dark:divide-white/5">
              {filtered.map(booking => {
                const isOverdue = booking.isOverdue || (booking.status === 'in_use' && new Date(booking.endDate) < new Date());

                return (
                  <tr key={booking.id} className={`hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors ${isOverdue ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''}`}>
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={booking.itemImage}
                          alt={booking.itemTitle}
                          className="w-10 h-10 rounded-lg object-cover border border-neutral-200 dark:border-white/10 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <div className="line-clamp-1">{booking.itemTitle}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">ID: {booking.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {booking.borrowerName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Flat {booking.borrowerFlat}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {booking.ownerName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Flat {booking.ownerFlat}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px]">
                      <div>{booking.startDate} → {booking.endDate}</div>
                      <div className="text-[10px] text-neutral-400">{booking.daysCount} days</div>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        Fee: ₹{booking.rentalFee}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        Deposit: ₹{booking.securityDeposit} ({booking.paymentStatus})
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/10 text-[11px] font-bold tracking-widest text-neutral-800 dark:text-neutral-200">
                        {booking.handoverCode}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isOverdue 
                          ? 'bg-rose-600 text-white' 
                          : booking.status === 'in_use'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : booking.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : booking.status === 'completed'
                          ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {isOverdue ? 'OVERDUE' : booking.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
