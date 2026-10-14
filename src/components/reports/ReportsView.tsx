import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Printer, 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { items, bookings, transactions, users } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('July 2026');

  // Compute metrics
  const totalItems = items.length;
  const activeLoans = bookings.filter(b => b.status === 'in_use').length;
  const completedLoans = bookings.filter(b => b.status === 'completed').length;
  const overdueLoans = bookings.filter(b => b.isOverdue || (b.status === 'in_use' && new Date(b.endDate) < new Date())).length;
  const totalFinancialVolume = transactions.reduce((acc, t) => acc + t.totalPaid, 0);
  const totalDepositsRefunded = transactions.filter(t => t.depositStatus === 'refunded_to_borrower').reduce((acc, t) => acc + t.securityDeposit, 0);
  const activeEscrowHeld = transactions.filter(t => t.depositStatus === 'held_in_escrow').reduce((acc, t) => acc + t.securityDeposit, 0);

  // Group by category for utilization breakdown
  const categoryStats = [
    'Indian Household & Kitchen',
    'Power Tools',
    'Camping & Outdoors',
    'Cleaning & Washers',
    'Audio & Visual',
    'Gardening',
    'Home & DIY',
    'Bioscience & Lab',
  ].map(cat => {
    const catItems = items.filter(i => i.category === cat);
    const catBookings = bookings.filter(b => b.itemCategory === cat);
    return {
      category: cat,
      itemCount: catItems.length,
      bookingCount: catBookings.length,
      utilizationRate: catItems.length > 0 ? Math.min(100, Math.round((catBookings.length / (catItems.length * 2)) * 100)) : 0,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Print Action */}
      <div className="ios-glass p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
              System Audit & Analytics (SRS Functional Requirement FR-09)
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-0.5">
              Monthly Resource Borrowing & Utilization Report
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Green Meadows Residences · Community Resource Sharing & Financial Audit
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 text-xs border border-neutral-300 dark:border-white/10 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
            >
              <option value="July 2026">July 2026 (Current Cycle)</option>
              <option value="June 2026">June 2026</option>
              <option value="May 2026">May 2026</option>
            </select>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export as PDF / Print (FR-09)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 sm:p-8 space-y-8 shadow-xs">
        
        {/* Formal Document Letterhead */}
        <div className="border-b border-neutral-200 pb-6 flex items-start justify-between">
          <div>
            <div className="text-lg font-bold text-neutral-900 tracking-tight">
              Community Resource Borrowing & Rental Management System (CRBRMS)
            </div>
            <div className="text-xs text-neutral-600 mt-0.5">
              Operating Authority: Green Meadows Community Management Office & Library Desk
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Report Period: <strong className="text-neutral-800">{selectedMonth}</strong> · Generated: {new Date().toISOString().split('T')[0]}
            </div>
          </div>
          <div className="text-right text-xs text-neutral-500 font-mono tabular-nums">
            <div>Doc Ref: CRBRMS-REP-2026-07</div>
            <div>Status: Formal Audit Baseline</div>
          </div>
        </div>

        {/* Executive KPI Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-[11px] text-neutral-500 font-medium">Total Resources Listed</div>
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums mt-1">
              {totalItems}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Across 6 household categories</div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-[11px] text-neutral-500 font-medium">Resources Issued & In-Use</div>
            <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mt-1">
              {activeLoans}
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Active neighbor borrowings</div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-[11px] text-neutral-500 font-medium">Completed Returns</div>
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums mt-1">
              {completedLoans}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Deposits verified & refunded</div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-[11px] text-neutral-500 font-medium">Overdue Rate</div>
            <div className="text-2xl font-bold text-rose-700 font-mono tabular-nums mt-1">
              {overdueLoans}
            </div>
            <div className="text-[10px] text-rose-600 mt-0.5">Requires administrative notice</div>
          </div>
        </div>

        {/* Financial Flow & Escrow Reconciliation (FR-09 & FR-19) */}
        <div>
          <h3 className="text-sm font-bold text-neutral-900 mb-3 uppercase tracking-wider text-[11px]">
            1. Community Financial Escrow & Transaction Volume
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-neutral-200 rounded-md">
              <div className="text-xs text-neutral-500">Gross Transaction Volume</div>
              <div className="text-xl font-bold text-neutral-900 font-mono tabular-nums mt-1">
                ₹{totalFinancialVolume}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Rental fees + Escrow collateral</div>
            </div>

            <div className="p-4 border border-neutral-200 rounded-md">
              <div className="text-xs text-neutral-500">Active Collateral in Escrow</div>
              <div className="text-xl font-bold text-amber-700 font-mono tabular-nums mt-1">
                ₹{activeEscrowHeld}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Secured against active borrowings</div>
            </div>

            <div className="p-4 border border-neutral-200 rounded-md">
              <div className="text-xs text-neutral-500">Deposits Released on Safe Return</div>
              <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
                ₹{totalDepositsRefunded}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">100% automatic refund rate</div>
            </div>
          </div>
        </div>

        {/* Category Utilization Matrix */}
        <div>
          <h3 className="text-sm font-bold text-neutral-900 mb-3 uppercase tracking-wider text-[11px]">
            2. Resource Utilization by Category
          </h3>
          <div className="overflow-x-auto border border-neutral-200 rounded-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-700 font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Available Catalog</th>
                  <th className="px-4 py-2.5">Total Requests</th>
                  <th className="px-4 py-2.5">Estimated Utilization Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono tabular-nums">
                {categoryStats.map(stat => (
                  <tr key={stat.category} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-2.5 font-sans font-medium text-neutral-900">
                      {stat.category}
                    </td>
                    <td className="px-4 py-2.5 text-neutral-700">
                      {stat.itemCount} items
                    </td>
                    <td className="px-4 py-2.5 text-neutral-700">
                      {stat.bookingCount} bookings
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-neutral-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-emerald-700 h-full rounded-full" 
                            style={{ width: `${Math.min(100, stat.utilizationRate)}%` }} 
                          />
                        </div>
                        <span className="text-neutral-800 font-semibold">{stat.utilizationRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certified Audit Signature Block (SRS Section 4 Approval) */}
        <div className="border-t border-neutral-200 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-600">
          <div>
            <div className="font-semibold text-neutral-900">Community Head Librarian</div>
            <div className="text-neutral-500 mt-1">Mrs. L. Devi</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Signature Verified · 24 July 2026</div>
          </div>
          <div>
            <div className="font-semibold text-neutral-900">Project Instructor</div>
            <div className="text-neutral-500 mt-1">Prof. Prashanth Thota</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Software Engineering Lab · Week 2</div>
          </div>
          <div>
            <div className="font-semibold text-neutral-900">System Engineering Team</div>
            <div className="text-neutral-500 mt-1">T. Pranav, Ravi Teja, Likith, Saiesh</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">IEEE Std 830-1998 Traceability OK</div>
          </div>
        </div>

      </div>

    </div>
  );
};
