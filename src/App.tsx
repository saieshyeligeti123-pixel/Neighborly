/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PortalSelectScreen } from './components/auth/PortalSelectScreen';
import { AdminPortal } from './components/admin/AdminPortal';
import { UserPortal } from './components/user/UserPortal';
import { ItemDetailModal } from './components/catalog/ItemDetailModal';
import { AddItemModal } from './components/catalog/AddItemModal';
import { BookingModal } from './components/booking/BookingModal';
import { PaymentModal } from './components/payment/PaymentModal';
import { ReviewModal } from './components/reviews/ReviewModal';
import { SrsTraceabilityModal } from './components/traceability/SrsTraceabilityModal';
import { ChatModal } from './components/chat/ChatModal';
import { ResourceItem } from './types';

const MainContent: React.FC = () => {
  const { 
    portalMode,
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
    bookings,
    theme,
    isChatOpen,
    setIsChatOpen
  } = useApp();

  const [activeBookingItem, setActiveBookingItem] = useState<ResourceItem | null>(null);

  const handleOpenBooking = (item: ResourceItem) => {
    setActiveBookingItem(item);
  };

  const handleBookingSubmitted = (bookingId: string) => {
    setActiveBookingItem(null);
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      setActiveBookingForPayment(targetBooking);
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'dark ios-bg-dark text-neutral-100' : 'light ios-bg-light text-neutral-900'} min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-300`}>
      
      {/* Apple iOS Subtle Ambient Mesh Glow Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Portal Selection / Routing */}
      {portalMode === 'portal_select' && (
        <PortalSelectScreen />
      )}

      {portalMode === 'admin' && (
        <AdminPortal />
      )}

      {portalMode === 'user' && (
        <UserPortal />
      )}

      {/* Neighbor-to-Neighbor Resident Chat Modal */}
      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Item Detail Modal */}
      {activeItemModal && (
        <ItemDetailModal 
          item={activeItemModal}
          onClose={() => setActiveItemModal(null)}
          onInitiateBooking={handleOpenBooking}
        />
      )}

      {/* Add Resource Listing Modal (FR-05) */}
      <AddItemModal 
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
      />

      {/* Booking Scheduling Modal (FR-12, FR-14, FR-15) */}
      {activeBookingItem && (
        <BookingModal 
          item={activeBookingItem}
          isOpen={!!activeBookingItem}
          onClose={() => setActiveBookingItem(null)}
          onSuccess={handleBookingSubmitted}
        />
      )}

      {/* Payment Gateway Modal (FR-17, FR-18) */}
      {isPaymentModalOpen && activeBookingForPayment && (
        <PaymentModal 
          booking={activeBookingForPayment}
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setActiveBookingForPayment(null);
          }}
        />
      )}

      {/* Two-Way Rating Review Modal (F8) */}
      {activeReviewBooking && (
        <ReviewModal 
          booking={activeReviewBooking}
          isOpen={!!activeReviewBooking}
          onClose={() => setActiveReviewBooking(null)}
        />
      )}

      {/* IEEE SRS Traceability Matrix Modal */}
      <SrsTraceabilityModal 
        isOpen={isTraceabilityOpen}
        onClose={() => setIsTraceabilityOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
