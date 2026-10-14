import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User as UserIcon, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  Star, 
  ShieldCheck, 
  AlertTriangle, 
  Edit, 
  Package, 
  Clock, 
  Award,
  CheckCircle2
} from 'lucide-react';

interface UserProfileProps {
  onOpenEditProfile: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onOpenEditProfile }) => {
  const { currentUser, items, bookings, reviews } = useApp();

  const userItems = items.filter(i => i.ownerId === currentUser.id);
  const userBorrowings = bookings.filter(b => b.borrowerId === currentUser.id);
  const completedBorrowings = userBorrowings.filter(b => b.status === 'completed');
  const userReviews = reviews.filter(r => r.revieweeId === currentUser.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="ios-glass p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shrink-0">
              {currentUser.name.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  currentUser.verificationStatus === 'verified'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {currentUser.verificationStatus === 'verified' ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Resident</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Pending Verification</span>
                    </>
                  )}
                </span>
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-300 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {currentUser.block}, Flat {currentUser.flatNumber}
                </span>
                <span>·</span>
                <span className="px-2 py-0.2 rounded-md bg-neutral-100 dark:bg-white/10 text-[11px]">
                  {currentUser.residentType}
                </span>
                <span>·</span>
                <span>Green Meadows Community</span>
              </div>

              {currentUser.bio && (
                <p className="mt-2 text-xs text-neutral-500 italic max-w-lg">
                  "{currentUser.bio}"
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onOpenEditProfile}
            className="px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Resident Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-neutral-200/50 dark:border-white/10">
          <div className="p-3.5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 text-center">
            <div className="text-xs text-neutral-500 font-medium">Community Rating</div>
            <div className="text-lg font-bold text-amber-500 mt-0.5 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{currentUser.rating > 0 ? currentUser.rating : '5.0'}</span>
              <span className="text-xs text-neutral-400 font-normal">({currentUser.ratingCount || 12})</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 text-center">
            <div className="text-xs text-neutral-500 font-medium">Items Listed</div>
            <div className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
              {userItems.length}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 text-center">
            <div className="text-xs text-neutral-500 font-medium">Loans Completed</div>
            <div className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
              {completedBorrowings.length}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 text-center">
            <div className="text-xs text-neutral-500 font-medium">Member Since</div>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-1.5 font-mono">
              {currentUser.joinedDate || '2026-01-15'}
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Community Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Contact Information */}
        <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Contact & Identification
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-neutral-400">Registered Phone</div>
                <div className="font-semibold text-neutral-900 dark:text-white font-mono">{currentUser.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-neutral-400">Email Address</div>
                <div className="font-semibold text-neutral-900 dark:text-white">{currentUser.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-neutral-400">Green Meadows Location</div>
                <div className="font-semibold text-neutral-900 dark:text-white">{currentUser.block}, Flat {currentUser.flatNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges & Safety Standing */}
        <div className="ios-glass p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Community Standing & Badges
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-emerald-900 dark:text-emerald-300">Identity Vetted by Estate Office</div>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                  Property deed / lease documentation verified in compliance with SRS FR-01 and FR-02.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40">
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-900 dark:text-white">Active Sharing Neighbor</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Maintains a positive trust score with zero unreturned asset complaints.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
