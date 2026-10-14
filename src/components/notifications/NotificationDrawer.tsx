import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Bell, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  UserCheck,
  Play
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    triggerDueReminderSimulation,
    triggerOverdueSimulation,
    setActiveView
  } = useApp();

  if (!isOpen) return null;

  // Filter for notifications relevant to current user or admin
  const userNotifs = notifications.filter(
    n => n.userId === currentUser.id || currentUser.role === 'admin'
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking_request':
        return <Calendar className="w-4 h-4 text-sky-600 shrink-0" />;
      case 'booking_status':
        return <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'due_reminder':
        return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'overdue_alert':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'payment_receipt':
        return <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />;
      case 'verification':
        return <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/30 transition-opacity"
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-neutral-700" />
            <h2 className="text-base font-semibold text-neutral-900">Notifications & Alerts</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SRS Simulation Testing Banner */}
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 text-xs">
          <div className="text-neutral-600 font-medium mb-1.5">
            Automated Notification Engine (SRS Compliance)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerDueReminderSimulation();
              }}
              className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200 rounded hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-2.5 h-2.5" />
              <span>Simulate 2-Day Return Reminder (FR-22)</span>
            </button>
            <button
              onClick={() => {
                triggerOverdueSimulation();
              }}
              className="px-2.5 py-1 text-[11px] font-medium bg-rose-50 text-rose-900 border border-rose-200 rounded hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-2.5 h-2.5" />
              <span>Simulate Overdue Alert (FR-23)</span>
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-2">
          {userNotifs.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-500">
              No notifications yet.
            </div>
          ) : (
            userNotifs.map(n => (
              <div 
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-4 rounded-md transition-colors cursor-pointer ${n.read ? 'bg-white hover:bg-neutral-50' : 'bg-neutral-50/80 hover:bg-neutral-100/80 font-medium'}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {n.title}
                      </div>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="text-[10px] text-neutral-400 mt-1.5 tabular-nums font-mono">
                      {n.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer"
          >
            Mark all as read
          </button>
          <button
            onClick={() => {
              onClose();
              setActiveView('dashboard');
            }}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
          >
            Go to My Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
