import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  ResourceItem, 
  Booking, 
  PaymentTransaction, 
  NotificationItem, 
  Review, 
  ItemCategory,
  ItemAvailability,
  BookedDateRange,
  ChatMessage,
  ChatConversation,
  PortalMode,
  UserNavTab,
  AdminNavTab,
  ReportListing
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ITEMS, 
  INITIAL_BOOKINGS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_REPORTS
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  items: ResourceItem[];
  bookings: Booking[];
  transactions: PaymentTransaction[];
  notifications: NotificationItem[];
  reviews: Review[];
  activeView: string;
  setActiveView: (view: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (filter: string) => void;
  priceFilter: number;
  setPriceFilter: (price: number) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // User Actions
  switchUser: (userId: string) => void;
  registerUser: (userData: Omit<User, 'id' | 'rating' | 'ratingCount' | 'joinedDate' | 'verificationStatus'>) => void;
  verifyResident: (userId: string, status: 'verified' | 'rejected') => void;
  updateProfile: (updatedData: Partial<User>) => void;
  
  // Item Actions
  addItem: (item: Omit<ResourceItem, 'id' | 'ownerId' | 'ownerName' | 'ownerBlock' | 'ownerFlat' | 'ownerRating' | 'bookedDates' | 'createdAt'>) => void;
  updateItem: (id: string, updatedFields: Partial<ResourceItem>) => void;
  deleteItem: (id: string) => { success: boolean; message: string };
  
  // Booking Actions
  createBooking: (
    itemId: string, 
    startDate: string, 
    endDate: string, 
    purposeNote?: string
  ) => { success: boolean; message: string; bookingId?: string };
  approveBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string, reason?: string) => void;
  processPayment: (
    bookingId: string, 
    paymentMethod: 'Community Card' | 'Instant Bank Transfer / UPI' | 'Resident Wallet'
  ) => { success: boolean; transaction: PaymentTransaction };
  handoverPickup: (bookingId: string, inputCode: string) => { success: boolean; message: string };
  completeReturn: (bookingId: string) => { success: boolean; message: string };
  
  // Reviews
  submitReview: (review: Omit<Review, 'id' | 'timestamp'>) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  triggerOverdueSimulation: () => void;
  triggerDueReminderSimulation: () => void;

  // Modals & Panels
  activeItemModal: ResourceItem | null;
  setActiveItemModal: (item: ResourceItem | null) => void;
  isAddItemOpen: boolean;
  setIsAddItemOpen: (open: boolean) => void;
  isTraceabilityOpen: boolean;
  setIsTraceabilityOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  activeBookingForPayment: Booking | null;
  setActiveBookingForPayment: (booking: Booking | null) => void;
  activeReviewBooking: Booking | null;
  setActiveReviewBooking: (booking: Booking | null) => void;

  // Neighbor-to-Neighbor Chat System
  conversations: ChatConversation[];
  messages: ChatMessage[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  openChatWithLenderOrTaker: (params: { itemId?: string; bookingId?: string; otherUserId: string; initialMessage?: string }) => void;
  sendChatMessage: (conversationId: string, text: string) => void;

  // Marketplace & Resident Trust Features
  savedItemIds: string[];
  toggleSaveItem: (itemId: string) => void;
  recentlyViewedIds: string[];
  addRecentlyViewed: (itemId: string) => void;
  reportedItemIds: string[];
  reportItem: (itemId: string, reason: string) => void;

  // Dual Portals & Auth
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  userNavTab: UserNavTab;
  setUserNavTab: (tab: UserNavTab) => void;
  adminNavTab: AdminNavTab;
  setAdminNavTab: (tab: AdminNavTab) => void;
  isAdminAuthenticated: boolean;
  loginAsAdmin: (email: string, password?: string) => { success: boolean; message: string };
  loginAsResident: (userIdOrEmail: string) => { success: boolean; message: string };
  logout: () => void;
  switchToPortal: (target: 'admin' | 'user') => { success: boolean; message: string };

  // Admin Catalog & Moderation Oversight
  reports: ReportListing[];
  resolveReport: (reportId: string, action: 'dismiss' | 'delist') => void;
  adminToggleItemStatus: (itemId: string, status: ItemAvailability) => void;
  adminRemoveItem: (itemId: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage initialization with fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('crbrms_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem('crbrms_current_user_id');
    const found = users.find(u => u.id === savedId);
    return found || users[0];
  });

  const [items, setItems] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('crbrms_items_v3');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('crbrms_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('crbrms_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('crbrms_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('crbrms_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Neighbor-to-Neighbor Chat State
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('crbrms_conversations_v3');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('crbrms_messages_v3');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Dual Portals & Navigation State
  const [portalMode, setPortalModeState] = useState<PortalMode>(() => {
    const saved = localStorage.getItem('crbrms_portal_mode');
    if (saved === 'admin' || saved === 'user') return saved;
    return 'portal_select';
  });

  const [userNavTab, setUserNavTab] = useState<UserNavTab>('home');
  const [adminNavTab, setAdminNavTab] = useState<AdminNavTab>('dashboard');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('crbrms_is_admin_auth');
    return saved === 'true';
  });

  const [reports, setReports] = useState<ReportListing[]>(() => {
    const saved = localStorage.getItem('crbrms_reports_list');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const setPortalMode = (mode: PortalMode) => {
    setPortalModeState(mode);
    localStorage.setItem('crbrms_portal_mode', mode);
  };

  // UI state
  const [activeView, setActiveView] = useState<string>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<number>(2000);

  // Saved / Wishlist Items
  const [savedItemIds, setSavedItemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('crbrms_saved_items');
    return saved ? JSON.parse(saved) : ['item-1', 'item-ind-1'];
  });

  // Recently Viewed Items
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('crbrms_recent_viewed');
    return saved ? JSON.parse(saved) : ['item-1', 'item-ind-1', 'item-av-1'];
  });

  // Reported Listings
  const [reportedItemIds, setReportedItemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('crbrms_reported_items');
    return saved ? JSON.parse(saved) : [];
  });

  // iOS Theme state (dark by default to give that iconic Apple iOS dark wallpaper look)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('crbrms_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('crbrms_theme', next);
      return next;
    });
  };

  const [activeItemModal, setActiveItemModalState] = useState<ResourceItem | null>(null);

  const setActiveItemModal = (item: ResourceItem | null) => {
    setActiveItemModalState(item);
    if (item) {
      setRecentlyViewedIds(prev => {
        const next = [item.id, ...prev.filter(id => id !== item.id)].slice(0, 10);
        localStorage.setItem('crbrms_recent_viewed', JSON.stringify(next));
        return next;
      });
    }
  };

  const toggleSaveItem = (itemId: string) => {
    setSavedItemIds(prev => {
      const exists = prev.includes(itemId);
      const next = exists ? prev.filter(id => id !== itemId) : [...prev, itemId];
      localStorage.setItem('crbrms_saved_items', JSON.stringify(next));
      return next;
    });
  };

  const addRecentlyViewed = (itemId: string) => {
    setRecentlyViewedIds(prev => {
      const next = [itemId, ...prev.filter(id => id !== itemId)].slice(0, 10);
      localStorage.setItem('crbrms_recent_viewed', JSON.stringify(next));
      return next;
    });
  };

  const reportItem = (itemId: string, reason: string) => {
    setReportedItemIds(prev => {
      const next = [...prev, itemId];
      localStorage.setItem('crbrms_reported_items', JSON.stringify(next));
      return next;
    });

    const targetItem = items.find(i => i.id === itemId);
    const newReport: ReportListing = {
      id: `rep-${Date.now()}`,
      itemId,
      itemTitle: targetItem ? targetItem.title : 'Community Item',
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reason: reason as any,
      details: `Reported by resident ${currentUser.name} (${currentUser.block}, Flat ${currentUser.flatNumber}). Reason: ${reason}.`,
      status: 'pending',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setReports(prev => [newReport, ...prev]);

    // Add user notification
    const notif: NotificationItem = {
      id: `notif-rep-${Date.now()}`,
      userId: currentUser.id,
      type: 'system',
      title: 'Report Received',
      message: `Your report regarding listing (${reason}) was registered. The Green Meadows resident committee and admin will inspect it.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [activeBookingForPayment, setActiveBookingForPayment] = useState<Booking | null>(null);
  const [activeReviewBooking, setActiveReviewBooking] = useState<Booking | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('crbrms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('crbrms_items_v3', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('crbrms_conversations_v3', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('crbrms_messages_v3', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('crbrms_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('crbrms_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('crbrms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('crbrms_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('crbrms_reports_list', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('crbrms_current_user_id', currentUser.id);
  }, [currentUser]);

  // Switch User
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  // SECURE AUTHENTICATION & PORTAL MANAGEMENT
  const loginAsAdmin = (email: string, _password?: string): { success: boolean; message: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const adminUser = users.find(u => 
      u.role === 'admin' && 
      (u.email.toLowerCase() === normalizedEmail || u.name.toLowerCase().includes(normalizedEmail))
    );

    if (!adminUser) {
      // Check if this is a resident attempting admin access
      const residentUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (residentUser) {
        return {
          success: false,
          message: `Access Denied: Account "${residentUser.name}" (${residentUser.block}, ${residentUser.flatNumber}) is registered as a Resident and lacks Administrator privileges. Resident accounts cannot access the Admin Portal.`
        };
      }
      return {
        success: false,
        message: 'Authentication failed: Administrator record not found for this community. Please check your credentials or refer to the Admin Setup Guide.'
      };
    }

    if (adminUser.verificationStatus !== 'verified') {
      return {
        success: false,
        message: 'Authentication failed: This administrator account is not active or verified.'
      };
    }

    setCurrentUser(adminUser);
    setIsAdminAuthenticated(true);
    localStorage.setItem('crbrms_is_admin_auth', 'true');
    setPortalModeState('admin');
    localStorage.setItem('crbrms_portal_mode', 'admin');
    setAdminNavTab('dashboard');
    setActiveView('admin');

    return {
      success: true,
      message: `Welcome, ${adminUser.name}! Administrator session authenticated.`
    };
  };

  const loginAsResident = (userIdOrEmail: string): { success: boolean; message: string } => {
    const target = users.find(u => 
      u.id === userIdOrEmail || 
      u.email.toLowerCase() === userIdOrEmail.trim().toLowerCase()
    );

    if (!target) {
      return {
        success: false,
        message: 'Resident record not found. Please select a resident profile or register as a new resident.'
      };
    }

    setCurrentUser(target);
    setPortalModeState('user');
    localStorage.setItem('crbrms_portal_mode', 'user');
    setUserNavTab('home');

    return {
      success: true,
      message: `Welcome, ${target.name}!`
    };
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('crbrms_is_admin_auth');
    setPortalModeState('portal_select');
    localStorage.setItem('crbrms_portal_mode', 'portal_select');
  };

  const switchToPortal = (target: 'admin' | 'user'): { success: boolean; message: string } => {
    if (target === 'admin') {
      if (currentUser.role !== 'admin' || !isAdminAuthenticated) {
        return {
          success: false,
          message: 'Access Denied: You must authenticate with authorized Administrator credentials to access the Admin Portal.'
        };
      }
      setPortalModeState('admin');
      localStorage.setItem('crbrms_portal_mode', 'admin');
      setActiveView('admin');
      return { success: true, message: 'Switched to Admin Portal.' };
    } else {
      setPortalModeState('user');
      localStorage.setItem('crbrms_portal_mode', 'user');
      setUserNavTab('home');
      return { success: true, message: 'Switched to Resident Portal.' };
    }
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'delist') => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
    const targetReport = reports.find(r => r.id === reportId);
    if (action === 'delist' && targetReport) {
      setItems(prev => prev.map(item => item.id === targetReport.itemId ? { ...item, availability: 'maintenance' } : item));
    }
  };

  const adminToggleItemStatus = (itemId: string, status: ItemAvailability) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, availability: status } : item));
  };

  const adminRemoveItem = (itemId: string): { success: boolean; message: string } => {
    const activeBooking = bookings.find(b => b.itemId === itemId && (b.status === 'in_use' || b.status === 'approved'));
    if (activeBooking) {
      return { success: false, message: `Cannot remove: Item currently has an active reservation or loan (${activeBooking.status}).` };
    }
    setItems(prev => prev.filter(i => i.id !== itemId));
    return { success: true, message: 'Item listing removed from community catalog by administrator.' };
  };

  // Register New Resident (FR-01)
  const registerUser = (userData: Omit<User, 'id' | 'rating' | 'ratingCount' | 'joinedDate' | 'verificationStatus'>) => {
    const newId = `user-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      verificationStatus: 'pending', // Requires admin verification (FR-02)
      rating: 0,
      ratingCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    // Notify Administrator (FR-01, FR-02)
    const adminNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      title: 'New Resident Registration Pending',
      message: `${newUser.name} registered for ${newUser.block}, Flat ${newUser.flatNumber}. Verification document uploaded.`,
      type: 'verification',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setNotifications(prev => [adminNotification, ...prev]);
  };

  // Verify Resident (FR-02)
  const verifyResident = (userId: string, status: 'verified' | 'rejected') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: status } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, verificationStatus: status }));
    }

    // Notify user of verification decision
    const user = users.find(u => u.id === userId);
    if (user) {
      const userNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: userId,
        title: status === 'verified' ? 'Community Account Verified!' : 'Registration Verification Declined',
        message: status === 'verified' 
          ? `Welcome! Your resident status for ${user.block} Flat ${user.flatNumber} has been verified by the Community Office. You can now borrow and lend resources.`
          : `Your registration could not be verified. Please contact the Community Management Office with valid resident documentation.`,
        type: 'verification',
        read: false,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setNotifications(prev => [userNotif, ...prev]);
    }
  };

  // Update Profile (FR-04)
  const updateProfile = (updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u));
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
  };

  // Add Item Listing (FR-05)
  const addItem = (itemData: Omit<ResourceItem, 'id' | 'ownerId' | 'ownerName' | 'ownerBlock' | 'ownerFlat' | 'ownerRating' | 'bookedDates' | 'createdAt'>) => {
    const newItem: ResourceItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerBlock: currentUser.block,
      ownerFlat: currentUser.flatNumber,
      ownerRating: currentUser.rating || 5.0,
      bookedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
      availability: 'available',
    };

    setItems(prev => [newItem, ...prev]);
  };

  // Edit Item Listing (FR-06)
  const updateItem = (id: string, updatedFields: Partial<ResourceItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  // Delete Item Listing with Active Booking Guard (FR-08)
  const deleteItem = (id: string): { success: boolean; message: string } => {
    const targetItem = items.find(i => i.id === id);
    if (!targetItem) {
      return { success: false, message: 'Item not found.' };
    }

    // Check if involved in an active borrowing or rental transaction (FR-08)
    const activeBooking = bookings.find(b => 
      b.itemId === id && 
      (b.status === 'in_use' || b.status === 'approved' || b.status === 'pending')
    );

    if (activeBooking) {
      return {
        success: false,
        message: `Deletion Blocked (FR-08): This item currently has an active or pending transaction (${activeBooking.status.replace('_', ' ').toUpperCase()} with ${activeBooking.borrowerName}). Items in transaction cannot be deleted.`,
      };
    }

    setItems(prev => prev.filter(i => i.id !== id));
    return { success: true, message: 'Item listing removed successfully.' };
  };

  // Create Borrowing / Rental Request with Date Conflict Prevention (FR-12, FR-14, FR-15)
  const createBooking = (
    itemId: string, 
    startDate: string, 
    endDate: string, 
    purposeNote?: string
  ): { success: boolean; message: string; bookingId?: string } => {
    const item = items.find(i => i.id === itemId);
    if (!item) {
      return { success: false, message: 'Item not found.' };
    }

    // Resident Verification Guard (FR-02)
    if (currentUser.verificationStatus !== 'verified') {
      return {
        success: false,
        message: 'Verification Required (FR-02): Your account is pending resident verification by the community office. Only verified residents can borrow or rent resources.'
      };
    }

    // Prevent booking own item
    if (item.ownerId === currentUser.id) {
      return {
        success: false,
        message: 'You cannot borrow your own listed item.'
      };
    }

    // Overlapping Date Conflict Check (FR-14)
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return {
        success: false,
        message: 'Invalid Date Range: Return date cannot be earlier than pickup date.'
      };
    }

    // Check for overlap against existing active/approved bookings for this item
    const hasOverlap = bookings.some(b => {
      if (b.itemId !== itemId) return false;
      if (b.status !== 'approved' && b.status !== 'in_use') return false;

      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      // Overlap condition: start <= bEnd && end >= bStart
      return (start <= bEnd && end >= bStart);
    });

    if (hasOverlap) {
      return {
        success: false,
        message: `Booking Conflict (FR-14): This item is already reserved or in use during the selected dates (${startDate} to ${endDate}). Please choose different dates.`
      };
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const rentalFee = daysCount * item.rentalPricePerDay;
    const securityDeposit = item.securityDeposit;
    const totalAmount = rentalFee + securityDeposit;

    const newBookingId = `bk-${Date.now()}`;
    const handoverCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newBooking: Booking = {
      id: newBookingId,
      itemId: item.id,
      itemTitle: item.title,
      itemCategory: item.category,
      itemImage: item.imageUrl,
      borrowerId: currentUser.id,
      borrowerName: currentUser.name,
      borrowerFlat: currentUser.flatNumber,
      borrowerPhone: currentUser.phone,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      ownerFlat: item.ownerFlat,
      startDate,
      endDate,
      daysCount,
      rentalFee,
      securityDeposit,
      totalAmount,
      purposeNote,
      status: 'pending',
      handoverCode,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings(prev => [newBooking, ...prev]);

    // Send Real-Time Notification to Owner (FR-20)
    const ownerNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: item.ownerId,
      title: 'New Borrowing Request (FR-20)',
      message: `${currentUser.name} (Flat ${currentUser.flatNumber}) requested to borrow "${item.title}" from ${startDate} to ${endDate} (${daysCount} days).`,
      type: 'booking_request',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setNotifications(prev => [ownerNotif, ...prev]);

    return { 
      success: true, 
      message: 'Borrowing request submitted to owner for review!',
      bookingId: newBookingId 
    };
  };

  // Owner Approves Booking (FR-13, FR-16, FR-21)
  const approveBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'approved' } : b));

    // Update item availability (FR-16) and add booked date range
    setItems(prev => prev.map(item => {
      if (item.id === booking.itemId) {
        const updatedRanges: BookedDateRange[] = [
          ...item.bookedDates,
          {
            bookingId: booking.id,
            startDate: booking.startDate,
            endDate: booking.endDate,
          }
        ];
        return {
          ...item,
          availability: 'reserved',
          bookedDates: updatedRanges,
        };
      }
      return item;
    }));

    // Notify Borrower (FR-21)
    const borrowerNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: booking.borrowerId,
      title: 'Booking Approved! (FR-21)',
      message: `${booking.ownerName} approved your request for "${booking.itemTitle}". Complete online payment to obtain your pickup handover verification code.`,
      type: 'booking_status',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setNotifications(prev => [borrowerNotif, ...prev]);
  };

  // Owner Rejects Booking (FR-13, FR-21)
  const rejectBooking = (bookingId: string, reason?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b));

    // Notify Borrower (FR-21)
    const borrowerNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: booking.borrowerId,
      title: 'Booking Request Declined (FR-21)',
      message: `${booking.ownerName} was unable to fulfill your request for "${booking.itemTitle}". ${reason ? `Reason: ${reason}` : ''}`,
      type: 'booking_status',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setNotifications(prev => [borrowerNotif, ...prev]);
  };

  // Secure Online Payment Processing (FR-17, FR-18, FR-19)
  const processPayment = (
    bookingId: string, 
    paymentMethod: 'Community Card' | 'Instant Bank Transfer / UPI' | 'Resident Wallet'
  ): { success: boolean; transaction: PaymentTransaction } => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    const txId = `pay-tx-${Date.now()}`;
    const receiptNumber = `CRBRMS-TX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction: PaymentTransaction = {
      id: txId,
      bookingId: booking.id,
      itemTitle: booking.itemTitle,
      payerId: booking.borrowerId,
      payerName: `${booking.borrowerName} (Flat ${booking.borrowerFlat})`,
      recipientId: booking.ownerId,
      rentalAmount: booking.rentalFee,
      securityDeposit: booking.securityDeposit,
      totalPaid: booking.totalAmount,
      depositStatus: 'held_in_escrow',
      paymentMethod,
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      receiptNumber,
    };

    setTransactions(prev => [transaction, ...prev]);

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentId: txId,
          paymentStatus: 'paid',
        };
      }
      return b;
    }));

    // Send Payment Confirmation Notification (FR-18)
    const receiptNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: booking.borrowerId,
      title: 'Payment Confirmation & Receipt (FR-18)',
      message: `Payment of $${booking.totalAmount} processed successfully (${paymentMethod}). Handover code: ${booking.handoverCode}. Receipt: ${receiptNumber}.`,
      type: 'payment_receipt',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setNotifications(prev => [receiptNotif, ...prev]);

    return { success: true, transaction };
  };

  // Item Pickup Handover (FR-15, FR-16)
  const handoverPickup = (bookingId: string, inputCode: string): { success: boolean; message: string } => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };

    if (booking.handoverCode !== inputCode.trim()) {
      return { success: false, message: 'Incorrect Handover Verification Code. Please verify with borrower.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'in_use',
          pickupDateActual: todayStr,
        };
      }
      return b;
    }));

    // Update item availability to 'in_use' (FR-16)
    setItems(prev => prev.map(item => {
      if (item.id === booking.itemId) {
        return { ...item, availability: 'in_use' };
      }
      return item;
    }));

    // Notify both parties
    const handoverNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: booking.borrowerId,
      title: 'Item Handover Confirmed',
      message: `"${booking.itemTitle}" has been checked out. Return scheduled for ${booking.endDate}.`,
      type: 'booking_status',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setNotifications(prev => [handoverNotif, ...prev]);

    return { success: true, message: 'Handover verified! Resource is now marked as In Use.' };
  };

  // Complete Return and Release Escrow Deposit (FR-16, FR-19)
  const completeReturn = (bookingId: string): { success: boolean; message: string } => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };

    const todayStr = new Date().toISOString().split('T')[0];

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'completed',
          returnDateActual: todayStr,
          isOverdue: false,
        };
      }
      return b;
    }));

    // Automatically update item availability back to 'available' (FR-16)
    // and remove this booking range from bookedDates
    setItems(prev => prev.map(item => {
      if (item.id === booking.itemId) {
        const remainingBookings = item.bookedDates.filter(bd => bd.bookingId !== bookingId);
        return {
          ...item,
          availability: remainingBookings.length > 0 ? 'reserved' : 'available',
          bookedDates: remainingBookings,
        };
      }
      return item;
    }));

    // Update transaction to reflect deposit refunded to borrower (FR-19)
    setTransactions(prev => prev.map(tx => {
      if (tx.bookingId === bookingId) {
        return {
          ...tx,
          depositStatus: 'refunded_to_borrower',
          status: 'refunded',
        };
      }
      return tx;
    }));

    // Notify borrower of refund and prompt review
    const returnNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: booking.borrowerId,
      title: 'Item Returned & Deposit Refunded (FR-19)',
      message: `"${booking.itemTitle}" check-in confirmed. Your security deposit of $${booking.securityDeposit} has been automatically released back to your account.`,
      type: 'booking_status',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setNotifications(prev => [returnNotif, ...prev]);

    return { success: true, message: 'Resource returned successfully. Security deposit refunded to borrower.' };
  };

  // Submit Review (FR-08)
  const submitReview = (reviewData: Omit<Review, 'id' | 'timestamp'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setReviews(prev => [newReview, ...prev]);

    // Update target user's aggregated rating
    setUsers(prev => prev.map(u => {
      if (u.id === reviewData.revieweeId) {
        const newCount = u.ratingCount + 1;
        const newAvg = Number(((u.rating * u.ratingCount + reviewData.rating) / newCount).toFixed(1));
        return {
          ...u,
          rating: newAvg,
          ratingCount: newCount,
        };
      }
      return u;
    }));
  };

  // Notification read handlers
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Test Simulation for FR-22 (2-day Return Due Reminder)
  const triggerDueReminderSimulation = () => {
    const activeLoan = bookings.find(b => b.status === 'in_use' && !b.isOverdue) || bookings[0];
    const newNotif: NotificationItem = {
      id: `notif-sim-${Date.now()}`,
      userId: currentUser.id,
      title: 'Automated Reminder: Return Due in 2 Days (FR-22)',
      message: `System Reminder: "${activeLoan.itemTitle}" borrowed from ${activeLoan.ownerName} is due for return on ${activeLoan.endDate}. Please coordinate return at the Clubhouse or owner flat.`,
      type: 'due_reminder',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Test Simulation for FR-23 (Overdue Notice Trigger)
  const triggerOverdueSimulation = () => {
    const overdueBooking = bookings.find(b => b.isOverdue) || bookings[0];
    const newNotif: NotificationItem = {
      id: `notif-overdue-${Date.now()}`,
      userId: currentUser.id,
      title: 'URGENT: Overdue Resource Notice (FR-23)',
      message: `Notice: "${overdueBooking.itemTitle}" is past its agreed return date (${overdueBooking.endDate}). Daily late fee of $5/day applies. Please return the resource immediately or contact the Community Office.`,
      type: 'overdue_alert',
      read: false,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Open Chat Window with Lender or Taker (Resident to Resident Chat)
  const openChatWithLenderOrTaker = (params: { 
    itemId?: string; 
    bookingId?: string; 
    otherUserId: string; 
    initialMessage?: string 
  }) => {
    const otherUser = users.find(u => u.id === params.otherUserId) || users[0];
    const relatedItem = params.itemId ? items.find(i => i.id === params.itemId) : undefined;
    const relatedBooking = params.bookingId ? bookings.find(b => b.id === params.bookingId) : undefined;

    // Check if an existing conversation matches this pair and item
    let conv = conversations.find(c => {
      const matchUsers = 
        (c.lenderId === currentUser.id && c.takerId === params.otherUserId) ||
        (c.takerId === currentUser.id && c.lenderId === params.otherUserId);
      if (params.itemId && c.itemId) {
        return matchUsers && c.itemId === params.itemId;
      }
      return matchUsers;
    });

    if (!conv) {
      // Determine who is lender vs taker
      const isCurrentOwner = relatedItem?.ownerId === currentUser.id || relatedBooking?.ownerId === currentUser.id;
      const lender = isCurrentOwner ? currentUser : otherUser;
      const taker = isCurrentOwner ? otherUser : currentUser;

      const newConvId = `conv-${Date.now()}`;
      conv = {
        id: newConvId,
        itemId: relatedItem?.id || relatedBooking?.itemId,
        itemTitle: relatedItem?.title || relatedBooking?.itemTitle || 'Community Sharing Discussion',
        itemImage: relatedItem?.imageUrl || relatedBooking?.itemImage || '/src/assets/images/item_powertool_drill_1791988686272.jpg',
        bookingId: relatedBooking?.id,
        lenderId: lender.id,
        lenderName: lender.name,
        lenderFlat: lender.flatNumber,
        takerId: taker.id,
        takerName: taker.name,
        takerFlat: taker.flatNumber,
        lastMessage: params.initialMessage || 'Started conversation',
        lastMessageTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unreadCount: 0,
      };

      setConversations(prev => [conv!, ...prev]);

      if (params.initialMessage) {
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          conversationId: newConvId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderFlat: currentUser.flatNumber,
          senderRole: conv.lenderId === currentUser.id ? 'lender' : 'taker',
          text: params.initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        };
        setMessages(prev => [...prev, newMsg]);
      }
    }

    setActiveConversationId(conv.id);
    setIsChatOpen(true);
  };

  // Send Chat Message with Simulated Authentic Neighbor Response
  const sendChatMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLender = conv.lenderId === currentUser.id;
    const recipientId = isLender ? conv.takerId : conv.lenderId;
    const recipientUser = users.find(u => u.id === recipientId);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderFlat: currentUser.flatNumber,
      senderRole: isLender ? 'lender' : 'taker',
      text: text.trim(),
      timestamp: timeStr,
      read: true,
    };

    setMessages(prev => [...prev, userMsg]);
    setConversations(prev => prev.map(c => c.id === conversationId ? {
      ...c,
      lastMessage: text.trim(),
      lastMessageTimestamp: timeStr,
    } : c));

    // Simulated authentic neighbor reply after 800ms
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = "Understood! Thanks for messaging. Let's coordinate smoothly.";

      if (lower.includes('meet') || lower.includes('lobby') || lower.includes('gate') || lower.includes('pickup') || lower.includes('when')) {
        replyText = `Sounds great! I'll be in the ${isLender ? 'lobby' : 'flat'} shortly. See you there!`;
      } else if (lower.includes('return') || lower.includes('done') || lower.includes('finished') || lower.includes('clean')) {
        replyText = `Thank you so much! Once handed back, I'll confirm check-in right away to release the deposit.`;
      } else if (lower.includes('battery') || lower.includes('charge') || lower.includes('cable') || lower.includes('adapter')) {
        replyText = `Yes, all cables and accessories are included in the kit and ready to go.`;
      } else if (lower.includes('idli') || lower.includes('dosa') || lower.includes('grind') || lower.includes('batter') || lower.includes('stone')) {
        replyText = `The stone grinder is freshly sanitized. It yields very soft batter! Enjoy the meal.`;
      } else if (lower.includes('pooja') || lower.includes('lamp') || lower.includes('diya') || lower.includes('brass')) {
        replyText = `Wishing you and your family blessed celebrations! Handover ready anytime.`;
      } else if (lower.includes('help') || lower.includes('how') || lower.includes('work') || lower.includes('instruction')) {
        replyText = `It's very easy to operate! I can give a quick 2-minute demo when we meet.`;
      } else {
        replyText = `Got your message! Everything looks good on my end. Talk soon!`;
      }

      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        conversationId,
        senderId: recipientId,
        senderName: recipientUser ? recipientUser.name : 'Neighbor',
        senderFlat: recipientUser ? recipientUser.flatNumber : '',
        senderRole: isLender ? 'taker' : 'lender',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };

      setMessages(prev => [...prev, replyMsg]);
      setConversations(prev => prev.map(c => c.id === conversationId ? {
        ...c,
        lastMessage: replyText,
        lastMessageTimestamp: replyMsg.timestamp,
      } : c));
    }, 850);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        items,
        bookings,
        transactions,
        notifications,
        reviews,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        availabilityFilter,
        setAvailabilityFilter,
        priceFilter,
        setPriceFilter,
        theme,
        toggleTheme,
        
        switchUser,
        registerUser,
        verifyResident,
        updateProfile,
        
        addItem,
        updateItem,
        deleteItem,
        
        createBooking,
        approveBooking,
        rejectBooking,
        processPayment,
        handoverPickup,
        completeReturn,
        
        submitReview,
        
        markNotificationAsRead,
        markAllNotificationsAsRead,
        triggerOverdueSimulation,
        triggerDueReminderSimulation,
        
        activeItemModal,
        setActiveItemModal,
        isAddItemOpen,
        setIsAddItemOpen,
        isTraceabilityOpen,
        setIsTraceabilityOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        activeBookingForPayment,
        setActiveBookingForPayment,
        activeReviewBooking,
        setActiveReviewBooking,

        // Chat
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        isChatOpen,
        setIsChatOpen,
        openChatWithLenderOrTaker,
        sendChatMessage,

        // Marketplace features
        savedItemIds,
        toggleSaveItem,
        recentlyViewedIds,
        addRecentlyViewed,
        reportedItemIds,
        reportItem,

        // Dual Portals & Auth
        portalMode,
        setPortalMode,
        userNavTab,
        setUserNavTab,
        adminNavTab,
        setAdminNavTab,
        isAdminAuthenticated,
        loginAsAdmin,
        loginAsResident,
        logout,
        switchToPortal,

        // Admin Catalog & Moderation Oversight
        reports,
        resolveReport,
        adminToggleItemStatus,
        adminRemoveItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
