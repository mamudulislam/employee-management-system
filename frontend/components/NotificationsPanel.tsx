import React, { useState } from 'react';
import { Bell, Trash2, CheckCircle2, AlertCircle, Info, Clock, X } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Leave Request Approved',
      message: 'Your leave request for Dec 20-25 has been approved',
      timestamp: new Date(Date.now() - 2 * 60000),
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Attendance Alert',
      message: 'Your attendance is below 90% this month',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Payroll Update',
      message: 'Your salary has been credited to your account',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
    },
    {
      id: '4',
      type: 'error',
      title: 'Document Upload Failed',
      message: 'Failed to upload resume. Please try again',
      timestamp: new Date(Date.now() - 24 * 3600000),
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-emerald-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-amber-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      default:
        return <Bell size={20} className="text-slate-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-indigo-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bell size={48} className="text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-500">
                        <Clock size={12} />
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-slate-400 dark:text-slate-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={handleClearAll}
              className="w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsPanel;
