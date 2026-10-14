import React from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  Key, 
  CreditCard, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UserHelp: React.FC = () => {
  const { setIsTraceabilityOpen } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Banner */}
      <div className="ios-glass p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs">
        <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
          Resident Resource Guide
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
          Help & Community Support
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
          Everything you need to know about borrowing responsibly, security deposits in ₹, Gate Desk handovers, and estate contact assistance.
        </p>
      </div>

      {/* 4 Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Rule 1: How Borrowing Works */}
        <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            1. Requesting & Reserving Items
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Choose your start and end dates in the borrowing calendar. The system calculates the exact rental fee and refundable deposit in ₹ without hidden surcharges. Once submitted, the lender receives an instant alert to approve or decline.
          </p>
        </div>

        {/* Rule 2: Handover PINs & Gate Desk */}
        <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
            <Key className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            2. Gate Desk & 4-Digit Handover PIN
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            For security, every booking generates a unique 4-digit verification code. Items can be exchanged directly at your door or left at Clubhouse Gate 1 Security Desk for contactless handover. Present your PIN to collect or return.
          </p>
        </div>

        {/* Rule 3: Escrow Deposits in ₹ */}
        <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            3. Refundable Escrow Protection
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Security deposits protect the lender's valuable appliances against loss or damage. Deposits are held in community escrow and released automatically upon physical return confirmation and condition clearance.
          </p>
        </div>

        {/* Rule 4: Damages & Dispute Resolution */}
        <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            4. Item Damage & Listing Reports
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Found an appliance with a worn cable or incorrect description? Use the "Report Listing" button to notify the Estate Management Committee. In case of breakage during use, notify the lender immediately to assess repair costs.
          </p>
        </div>

      </div>

      {/* Emergency & Support Contacts */}
      <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
          Community Management Contacts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40">
            <div className="font-bold text-neutral-900 dark:text-white">Estate Office (Admin)</div>
            <div className="text-neutral-500 mt-1">Clubhouse First Floor, Room 102</div>
            <div className="font-mono text-emerald-700 dark:text-emerald-400 mt-2 font-bold">+91 98480 99999</div>
            <div className="text-[11px] text-neutral-400">admin@greenmeadows.community</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40">
            <div className="font-bold text-neutral-900 dark:text-white">Gate 1 Security Desk</div>
            <div className="text-neutral-500 mt-1">Main Entrance Handover Counter</div>
            <div className="font-mono text-emerald-700 dark:text-emerald-400 mt-2 font-bold">+91 98480 88888</div>
            <div className="text-[11px] text-neutral-400">Available 24 hours daily</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40">
            <div className="font-bold text-neutral-900 dark:text-white">SRS Software Standards</div>
            <div className="text-neutral-500 mt-1">IEEE Std 830-1998 Traceability</div>
            <button
              onClick={() => setIsTraceabilityOpen(true)}
              className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Open Traceability Matrix</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
