import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const SecurityDesk: React.FC = () => {
  const { bookings, handoverPickup, completeReturn } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [actionMessage, setActionMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Bookings ready for pickup (approved & paid)
  const pickupQueue = bookings.filter(b => b.status === 'approved' && b.paymentStatus === 'paid');

  // Bookings currently active / in use that can be returned at the gate
  const returnQueue = bookings.filter(b => b.status === 'in_use');

  const handleVerifyHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      setActionMessage({ text: 'Please select a pending booking from the queue.', isError: true });
      return;
    }

    const res = handoverPickup(selectedBookingId, inputCode);
    setActionMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setInputCode('');
      setSelectedBookingId('');
    }
  };

  const handleGateReturn = (bookingId: string, itemTitle: string) => {
    if (confirm(`Confirm physical return and condition check for "${itemTitle}" at Gate Desk?`)) {
      const res = completeReturn(bookingId);
      setActionMessage({ text: res.message, isError: !res.success });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Security Header */}
      <div className="ios-glass p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
              Clubhouse & Gate 1 Handover Desk
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              Community Resource Handover & Inspection Console
            </h1>
          </div>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
          Security and support staff can verify 4-digit borrower handover codes, confirm physical asset dispatch, and process item check-in returns when neighbors drop off resources at the gate.
        </p>
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-lg border text-xs flex items-center justify-between ${actionMessage.isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
          <div className="flex items-center gap-2">
            {actionMessage.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span className="font-semibold">{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-neutral-400 hover:text-neutral-800">
            ×
          </button>
        </div>
      )}

      {/* Verification Code Form */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-700" />
          <span>Verify Borrower Pickup Code (Handover Dispatch)</span>
        </h3>

        <form onSubmit={handleVerifyHandover} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Select Scheduled Pickup Booking
            </label>
            <select
              value={selectedBookingId}
              onChange={e => setSelectedBookingId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Select from {pickupQueue.length} verified pickups --</option>
              {pickupQueue.map(b => (
                <option key={b.id} value={b.id}>
                  {b.itemTitle} · Borrower: {b.borrowerName} ({b.borrowerFlat})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Enter 4-Digit Handover Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="e.g. 7392"
                className="w-full px-3 py-2 text-xs font-mono tracking-widest text-center font-bold border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Verify & Dispatch
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Two Column Queues: Scheduled Pickups & Returns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Awaiting Pickup Queue */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center justify-between">
            <span>Awaiting Handover Dispatch</span>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">{pickupQueue.length} items</span>
          </h3>

          {pickupQueue.length === 0 ? (
            <div className="text-xs text-neutral-400 py-6 text-center">
              No items currently waiting for pickup at the desk.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pickupQueue.map(b => (
                <div key={b.id} className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900">{b.itemTitle}</div>
                    <div className="text-neutral-500 text-[11px] mt-0.5">
                      Borrower: {b.borrowerName} ({b.borrowerFlat}) · Code: <span className="font-mono font-bold text-neutral-800">{b.handoverCode}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBookingId(b.id);
                      setInputCode(b.handoverCode);
                    }}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                  >
                    Quick Autofill
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checked Out / In-Use Items (Gate Return Desk) */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center justify-between">
            <span>Active Loans (Gate Check-In / Return)</span>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">{returnQueue.length} items</span>
          </h3>

          {returnQueue.length === 0 ? (
            <div className="text-xs text-neutral-400 py-6 text-center">
              No active borrowed items out in the community.
            </div>
          ) : (
            <div className="space-y-2.5">
              {returnQueue.map(b => (
                <div key={b.id} className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900">{b.itemTitle}</div>
                    <div className="text-neutral-500 text-[11px] mt-0.5 font-mono tabular-nums">
                      Due: {b.endDate} · {b.borrowerName} ({b.borrowerFlat})
                    </div>
                  </div>
                  <button
                    onClick={() => handleGateReturn(b.id, b.itemTitle)}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded cursor-pointer"
                  >
                    Check In
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
