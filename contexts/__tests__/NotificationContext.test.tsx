import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { notificationsApi } from '@/services/api/notificationsApi';
import type { Notification } from '@/types';

jest.mock('@/services/api/notificationsApi', () => ({
  notificationsApi: {
    getAll: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    delete: jest.fn(),
  },
}));

let mockUser: { id: string; name: string } | null = { id: 'user-1', name: 'Test' };
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser, isAuthenticated: !!mockUser }),
}));

// Bypass the global jestSetup mock to test the real provider
const { NotificationProvider, useNotifications, NotificationType } = jest.requireActual('@/contexts/NotificationContext');

const mockGetAll = notificationsApi.getAll as jest.Mock;
const mockMarkAsRead = notificationsApi.markAsRead as jest.Mock;
const mockMarkAllAsRead = notificationsApi.markAllAsRead as jest.Mock;
const mockDelete = notificationsApi.delete as jest.Mock;

const serverNotification: Notification = {
  id: 'n1',
  type: 'CHALLENGE_RECEIVED' as Notification['type'],
  title: 'Ny utfordring',
  message: 'Fra Ola',
  challengeId: 'ch-1',
  read: false,
  createdAt: '2026-11-03T10:00:00.000Z',
};

const wrapper = ({ children }: { children: React.ReactNode }) => <NotificationProvider>{children}</NotificationProvider>;

describe('NotificationProvider (API-backed)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { id: 'user-1', name: 'Test' };
  });

  it('fetches the inbox from the API on mount and derives unreadCount', async () => {
    mockGetAll.mockResolvedValue({ notifications: [serverNotification], unreadCount: 1 });

    const { result } = await renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => expect(result.current.notifications).toHaveLength(1));
    expect(mockGetAll).toHaveBeenCalledWith();
    expect(result.current.notifications[0].id).toBe('n1');
    expect(result.current.unreadCount).toBe(1);
  });

  it('clears the inbox when there is no user', async () => {
    mockUser = null;
    mockGetAll.mockResolvedValue({ notifications: [], unreadCount: 0 });

    const { result } = await renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => expect(result.current.notifications).toEqual([]));
    expect(mockGetAll).not.toHaveBeenCalled();
  });

  it('addNotification dedupes by type+challengeId and uses a local id', async () => {
    mockGetAll.mockResolvedValue({ notifications: [], unreadCount: 0 });
    const { result } = await renderHook(() => useNotifications(), { wrapper });

    await act(async () => {
      result.current.addNotification({ type: NotificationType.CHALLENGE_SENT, title: 't', message: 'm', challengeId: 'ch-1' });
    });
    await act(async () => {
      result.current.addNotification({ type: NotificationType.CHALLENGE_SENT, title: 't', message: 'm', challengeId: 'ch-1' });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id.startsWith('local-')).toBe(true);
    expect(result.current.unreadCount).toBe(1);
  });

  it('drops the local duplicate once the server row arrives on refresh', async () => {
    mockGetAll.mockResolvedValue({ notifications: [], unreadCount: 0 });
    const { result } = await renderHook(() => useNotifications(), { wrapper });

    await act(async () => {
      result.current.addNotification({ type: NotificationType.CHALLENGE_SENT, title: 't', message: 'm', challengeId: 'ch-1' });
    });
    expect(result.current.notifications).toHaveLength(1);

    const serverRow: Notification = { ...serverNotification, id: 'srv-1', type: 'CHALLENGE_SENT' as Notification['type'] };
    mockGetAll.mockResolvedValue({ notifications: [serverRow], unreadCount: 1 });
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id).toBe('srv-1');
  });

  it('markAsRead updates locally and PATCHes server ids, but not local ids', async () => {
    mockGetAll.mockResolvedValue({ notifications: [serverNotification], unreadCount: 1 });
    mockMarkAsRead.mockResolvedValue({ ...serverNotification, read: true });
    const { result } = await renderHook(() => useNotifications(), { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));

    await act(async () => {
      result.current.markAsRead('n1');
    });
    expect(result.current.notifications[0].read).toBe(true);
    expect(result.current.unreadCount).toBe(0);
    expect(mockMarkAsRead).toHaveBeenCalledWith('n1');

    await act(async () => {
      result.current.addNotification({ type: NotificationType.CHALLENGE_SENT, title: 't', message: 'm', challengeId: 'ch-9' });
    });
    const localId = result.current.notifications.find((n: Notification) => n.id.startsWith('local-'))!.id;
    await act(async () => {
      result.current.markAsRead(localId);
    });

    expect(mockMarkAsRead).toHaveBeenCalledTimes(1); // no API call for local ids
  });

  it('markAllAsRead marks everything read and calls the API', async () => {
    mockGetAll.mockResolvedValue({ notifications: [serverNotification], unreadCount: 1 });
    mockMarkAllAsRead.mockResolvedValue(1);
    const { result } = await renderHook(() => useNotifications(), { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));

    await act(async () => {
      result.current.markAllAsRead();
    });

    expect(result.current.notifications.every((n: Notification) => n.read)).toBe(true);
    expect(result.current.unreadCount).toBe(0);
    expect(mockMarkAllAsRead).toHaveBeenCalledWith();
  });

  it('removeNotification deletes server rows via API and local rows without it', async () => {
    mockGetAll.mockResolvedValue({ notifications: [serverNotification], unreadCount: 1 });
    mockDelete.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useNotifications(), { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));

    await act(async () => {
      result.current.removeNotification('n1');
    });
    expect(result.current.notifications).toHaveLength(0);
    expect(mockDelete).toHaveBeenCalledWith('n1');

    await act(async () => {
      result.current.addNotification({ type: NotificationType.CHALLENGE_SENT, title: 't', message: 'm', challengeId: 'ch-9' });
    });
    const localId = (result.current.notifications[0] as Notification).id;
    await act(async () => {
      result.current.removeNotification(localId);
    });
    expect(result.current.notifications).toHaveLength(0);
    expect(mockDelete).toHaveBeenCalledTimes(1); // still only the server one
  });
});
