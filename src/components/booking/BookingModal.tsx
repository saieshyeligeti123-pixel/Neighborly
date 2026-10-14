import React, { useState } from 'react';
import { ResourceItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';

interface BookingModalProps {
  item: ResourceItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { createBooking, bookings, currentUser } = useApp();

  // Tomorrow as default start
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split('T')[0];

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const defaultEnd = threeDaysLater.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [purposeNote, setPurposeNote] = useState('');
  const [pickupPreference, setPickupPreference] = useState<'owner_flat' | 'security_gate'>('owner_flat');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate rental days
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  const diffTime = eDate.getTime() - sDate.getTime();
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const rentalTotal = days * item.rentalPricePerDay;
  const deposit = item.securityDeposit;
  const grandTotal = rentalTotal + deposit;

  // Active dates for reference
  const itemActiveBookings = bookings.filter(b => 
    b.itemId === item.id && (b.status === 'in_use' || b.status === 'approved')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = createBooking(
      item.id,
      startDate,
      endDate,
      `${purposeNote} [Handover: ${pickupPreference === 'owner_flat' ? 'Doorstep Handover' : 'Clubhouse / Security Gate Desk'}]`
    );

    if (!res.success) {
      setError(res.message);
    } else if (res.bookingId) {
      onSuccess(res.bookingId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-900/80">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">Request to Borrow Resource</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Green Meadows Peer-to-Peer Community Loan</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Resource Summary */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center gap-3">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-14 h-14 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700 shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">{item.title}</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Owner: {item.ownerName} ({item.ownerFlat}) · {item.rentalPricePerDay === 0 ? 'Free Borrowing' : `₹${item.rentalPricePerDay}/day`}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Refundable deposit: ₹{item.securityDeposit}
              </div>
            </div>
          </div>

          {/* Conflict Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Reserved Dates Warning if any */}
          {itemActiveBookings.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-900 dark:text-amber-300">
              <span className="font-bold">Unavailable locked dates:</span>{' '}
              {itemActiveBookings.map(b => `${b.startDate} to ${b.endDate}`).join(', ')}.
            </div>
          )}

          {/* Date Range Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                Pickup Date *
              </label>
              <input 
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                Return Date *
              </label>
              <input 
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Handover Preference */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
              Pickup & Handover Preference
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className={`p-3 border rounded-xl cursor-pointer flex flex-col transition-colors ${pickupPreference === 'owner_flat' ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-medium' : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>
                <input 
                  type="radio" 
                  name="pickup" 
                  checked={pickupPreference === 'owner_flat'} 
                  onChange={() => setPickupPreference('owner_flat')} 
                  className="sr-only" 
                />
                <span className="font-bold">Owner Doorstep</span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">{item.ownerFlat}</span>
              </label>

              <label className={`p-3 border rounded-xl cursor-pointer flex flex-col transition-colors ${pickupPreference === 'security_gate' ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-medium' : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>
                <input 
                  type="radio" 
                  name="pickup" 
                  checked={pickupPreference === 'security_gate'} 
                  onChange={() => setPickupPreference('security_gate')} 
                  className="sr-only" 
                />
                <span className="font-bold">Gate / Security Desk</span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Clubhouse Gate 1</span>
              </label>
            </div>
          </div>

          {/* Purpose / Project Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Purpose of Borrowing (Optional)
            </label>
            <textarea 
              rows={2}
              value={purposeNote}
              onChange={e => setPurposeNote(e.target.value)}
              placeholder="e.g. Grinding dosa batter for family event, hanging wall shelves, terrace party..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Financial Breakdown in ₹ */}
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Rental Duration:</span>
              <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">{days} day{days > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Rental Fee ({days} × ₹{item.rentalPricePerDay}):</span>
              <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">₹{rentalTotal}</span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Refundable Escrow Deposit:</span>
              <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">₹{deposit}</span>
            </div>
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-neutral-900 dark:text-white text-sm">
              <span>Total Payable upon Approval:</span>
              <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-extrabold text-base">₹{grandTotal}</span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 pt-1">
              * Note: The deposit is 100% refunded immediately when the resource is checked back in.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Submit Rental Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
