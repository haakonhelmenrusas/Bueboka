import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notificationsApi } from '@/services/api/notificationsApi';
import { NotificationType, type Notification } from '@/types/Notification';

// Re-exported so existing imports from this module keep working
export { NotificationType } from '@/types/Notification';
export type { Notification } from '@/types/Notification';

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
  /** Re-fetch the inbox from /api/notifications */
  refresh: () => Promise<void>;
}

/**
 * Notification Context
 */
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const isLocalId = (id: string) => id.startsWith('local-');

/**
 * How often the inbox re-fetches /api/notifications. Set high (5 min) to avoid
 * hammering the API; tune after user feedback.
 */
export const NOTIFICATIONS_POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Merge freshly fetched server rows with local-only (optimistic) ones.
 * Local rows whose type+challengeId now exist server-side are dropped, so a
 * locally-added "challenge sent" never duplicates the server copy. Newest first.
 */
function mergeServerWithLocal(serverList: Notification[], prev: Notification[]): Notification[] {
  const serverKeys = new Set(serverList.filter((n) => n.challengeId).map((n) => `${n.type}:${n.challengeId}`));
  const keptLocal = prev.filter((n) => isLocalId(n.id) && !(n.challengeId && serverKeys.has(`${n.type}:${n.challengeId}`)));
  return [...serverList, ...keptLocal].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Notification Provider component
 * Backs the in-app notification inbox with /api/notifications: fetches on
 * login, polls every 30s, and applies read/delete operations to the server
 * (optimistically locally). Locally-created notifications (e.g. an outgoing
 * invite) use `local-` ids and only live in memory until the server copy arrives.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const data = await notificationsApi.getAll();
      setNotifications((prev) => mergeServerWithLocal(data.notifications, prev));
    } catch (err) {
      // Keep the current (possibly stale/local) state on network errors
      console.error('[notifications] fetch failed:', err);
    }
  }, [user]);

  // Initial fetch + poll, and reset when the user logs out
  useEffect(() => {
    refresh();
    if (!user) return;
    const interval = setInterval(refresh, NOTIFICATIONS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh, user]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  /**
   * Add a local (optimistic) notification. Deduped by type+challengeId so it
   * never double-shows once the server row arrives.
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => {
      if (notification.challengeId && prev.some((p) => p.type === notification.type && p.challengeId === notification.challengeId)) {
        return prev;
      }
      const newNotification: Notification = {
        ...notification,
        challengeId: notification.challengeId ?? null,
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      return [newNotification, ...prev];
    });
  }, []);

  /**
   * Mark a notification as read — optimistic locally, PATCHed to the server
   * unless it is a local-only notification.
   */
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (!isLocalId(id)) {
      notificationsApi.markAsRead(id).catch((err) => console.error('[notifications] markAsRead failed:', err));
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notificationsApi.markAllAsRead().catch((err) => console.error('[notifications] markAllAsRead failed:', err));
  }, []);

  /**
   * Remove a specific notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!isLocalId(id)) {
      notificationsApi.delete(id).catch((err) => console.error('[notifications] delete failed:', err));
    }
  }, []);

  /**
   * Clear all notifications (local state only, e.g. on logout)
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    refresh,
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
