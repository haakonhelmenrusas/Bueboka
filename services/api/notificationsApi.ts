import { authFetchClient as client } from './authFetch';
import { handleApiError } from './errors';
import type { Notification, NotificationsListResponse } from '@/types';

/**
 * Client for /api/notifications — the server-side notification inbox.
 * Challenge actions (invite/accept/decline/cancel/submit) create rows here
 * and push them via Expo Push when a device token is registered.
 */
export const notificationsApi = {
  /**
   * List the current user's notifications, newest first (server caps at 100).
   * Response always includes the total unreadCount for badge rendering.
   */
  async getAll(unreadOnly = false): Promise<NotificationsListResponse> {
    try {
      const url = unreadOnly ? '/notifications?unreadOnly=true' : '/notifications';
      const response = await client.get<NotificationsListResponse>(url);
      const data = response.data;
      return {
        notifications: data.notifications ?? [],
        unreadCount: data.unreadCount ?? (data.notifications ?? []).filter((n) => !n.read).length,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Mark a single notification as read (or unread). */
  async markAsRead(id: string, read = true): Promise<Notification> {
    try {
      const response = await client.patch<{ notification: Notification }>(`/notifications/${id}`, { read });
      return response.data.notification;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Mark all notifications as read. Returns how many were updated. */
  async markAllAsRead(): Promise<number> {
    try {
      const response = await client.patch<{ success: boolean; updated: number }>('/notifications/read-all', undefined);
      return response.data.updated ?? 0;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Delete a notification. */
  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/notifications/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Register this device's Expo push token (call after login / on token rotation). */
  async registerPushToken(token: string): Promise<void> {
    try {
      await client.post('/notifications/push-token', { token });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /** Remove the registered push token (e.g. on logout). */
  async removePushToken(): Promise<void> {
    try {
      await client.delete('/notifications/push-token');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
