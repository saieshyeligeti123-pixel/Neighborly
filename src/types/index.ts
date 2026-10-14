export type UserRole = 'resident' | 'admin' | 'security';

export type PortalMode = 'portal_select' | 'admin' | 'user';
export type UserNavTab = 'home' | 'explore' | 'rentals' | 'listings' | 'messages' | 'wishlist' | 'profile' | 'help';
export type AdminNavTab = 'dashboard' | 'catalog' | 'rentals' | 'security' | 'reports' | 'bioscience' | 'traceability';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  communityId: string; // e.g. "Green Meadows Residences"
  block: string;       // e.g. "Tower A"
  flatNumber: string;  // e.g. "402"
  residentType: 'Owner' | 'Tenant';
  avatar?: string;
  rating: number;
  ratingCount: number;
  bio?: string;
  joinedDate: string;
}

export type ItemCategory = 
  | 'Power Tools' 
  | 'Camping & Outdoors' 
  | 'Cleaning & Washers' 
  | 'Audio & Visual' 
  | 'Gardening' 
  | 'Home & DIY'
  | 'Indian Household & Kitchen'
  | 'Bioscience & Lab';

export type ItemAvailability = 'available' | 'reserved' | 'in_use' | 'maintenance';

export interface BookedDateRange {
  bookingId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  imageUrl: string;
  additionalImages?: string[];
  rentalPricePerDay: number; // in ₹ (0 for free community borrowing)
  securityDeposit: number;   // Refundable deposit in ₹
  condition: 'Like New' | 'Excellent' | 'Good' | 'Fair';
  availability: ItemAvailability;
  ownerId: string;
  ownerName: string;
  ownerBlock: string;
  ownerFlat: string;
  ownerRating: number;
  locationInstructions: string;
  bookedDates: BookedDateRange[];
  createdAt: string;
  specifications?: Record<string, string>;
  rentalRules?: string[];
  depositTerms?: string;
  isFeatured?: boolean;
  viewsCount?: number;
}

export type BookingStatus = 
  | 'pending'    // Submitted by borrower, waiting for owner approval
  | 'approved'   // Approved by owner, awaiting pickup & payment
  | 'in_use'     // Item picked up by borrower
  | 'completed'  // Item returned and verified, deposit refunded
  | 'rejected'   // Rejected by owner
  | 'cancelled'; // Cancelled by borrower

export interface Booking {
  id: string;
  itemId: string;
  itemTitle: string;
  itemCategory: string;
  itemImage: string;
  borrowerId: string;
  borrowerName: string;
  borrowerFlat: string;
  borrowerPhone: string;
  ownerId: string;
  ownerName: string;
  ownerFlat: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  daysCount: number;
  rentalFee: number;
  securityDeposit: number;
  totalAmount: number;
  purposeNote?: string;
  status: BookingStatus;
  handoverCode: string; // 4-digit verification code
  paymentId?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  pickupDateActual?: string;
  returnDateActual?: string;
  isOverdue?: boolean;
  overdueDays?: number;
  overdueNoticeSent?: boolean;
  reminderSent?: boolean;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  itemTitle: string;
  payerId: string;
  payerName: string;
  recipientId: string;
  rentalAmount: number;
  securityDeposit: number;
  totalPaid: number;
  depositStatus: 'held_in_escrow' | 'refunded_to_borrower' | 'deducted_for_damages';
  paymentMethod: 'Community Card' | 'Instant Bank Transfer / UPI' | 'Resident Wallet';
  status: 'completed' | 'refunded';
  timestamp: string;
  receiptNumber: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking_request' | 'booking_status' | 'due_reminder' | 'overdue_alert' | 'payment_receipt' | 'verification' | 'system';
  read: boolean;
  timestamp: string;
  linkAction?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  itemId: string;
  itemTitle: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string; // target user
  revieweeName: string;
  type: 'borrower_to_owner' | 'owner_to_borrower';
  rating: number; // 1 - 5
  comment: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderFlat: string;
  senderRole: 'lender' | 'taker';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  itemId?: string;
  itemTitle?: string;
  itemImage?: string;
  bookingId?: string;
  lenderId: string;
  lenderName: string;
  lenderFlat: string;
  takerId: string;
  takerName: string;
  takerFlat: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
}

export interface ReportListing {
  id: string;
  itemId: string;
  itemTitle: string;
  reporterId: string;
  reporterName: string;
  reason: 'Damaged or Unsafe' | 'Inaccurate Description' | 'Misleading Pricing' | 'Prohibited Item' | 'Other';
  details: string;
  status: 'pending' | 'resolved';
  timestamp: string;
}
