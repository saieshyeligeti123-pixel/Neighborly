import React, { useState } from 'react';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Star, MessageSquare } from 'lucide-react';

interface ReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ booking, isOpen, onClose }) => {
  const { currentUser, submitReview } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isBorrower = currentUser.id === booking.borrowerId;
  const revieweeId = isBorrower ? booking.ownerId : booking.borrowerId;
  const revieweeName = isBorrower ? booking.ownerName : booking.borrowerName;
  const reviewType = isBorrower ? 'borrower_to_owner' : 'owner_to_borrower';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview({
      bookingId: booking.id,
      itemId: booking.itemId,
      itemTitle: booking.itemTitle,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      revieweeId,
      revieweeName,
      type: reviewType,
      rating,
      comment: comment.trim() || 'Great experience borrowing and communicating with neighbor.',
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Community Two-Way Rating (F8)</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Rate transaction with {revieweeName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <div className="text-emerald-700 font-bold text-sm">Thank You! Rating Recorded.</div>
            <p className="text-xs text-neutral-500">
              Your feedback reinforces our community trust matrix and helps neighbors borrow safely.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Resource context */}
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs">
              <span className="text-neutral-500">Resource:</span>{' '}
              <span className="font-semibold text-neutral-900">{booking.itemTitle}</span>
              <div className="text-neutral-500 text-[11px] mt-0.5">
                Completed on {booking.returnDateActual || booking.endDate}
              </div>
            </div>

            {/* Star Rating */}
            <div className="text-center py-2">
              <div className="text-xs font-semibold text-neutral-800 mb-2">
                {isBorrower 
                  ? `How was the condition of the resource and communication with ${revieweeName}?`
                  : `How was ${revieweeName}'s punctuality and care of your resource?`}
              </div>
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-6 h-6 ${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}`} 
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-bold text-neutral-700 mt-1 font-mono tabular-nums">
                {rating} out of 5 stars
              </div>
            </div>

            {/* Feedback text */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Neighbor Review / Comments
              </label>
              <textarea 
                rows={3}
                required
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share helpful details for neighbors (e.g., tool cleanliness, punctual handover, accessories present)..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-sm transition-colors cursor-pointer"
              >
                Submit Review
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
