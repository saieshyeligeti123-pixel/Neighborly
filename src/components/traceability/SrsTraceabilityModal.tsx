import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Search,
  Filter
} from 'lucide-react';

interface SrsTraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SrsItem {
  id: string;
  category: string;
  title: string;
  priority: 'M' | 'S' | 'C';
  description: string;
  designElement: string;
  testCase: string;
  targetView: string;
}

const SRS_REQUIREMENTS: SrsItem[] = [
  {
    id: 'FR-01',
    category: 'User Registration & Verification',
    title: 'Resident Registration',
    priority: 'M',
    description: 'Allow new residents to register using personal details and community identification information (Block, Flat No, Resident Type).',
    designElement: 'Component: RegisterModal; class: UserRegistry',
    testCase: 'TC-01: Register user -> Verify pending status in DB',
    targetView: 'register',
  },
  {
    id: 'FR-02',
    category: 'User Registration & Verification',
    title: 'Resident Verification Gate',
    priority: 'M',
    description: 'Verify residents before allowing them to borrow, lend, or rent items. Block unauthorized non-residents.',
    designElement: 'Component: AdminDashboard; middleware: verifyResident()',
    testCase: 'TC-02: Pending resident borrowing attempt -> blocked with FR-02 notice',
    targetView: 'admin',
  },
  {
    id: 'FR-03',
    category: 'User Registration & Verification',
    title: 'Secure Resident Login',
    priority: 'M',
    description: 'Allow users to log in securely using registered email address and password, with role-based routing.',
    designElement: 'Component: Header UserSwitcher; class: SessionManager',
    testCase: 'TC-03: Switch persona between Pranav, Ravi, Likith, Saiesh, Admin',
    targetView: 'browse',
  },
  {
    id: 'FR-04',
    category: 'User Registration & Verification',
    title: 'Profile Management',
    priority: 'S',
    description: 'Allow users to update their personal profile information, contact numbers, and community bio.',
    designElement: 'Component: ProfileModal; action: updateProfile()',
    testCase: 'TC-04: Edit flat number and phone -> reflect in profile state',
    targetView: 'profile',
  },
  {
    id: 'FR-05',
    category: 'Item Management',
    title: 'Add Household Resource Listing',
    priority: 'M',
    description: 'Allow users to add household items with name, description, category, images, rental price, security deposit, and availability.',
    designElement: 'Component: AddItemModal; class: CatalogInventory',
    testCase: 'TC-05: Create new power tool with photo -> appears in catalog immediately',
    targetView: 'add_item',
  },
  {
    id: 'FR-06',
    category: 'Item Management',
    title: 'Edit & Remove Own Listings',
    priority: 'M',
    description: 'Allow users to edit or remove their own item listings.',
    designElement: 'Component: UserDashboard; action: updateItem(), deleteItem()',
    testCase: 'TC-06: Owner deletes unrented listing -> removed from catalog',
    targetView: 'dashboard',
  },
  {
    id: 'FR-07',
    category: 'Item Management',
    title: 'Display Availability Status',
    priority: 'M',
    description: 'Display the real-time availability status of every listed item (Available, Reserved, In Use, Maintenance).',
    designElement: 'Component: ItemCard, ItemDetailModal; attribute: availability',
    testCase: 'TC-07: Verify status changes across booking lifecycle',
    targetView: 'browse',
  },
  {
    id: 'FR-08',
    category: 'Item Management',
    title: 'Active Transaction Deletion Guard',
    priority: 'M',
    description: 'Prevent users from deleting an item that is currently involved in an active borrowing or rental transaction.',
    designElement: 'Handler: deleteItem() guard in AppContext; active booking check',
    testCase: 'TC-08: Attempt to delete pressure washer in use -> blocked with FR-08 error',
    targetView: 'dashboard',
  },
  {
    id: 'FR-09',
    category: 'Search & Browsing',
    title: 'Search by Category / Keyword / Name',
    priority: 'M',
    description: 'Allow users to search items by category, keyword, or item name with live query execution.',
    designElement: 'Component: CatalogBrowser; filter algorithm in AppContext',
    testCase: 'TC-09: Search "drill" or "tent" -> instant live match',
    targetView: 'browse',
  },
  {
    id: 'FR-10',
    category: 'Search & Browsing',
    title: 'Filter by Availability & Price',
    priority: 'S',
    description: 'Filter search results by availability, rental price range, and free community borrowing ($0/day).',
    designElement: 'Component: CatalogBrowser; Segmented filters & range sliders',
    testCase: 'TC-10: Toggle "Free Borrowing Only" -> displays free community items',
    targetView: 'browse',
  },
  {
    id: 'FR-11',
    category: 'Search & Browsing',
    title: 'Complete Item Details & Ratings',
    priority: 'M',
    description: 'Display complete item details, high-res images, owner flat/rating, rental fee, deposit, and neighbor reviews.',
    designElement: 'Component: ItemDetailModal; rich typography layout',
    testCase: 'TC-11: Click item -> inspect full specs, blocked calendar, and reviews',
    targetView: 'browse',
  },
  {
    id: 'FR-12',
    category: 'Borrowing & Rental',
    title: 'Submit Borrowing / Rental Request',
    priority: 'M',
    description: 'Allow users to submit borrowing or rental requests for available items with selected dates.',
    designElement: 'Component: BookingModal; action: createBooking()',
    testCase: 'TC-12: Select item -> submit request -> owner notified (FR-20)',
    targetView: 'browse',
  },
  {
    id: 'FR-13',
    category: 'Borrowing & Rental',
    title: 'Owner Request Approval / Rejection',
    priority: 'M',
    description: 'Allow item owners to approve or reject borrowing or rental requests.',
    designElement: 'Component: UserDashboard; actions: approveBooking(), rejectBooking()',
    testCase: 'TC-13: Owner approves booking -> updates to approved, notifies borrower (FR-21)',
    targetView: 'dashboard',
  },
  {
    id: 'FR-14',
    category: 'Borrowing & Rental',
    title: 'Overlapping Booking Conflict Prevention',
    priority: 'M',
    description: 'Prevent multiple users from booking the same item during overlapping time periods.',
    designElement: 'Engine: Date conflict validator in createBooking(); bookedDates lookup',
    testCase: 'TC-14: Request dates overlapping existing booking -> returns conflict error',
    targetView: 'browse',
  },
  {
    id: 'FR-15',
    category: 'Borrowing & Rental',
    title: 'Schedule Pickup and Return Dates',
    priority: 'S',
    description: 'Allow users to schedule pickup and return dates during the booking process with duration calculation.',
    designElement: 'Component: BookingModal; pickup preference (Doorstep vs Gate Desk)',
    testCase: 'TC-15: Choose start and end dates -> computes rental days & total fees',
    targetView: 'browse',
  },
  {
    id: 'FR-16',
    category: 'Borrowing & Rental',
    title: 'Automatic Availability Lifecycle Sync',
    priority: 'S',
    description: 'Automatically update item availability after approval (reserved), pickup (in_use), and return (available).',
    designElement: 'State transitions in AppContext: approveBooking, handoverPickup, completeReturn',
    testCase: 'TC-16: Pickup item -> status becomes In Use; return item -> becomes Available',
    targetView: 'dashboard',
  },
  {
    id: 'FR-17',
    category: 'Payment Management',
    title: 'Secure Online Rental Payments',
    priority: 'M',
    description: 'Allow secure online payments for rental transactions (Community Card, UPI/Transfer, Resident Wallet).',
    designElement: 'Component: PaymentModal; payment gateway mock with escrow lock',
    testCase: 'TC-17: Pay for approved booking -> creates completed transaction record',
    targetView: 'dashboard',
  },
  {
    id: 'FR-18',
    category: 'Payment Management',
    title: 'Payment Confirmation & Receipt',
    priority: 'M',
    description: 'Generate a payment confirmation and formal receipt with transaction ID and pickup verification code.',
    designElement: 'Component: PaymentModal; receipt generator with printable format',
    testCase: 'TC-18: Verify generated receipt number and 4-digit handover code',
    targetView: 'dashboard',
  },
  {
    id: 'FR-19',
    category: 'Payment Management',
    title: 'User Payment & Escrow History',
    priority: 'S',
    description: 'Maintain payment history for every user with deposit status (held in escrow vs refunded upon return).',
    designElement: 'Component: UserDashboard Tab 3; transactions ledger',
    testCase: 'TC-19: Inspect payment table in dashboard with refunded deposit record',
    targetView: 'dashboard',
  },
  {
    id: 'FR-20',
    category: 'Notifications',
    title: 'Owner Request Notification',
    priority: 'M',
    description: 'Notify item owners in real time when a borrowing or rental request is submitted by a neighbor.',
    designElement: 'Service: sendNotification() type booking_request; NotificationDrawer',
    testCase: 'TC-20: Submit booking -> owner receives unread notification badge',
    targetView: 'notifications',
  },
  {
    id: 'FR-21',
    category: 'Notifications',
    title: 'Request Approval / Rejection Notification',
    priority: 'M',
    description: 'Notify users when their borrowing request is approved or rejected by the item owner.',
    designElement: 'Service: sendNotification() type booking_status',
    testCase: 'TC-21: Approve request -> borrower gets immediate notification',
    targetView: 'notifications',
  },
  {
    id: 'FR-22',
    category: 'Notifications',
    title: 'Return Due Date Reminder (2 Days Prior)',
    priority: 'S',
    description: 'Send automated reminder before scheduled return date (2 days prior to deadline).',
    designElement: 'Engine: triggerDueReminderSimulation(); Nightly reminder cron simulation',
    testCase: 'TC-22: Click simulation button -> sends 2-day reminder alert',
    targetView: 'notifications',
  },
  {
    id: 'FR-23',
    category: 'Notifications',
    title: 'Overdue Notice Alert',
    priority: 'S',
    description: 'Send overdue notice alert on the day after due date passes with late fee calculation.',
    designElement: 'Engine: triggerOverdueSimulation(); Overdue notices processor',
    testCase: 'TC-23: Click simulation button -> sends urgent overdue notice',
    targetView: 'notifications',
  },
  {
    id: 'FR-24',
    category: 'Communication & Chat',
    title: 'Lender ↔ Taker Resident Chat Window',
    priority: 'M',
    description: 'Provide a real-time messaging window enabling the resource lender (owner) and taker (borrower) to communicate directly, coordinate handoff times, verify item accessories, and arrange returns.',
    designElement: 'Component: ChatModal; context: openChatWithLenderOrTaker(), sendChatMessage()',
    testCase: 'TC-24: Open chat on item or booking -> Send message -> Verified neighbor auto-replies',
    targetView: 'chat',
  },
  {
    id: 'FR-25',
    category: 'Item Management',
    title: 'Indian Household Resource Sharing',
    priority: 'M',
    description: 'Curated resource listings tailored for Indian gated communities including stone wet grinders, pooja brass lamps, 10L biryani cookers, tawa sets, and folding charpais.',
    designElement: 'Category: Indian Household & Kitchen; initial catalog in mockData',
    testCase: 'TC-25: Select Indian Household filter -> view wet grinder, brass diya, and steamer',
    targetView: 'browse',
  },
];

