import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks';

/**
 * Notification types
 */
export enum NotificationType {
  CHALLENGE_RECEIVED = 'CHALLENGE_RECEIVED',
  CHALLENGE_ACCEPTED = 'CHALLENGE_ACCEPTED',
  CHALLENGE_DECLINED = 'CHALLENGE_DECLINED',
  CHALLENGE_SUBMITTED = 'CHALLENGE_SUBMITTED',
}

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  challengeId?: string;
  createdAt: Date;
  read: boolean;
}

/**
 * Notification context state
 */
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

/**
 * Notification context value
 */
export interface NotificationContextValue extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

/**
 * Default notification state
 */
const defaultState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

/**
 * Notification Context
 */
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

/**
 * Notification Provider props
 */
interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Notification Provider component
 * Manages in-app notifications for challenges
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  /**
   * Add a new notification
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        read: false,
      };
      return [newNotification, ...prev];
    });
  }, []);

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  /**
   * Remove a specific notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear notifications when user changes
  useEffect(() => {
    if (!user) {
      clearNotifications();
    }
  }, [user, clearNotifications]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

/**
 * Hook to use notification context
 */
export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

/**
 * Hook to get unread notification count
 */
export function useUnreadNotifications(): number {
  const { unreadCount } = useNotifications();
  return unreadCount;
}

export { NotificationContext };
