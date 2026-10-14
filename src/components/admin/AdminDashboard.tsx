import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Building2, 
  Check, 
  X, 
  FileText, 
  Clock, 
  Settings,
  Users
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    verifyResident, 
    bookings, 
    items, 
    transactions,
    currentUser,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'overdue' | 'members'>('verifications');

  // Pending resident registrations
  const pendingUsers = users.filter(u => u.verificationStatus === 'pending');
  const verifiedUsers = users.filter(u => u.verificationStatus === 'verified');

  // Overdue items (FR-21 / Reports section of SRS)
  const overdueBookings = bookings.filter(b => b.isOverdue || (b.status === 'in_use' && new Date(b.endDate) < new Date()));

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="ios-glass p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
              Community Office & Administration (SRS Section 3.1.1)
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              Administrator & Resource Controller
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Logged in as Head Administrator {currentUser.name}. Manage resident identities, enforce sharing rules, and inspect overdue resources.
            </p>
          </div>

          <button
            onClick={() => setActiveView('reports')}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Monthly Utilization Report (FR-09)</span>
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-neutral-200/60 dark:border-white/10 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${activeTab === 'verifications' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Resident Verification Queue ({pendingUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${activeTab === 'overdue' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Overdue Items & Member Contacts (FR-21)</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${activeTab === 'members' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Verified Community Residents ({verifiedUsers.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Resident Verification Queue (FR-01, FR-02) */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                Resident Verification Queue (FR-01 & FR-02)
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                The SRS requires property verification before new residents can borrow, lend, or rent resources.
              </p>
            </div>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center text-xs text-neutral-500">
              No pending registrations awaiting verification. All residents are up to date!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <div key={user.id} className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-700 font-medium mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Community Identity Approval</span>
                    </div>
                    <h4 className="text-base font-bold text-neutral-900">{user.name}</h4>
                    <div className="text-xs text-neutral-600 mt-1 space-y-0.5">
                      <div>Address: <strong className="text-neutral-800">{user.block}, Flat {user.flatNumber}</strong> ({user.residentType})</div>
                      <div>Contact: {user.email} · Phone: <span className="font-mono tabular-nums">{user.phone}</span></div>
                      <div>Joined: <span className="font-mono tabular-nums">{user.joinedDate}</span></div>
                      {user.bio && <div className="text-neutral-500 italic mt-1">"{user.bio}"</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <button
                      onClick={() => verifyResident(user.id, 'verified')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Resident (FR-02)</span>
                    </button>
                    <button
                      onClick={() => verifyResident(user.id, 'rejected')}
                      className="px-3.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Overdue Items & Member Contact Details (FR-21 in Reports section of SRS) */}
      {activeTab === 'overdue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Current Overdue Resources & Member Contact Dossier (FR-21)</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Restricted to Community Administrator and Gate Desk. View phone and flat numbers to follow up on unreturned items.
              </p>
            </div>
          </div>

          {overdueBookings.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center text-xs text-emerald-800 bg-emerald-50/50">
              Zero overdue items! All resources are currently within agreed borrowing schedules.
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-700 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Resource Item</th>
                      <th className="px-4 py-3">Borrower Name & Flat</th>
                      <th className="px-4 py-3">Member Contact Details (Admin View)</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Overdue Days</th>
                      <th className="px-4 py-3">Owner Contact</th>
                      <th className="px-4 py-3 text-right">Escrow Held</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {overdueBookings.map(b => (
                      <tr key={b.id} className="hover:bg-rose-50/30">
                        <td className="px-4 py-3 font-semibold text-neutral-900">
                          {b.itemTitle}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-neutral-800">{b.borrowerName}</div>
                          <div className="text-neutral-500 text-[11px]">{b.borrowerFlat}</div>
                        </td>
                        <td className="px-4 py-3 space-y-0.5 font-mono tabular-nums">
                          <div className="flex items-center gap-1 text-neutral-800">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            <span>{b.borrowerPhone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-500 text-[11px]">
                            <Mail className="w-3 h-3 text-neutral-400" />
                            <span>{b.borrowerName.toLowerCase().replace(' ', '.')}@greenmeadows.community</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-rose-700 font-medium">
                          {b.endDate}
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums font-bold text-rose-800">
                          {b.overdueDays || 5} days overdue
                        </td>
                        <td className="px-4 py-3 text-neutral-700">
                          {b.ownerName} ({b.ownerFlat})
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                          ${b.securityDeposit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: All Community Residents */}
      {activeTab === 'members' && (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-900">Registered Community Members</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-medium border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3">Member Name</th>
                  <th className="px-4 py-3">Flat & Tower</th>
                  <th className="px-4 py-3">Role / Resident Type</th>
                  <th className="px-4 py-3">Trust Rating</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {u.block}, Flat {u.flatNumber}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 capitalize">
                      {u.role === 'admin' ? 'Head Admin' : u.residentType}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {u.ratingCount > 0 ? (
                        <span className="text-amber-700 font-semibold">{u.rating} ★ ({u.ratingCount})</span>
                      ) : (
                        <span className="text-neutral-400">No ratings yet</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-neutral-500">
                      {u.joinedDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${u.verificationStatus === 'verified' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {u.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