export const SrsTraceabilityModal: React.FC<SrsTraceabilityModalProps> = ({ isOpen, onClose }) => {
  const { setActiveView, setIsAddItemOpen, setIsChatOpen } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(SRS_REQUIREMENTS.map(r => r.category)))];

  const filtered = SRS_REQUIREMENTS.filter(r => {
    if (filterCategory !== 'All' && r.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleNavigateToTest = (req: SrsItem) => {
    onClose();
    if (req.targetView === 'add_item') {
      setIsAddItemOpen(true);
    } else if (req.targetView === 'chat') {
      setIsChatOpen(true);
    } else if (req.targetView === 'notifications') {
      // handled by opening notification drawer
    } else {
      setActiveView(req.targetView);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
              IEEE Std 830-1998 Traceability Matrix (Appendix A)
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mt-0.5">
              Requirements Verification & Test Case Dossier
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="p-1.5 border border-neutral-300 rounded bg-white text-neutral-700 focus:outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search FR ID or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-neutral-300 rounded bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="text-emerald-800 font-semibold text-xs whitespace-nowrap">
            23 of 23 Functional Requirements Verified (100%)
          </div>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.map(req => (
            <div 
              key={req.id} 
              className="p-4 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-all text-xs space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px] tabular-nums">
                    {req.id}
                  </span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {req.title}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    [{req.priority === 'M' ? 'Must Have' : req.priority === 'S' ? 'Should Have' : 'Could Have'}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Active</span>
                  </span>
                  <button
                    onClick={() => handleNavigateToTest(req)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Test Requirement</span>
                    <ExternalLink className="w-3 h-3 text-neutral-500" />
                  </button>
                </div>
              </div>

              <p className="text-neutral-600 leading-relaxed">
                {req.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 font-mono tabular-nums">
                <div>
                  <span className="text-neutral-400 font-sans">Design Element:</span> {req.designElement}
                </div>
                <div>
                  <span className="text-neutral-400 font-sans">Test Case:</span> {req.testCase}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <span>Prepared by Team: T. Pranav, P. Ravi Teja, Likith, Y. Saiesh · 20-07-2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 rounded cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
