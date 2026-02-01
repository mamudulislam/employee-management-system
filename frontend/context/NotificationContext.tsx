import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider component - wrap your app with this
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notif-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook to use notifications
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

/**
 * Notification display component
 */
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-emerald-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-amber-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getTextColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'text-emerald-900 dark:text-emerald-100';
      case 'error':
        return 'text-red-900 dark:text-red-100';
      case 'warning':
        return 'text-amber-900 dark:text-amber-100';
      case 'info':
        return 'text-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`
            max-w-md w-full rounded-lg border p-4 shadow-lg
            ${getBgColor(notif.type)}
            animate-in fade-in slide-in-from-right-4 duration-300
          `}
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">{getIcon(notif.type)}</div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold ${getTextColor(notif.type)}`}>
                {notif.title}
              </h3>
              {notif.message && (
                <p className={`text-sm mt-1 ${getTextColor(notif.type)}`}>
                  {notif.message}
                </p>
              )}
              {notif.action && (
                <button
                  onClick={() => {
                    notif.action?.onClick();
                    removeNotification(notif.id);
                  }}
                  className={`text-sm font-medium mt-2 underline hover:no-underline ${getTextColor(notif.type)}`}
                >
                  {notif.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Close notification"
            >
              <X size={18} className={getTextColor(notif.type)} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  NotificationProvider,
  useNotification,
  NotificationContainer,
};
