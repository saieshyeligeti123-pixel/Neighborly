import React, { useState } from 'react';
import { Booking, PaymentTransaction } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Lock, 
  Wallet,
  Smartphone
} from 'lucide-react';

interface PaymentModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  booking, 
  isOpen, 
  onClose 
}) => {
  const { processPayment } = useApp();
  const [method, setMethod] = useState<'Community Card' | 'Instant Bank Transfer / UPI' | 'Resident Wallet'>('Instant Bank Transfer / UPI');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const res = processPayment(booking.id, method);
      setCompletedTx(res.transaction);
      setIsProcessing(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              {completedTx ? 'Payment Receipt & Code' : 'Green Meadows Escrow Payment'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {completedTx ? (
            /* Successful Payment Confirmation & Receipt */
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Escrow Payment Confirmed</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Deposit safely held in Green Meadows resident escrow account.
                </p>
              </div>

              {/* Handover Verification Code Badge */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-[11px] font-bold tracking-wider text-emerald-800 dark:text-emerald-300 uppercase">
                  Pickup Handover Verification Code
                </div>
                <div className="text-3xl font-mono tracking-widest font-extrabold text-emerald-700 dark:text-emerald-400 my-1.5 tabular-nums">
                  {booking.handoverCode}
                </div>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Share this 4-digit code with {booking.ownerName} or the Gate Desk when picking up.
                </div>
              </div>

              {/* Official Receipt Card */}
              <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-2 text-xs bg-neutral-50/50 dark:bg-neutral-800/40">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Receipt No:</span>
                  <span className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200 font-medium">{completedTx.receiptNumber}</span>
                </div>
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Date & Time:</span>
                  <span className="font-mono tabular-nums text-neutral-800 dark:text-neutral-200">{completedTx.timestamp}</span>
                </div>
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Resource:</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">{booking.itemTitle}</span>
                </div>
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Owner:</span>
                  <span className="text-neutral-800 dark:text-neutral-200">{booking.ownerName} ({booking.ownerFlat})</span>
                </div>
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Borrower:</span>
                  <span className="text-neutral-800 dark:text-neutral-200">{booking.borrowerName} ({booking.borrowerFlat})</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Rental Fee ({booking.daysCount} days):</span>
                  <span className="font-mono tabular-nums">₹{booking.rentalFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Refundable Security Deposit:</span>
                  <span className="font-mono tabular-nums">₹{booking.securityDeposit}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-neutral-900 dark:text-white">
                  <span>Total Paid in Escrow:</span>
                  <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400 text-sm">₹{completedTx.totalPaid}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center justify-center cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>

            </div>
          ) : (
            /* Payment Input Form */
            <form onSubmit={handlePay} className="space-y-4">
              
              {/* Item summary */}
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
                <div className="font-bold text-neutral-900 dark:text-white truncate">{booking.itemTitle}</div>
                <div className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Duration: {booking.startDate} to {booking.endDate} ({booking.daysCount} days)
                </div>
                <div className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-mono tabular-nums">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Escrow (Rent + Deposit):</span>
                  <span className="font-extrabold text-neutral-900 dark:text-white text-base text-emerald-700 dark:text-emerald-400">₹{booking.totalAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Select Payment Method
                </label>
                <div className="space-y-2">
                  <label className={`p-3 border rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${method === 'Instant Bank Transfer / UPI' ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 font-semibold text-emerald-950 dark:text-emerald-300' : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-sky-600" />
                      <div>
                        <div>Instant Transfer / UPI (GPay, PhonePe, Paytm)</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Zero fee instant escrow deposit</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payMethod" 
                      checked={method === 'Instant Bank Transfer / UPI'} 
                      onChange={() => setMethod('Instant Bank Transfer / UPI')} 
                      className="sr-only" 
                    />
                  </label>

                  <label className={`p-3 border rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${method === 'Community Card' ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 font-semibold text-emerald-950 dark:text-emerald-300' : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>Resident Debit / Credit Card</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">RuPay / Visa / Mastercard</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payMethod" 
                      checked={method === 'Community Card'} 
                      onChange={() => setMethod('Community Card')} 
                      className="sr-only" 
                    />
                  </label>

                  <label className={`p-3 border rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${method === 'Resident Wallet' ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 font-semibold text-emerald-950 dark:text-emerald-300' : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>
                    <div className="flex items-center gap-2.5">
                      <Wallet className="w-4 h-4 text-amber-600" />
                      <div>
                        <div>Green Meadows Resident Wallet</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">Available Balance: ₹2,400.00</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payMethod" 
                      checked={method === 'Resident Wallet'} 
                      onChange={() => setMethod('Resident Wallet')} 
                      className="sr-only" 
                    />
                  </label>
                </div>
              </div>

              {/* Escrow Guarantee Badge */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Community Escrow Guarantee: Your ₹{booking.securityDeposit} deposit is locked securely and returned automatically to your account upon verified return inspection.
                </p>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isProcessing ? 'Authorizing with UPI Escrow...' : `Authorize & Pay ₹${booking.totalAmount}`}
                </span>
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
