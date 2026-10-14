import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceItem, ItemAvailability } from '../../types';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  Filter, 
  SlidersHorizontal,
  Check,
  X,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminCatalogManager: React.FC = () => {
  const { 
    items, 
    reports, 
    resolveReport, 
    adminToggleItemStatus, 
    adminRemoveItem, 
    setActiveItemModal,
    setIsAddItemOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'reports'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionNotice, setActionNotice] = useState<{ text: string; isError: boolean } | null>(null);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

  // Filter listings
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ownerFlat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.availability === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleResolve = (reportId: string, action: 'dismiss' | 'delist') => {
    resolveReport(reportId, action);
    setActionNotice({
      text: action === 'delist' ? 'Listing delisted and placed into maintenance mode.' : 'Report dismissed.',
      isError: false
    });
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleToggleStatus = (itemId: string, newStatus: ItemAvailability) => {
    adminToggleItemStatus(itemId, newStatus);
    setActionNotice({
      text: `Item availability set to ${newStatus}.`,
      isError: false
    });
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleRemove = (itemId: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from the community catalog?`)) {
      const res = adminRemoveItem(itemId);
      setActionNotice({
        text: res.message,
        isError: !res.success
      });
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="ios-glass p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
              Asset & Catalog Governance
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              Catalog & Listing Management
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Inspect community listings, enforce sharing rules, resolve resident safety reports, and manage item availability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              + Add Community Asset
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-neutral-200/60 dark:border-white/10">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${activeTab === 'listings' ? 'bg-amber-600 text-white' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>All Community Listings ({items.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${activeTab === 'reports' ? 'bg-amber-600 text-white' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Reported Listings & Issues Queue ({pendingReports.length})</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between ${actionNotice.isError ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40' : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40'}`}>
          <span>{actionNotice.text}</span>
          <button onClick={() => setActionNotice(null)} className="text-neutral-400 hover:text-neutral-700">✕</button>
        </div>
      )}

      {/* Tab 1: All Community Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="ios-glass p-4 rounded-xl border border-white/40 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, owners, flats..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white"
              >
                <option value="All">All Categories</option>
                <option value="Indian Household & Kitchen">Indian Household & Kitchen</option>
                <option value="Power Tools">Power Tools</option>
                <option value="Camping & Outdoors">Camping & Outdoors</option>
                <option value="Cleaning & Washers">Cleaning & Washers</option>
                <option value="Audio & Visual">Audio & Visual</option>
                <option value="Gardening">Gardening</option>
                <option value="Home & DIY">Home & DIY</option>
                <option value="Bioscience & Lab">Bioscience & Lab</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white"
              >
                <option value="All">All Availability</option>
                <option value="available">Available</option>
                <option value="in_use">In Use / Borrowed</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance / Hidden</option>
              </select>
            </div>
          </div>

          {/* Listings Table / Grid */}
          <div className="ios-glass rounded-2xl border border-white/40 dark:border-white/10 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 font-semibold border-b border-neutral-200/50 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3">Item Details</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Owner & Location</th>
                    <th className="px-4 py-3">Rental / Deposit</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/40 dark:divide-white/5">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-white/10 shrink-0 bg-neutral-100"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="font-bold text-neutral-900 dark:text-white line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                              Condition: {item.condition} · Added: {item.createdAt}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/10 text-[11px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {item.ownerName}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {item.ownerBlock}, Flat {item.ownerFlat}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-neutral-900 dark:text-white">
                          ₹{item.rentalPricePerDay} / day
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Deposit: ₹{item.securityDeposit}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.availability === 'available'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.availability === 'in_use'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {item.availability.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveItemModal(item)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg cursor-pointer"
                            title="Preview Item Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {item.availability === 'available' ? (
                            <button
                              onClick={() => handleToggleStatus(item.id, 'maintenance')}
                              className="px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 rounded-md border border-amber-200/60 dark:border-amber-800/40 cursor-pointer"
                              title="Hide item for maintenance or safety inspection"
                            >
                              Hold
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(item.id, 'available')}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-md border border-emerald-200/60 dark:border-emerald-800/40 cursor-pointer"
                              title="Make available"
                            >
                              Unhold
                            </button>
                          )}

                          <button
                            onClick={() => handleRemove(item.id, item.title)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                            title="Remove listing from community"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reported Listings & Issue Moderation */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Resident Listing Reports & Safety Flagging
              </h3>
              <p className="text-xs text-neutral-500">
                Community safety oversight: review listings reported for damages, inaccurate descriptions, or prohibited items.
              </p>
            </div>
          </div>

          {pendingReports.length === 0 ? (
            <div className="ios-glass p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 rounded-2xl border border-white/40 dark:border-white/10">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>No pending reports. All community listings are currently cleared by residents!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.map(report => (
                <div key={report.id} className="ios-glass p-5 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-bold mb-1">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Report: {report.reason}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-[11px] font-normal text-neutral-500">{report.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {report.itemTitle}
                    </h4>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                      "{report.details}"
                    </p>

                    <div className="text-[11px] text-neutral-500 mt-1">
                      Reported by: <span className="font-semibold text-neutral-700 dark:text-neutral-200">{report.reporterName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => handleResolve(report.id, 'delist')}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delist & Flag Maintenance</span>
                    </button>
                    <button
                      onClick={() => handleResolve(report.id, 'dismiss')}
                      className="px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/10 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Dismiss Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {resolvedReports.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-white/10">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                Resolved Moderation History ({resolvedReports.length})
              </h4>
              <div className="space-y-2">
                {resolvedReports.map(rep => (
                  <div key={rep.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-white/5 text-xs flex items-center justify-between text-neutral-500">
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{rep.itemTitle}</span> — {rep.reason}
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Resolved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
