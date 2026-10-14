import React, { useState } from 'react';
import { ResourceItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  AlertCircle, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Info,
  MessageSquare,
  Heart,
  Flag,
  Share2,
  Sparkles
} from 'lucide-react';

interface ItemDetailModalProps {
  item: ResourceItem;
  onClose: () => void;
  onInitiateBooking: (item: ResourceItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ 
  item, 
  onClose, 
  onInitiateBooking 
}) => {
  const { 
    currentUser, 
    deleteItem, 
    reviews, 
    bookings, 
    items,
    setActiveItemModal,
    openChatWithLenderOrTaker,
    savedItemIds,
    toggleSaveItem,
    reportItem,
    reportedItemIds
  } = useApp();

  const [activePhoto, setActivePhoto] = useState<string>(item.imageUrl);
  const [deleteStatus, setDeleteStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading description');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const isOwner = currentUser.id === item.ownerId;
  const isVerified = currentUser.verificationStatus === 'verified';
  const isSaved = savedItemIds.includes(item.id);
  const isReported = reportedItemIds.includes(item.id);

  // Combine main image and any additional images
  const allImages = [item.imageUrl, ...(item.additionalImages || [])].filter(
    (url, idx, self) => self.indexOf(url) === idx
  );

  // Item-specific or owner-specific reviews
  const itemReviews = reviews.filter(r => r.itemId === item.id || r.revieweeId === item.ownerId);

  // Active bookings for schedule display
  const activeBookings = bookings.filter(b => 
    b.itemId === item.id && (b.status === 'in_use' || b.status === 'approved')
  );

  // Related items from same category
  const relatedItems = items
    .filter(i => i.id !== item.id && (i.category === item.category || i.ownerBlock === item.ownerBlock))
    .slice(0, 3);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove "${item.title}"?`)) {
      const res = deleteItem(item.id);
      if (!res.success) {
        setDeleteStatus({ message: res.message, isError: true });
      } else {
        onClose();
      }
    }
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    reportItem(item.id, reportReason);
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReporting(false);
      setReportSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header bar */}
        <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-900/80">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>Condition: <strong className="text-neutral-800 dark:text-neutral-200">{item.condition}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="capitalize font-medium text-emerald-600 dark:text-emerald-400">{item.availability.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveItem(item.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isSaved 
                  ? 'border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800' 
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete status alert */}
        {deleteStatus && (
          <div className="px-5 py-3 bg-rose-50 border-b border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{deleteStatus.message}</div>
            <button 
              onClick={() => setDeleteStatus(null)}
              className="text-rose-500 hover:text-rose-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Main Visual & Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Gallery: Main Image + Thumbnails */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs">
                <img 
                  src={activePhoto} 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {item.isFeatured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Neighbor Resource</span>
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple images exist */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(img)}
                      className={`relative w-16 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                        activePhoto === img 
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30' 
                          : 'border-neutral-200 dark:border-neutral-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Pricing & Owner Details */}
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white leading-snug">
                  {item.title}
                </h2>
                
                {/* Pricing Banner in ₹ */}
                <div className="mt-3.5 p-3.5 bg-neutral-50 dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Rental Rate</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-mono tabular-nums">
                    {item.rentalPricePerDay === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-sans text-xl">Free Community Borrowing</span>
                    ) : (
                      <span>₹{item.rentalPricePerDay} <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">/ day</span></span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 flex items-center gap-1.5 font-mono tabular-nums">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Refundable Escrow Deposit: ₹{item.securityDeposit}</span>
                  </div>
                </div>

                {/* Owner info */}
                <div className="mt-4 pt-3.5 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Resource Owner</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">{item.ownerName}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{item.ownerBlock}, Flat {item.ownerFlat}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs font-bold text-amber-500 font-mono tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-current mr-1" />
                        <span>{item.ownerRating} resident rating</span>
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        Verified Green Meadows Resident
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Handover & Location instructions */}
              <div className="text-xs text-neutral-600 dark:text-neutral-300 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <div className="font-semibold text-neutral-900 dark:text-white mb-0.5">Pickup & Handover Instructions</div>
                <p>{item.locationInstructions}</p>
              </div>

            </div>

          </div>

          {/* Description Section */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">Item Description</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Specifications Table */}
          {item.specifications && Object.keys(item.specifications).length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">Specifications & Inclusions</h4>
              <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs divide-y divide-neutral-200 dark:divide-neutral-700">
                {Object.entries(item.specifications).map(([key, val]) => (
                  <div key={key} className="flex px-4 py-2.5">
                    <span className="w-1/3 font-semibold text-neutral-700 dark:text-neutral-300">{key}</span>
                    <span className="w-2/3 text-neutral-600 dark:text-neutral-400">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rental Rules & Deposit Terms */}
          {(item.rentalRules || item.depositTerms) && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">Community Rental Terms & Care Rules</h4>
              <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl text-xs space-y-2">
                {item.rentalRules && item.rentalRules.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-300">
                    {item.rentalRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                )}
                {item.depositTerms && (
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-emerald-200/40 dark:border-emerald-800/30">
                    <strong>Deposit Policy:</strong> {item.depositTerms}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Availability Schedule & Calendar */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span>Availability & Reserved Dates</span>
              </h4>
            </div>

            {activeBookings.length === 0 ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>No active reservations scheduled. This resource is ready for immediate booking!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  The following dates are currently booked:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeBookings.map(b => (
                    <div key={b.id} className="p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-mono tabular-nums font-medium text-neutral-800 dark:text-neutral-200">
                          {b.startDate} to {b.endDate}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 capitalize">
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verified Neighbor Reviews */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 flex items-center justify-between">
              <span>Neighbor Reviews & Feedback</span>
              <span className="text-xs text-neutral-500 font-normal">
                {itemReviews.length} verified review{itemReviews.length === 1 ? '' : 's'}
              </span>
            </h4>

            {itemReviews.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No reviews recorded yet for this item.</p>
            ) : (
              <div className="space-y-2.5">
                {itemReviews.map(r => (
                  <div key={r.id} className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{r.reviewerName}</span>
                      <div className="flex items-center text-amber-500 font-mono">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-1">{r.comment}</p>
                    <div className="text-[10px] text-neutral-400 mt-1 font-mono">{r.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Items Recommendations */}
          {relatedItems.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
                More Resources from {item.category}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedItems.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => setActiveItemModal(rel)}
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:border-emerald-500 text-left transition-colors cursor-pointer group flex sm:flex-col gap-2.5"
                  >
                    <div className="w-16 h-16 sm:w-full sm:h-24 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 shrink-0">
                      <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">{rel.title}</div>
                      <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {rel.rentalPricePerDay === 0 ? 'Free' : `₹${rel.rentalPricePerDay}/day`}
                      </div>
                      <div className="text-[10px] text-neutral-400">{rel.ownerFlat}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Report Listing Drawer/Form */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 flex items-center justify-between text-xs text-neutral-400">
            <span>Listing ID: {item.id}</span>
            {!isOwner && (
              <div>
                {isReported ? (
                  <span className="text-amber-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Listing Reported to Gate Committee</span>
                  </span>
                ) : !isReporting ? (
                  <button
                    onClick={() => setIsReporting(true)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Listing</span>
                  </button>
                ) : (
                  <form onSubmit={handleSendReport} className="flex items-center gap-2">
                    <select
                      value={reportReason}
                      onChange={e => setReportReason(e.target.value)}
                      className="px-2 py-1 text-xs border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                    >
                      <option value="Misleading description">Misleading description</option>
                      <option value="Damaged or unusable">Damaged or unusable</option>
                      <option value="Incorrect owner/flat">Incorrect owner/flat</option>
                      <option value="Inappropriate listing">Inappropriate listing</option>
                    </select>
                    <button
                      type="submit"
                      className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-semibold cursor-pointer"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsReporting(false)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          {isOwner ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-neutral-500">You are the verified owner of this resource.</span>
              <button
                onClick={handleDelete}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Listing</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-3">
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                {!isVerified ? (
                  <span className="text-amber-600 font-medium flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Verification Required
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">Ready for community loan</span>
                )}
              </div>
              
              <div className="flex items-center gap-2.5">
                {/* Contact Lender Button */}
                <button
                  onClick={() => {
                    onClose();
                    openChatWithLenderOrTaker({
                      itemId: item.id,
                      otherUserId: item.ownerId,
                      initialMessage: `Hi ${item.ownerName}! I'm looking at borrowing your "${item.title}". Can you confirm if it is available for pickup?`
                    });
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-neutral-800 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact Lender</span>
                </button>

                {/* Request to Borrow Button */}
                <button
                  disabled={!isVerified || item.availability === 'maintenance'}
                  onClick={() => {
                    onClose();
                    onInitiateBooking(item);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                    !isVerified || item.availability === 'maintenance'
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                  }`}
                >
                  <span>Request to Borrow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
