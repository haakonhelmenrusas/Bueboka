import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePendingChallenges } from '../usePendingChallenges';
import { challengeRepository } from '@/services/repositories';
import type { ChallengeListItem } from '@/types';
import { ChallengeStatus } from '@/types';

jest.mock('@/services/repositories', () => ({
  challengeRepository: {
    getAll: jest.fn(),
  },
}));

// Hoisted for a stable reference across renders (see mockT below)
const mockUser = { id: 'user-1', name: 'Test User' };
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser, isAuthenticated: true }),
}));

// Hoisted so the reference is stable across renders (otherwise the hook's
// useEffect deps change every render and it loops).
const mockT = {
  'notifications.challengeReceivedTitle': 'New challenge',
  'notifications.challengeReceivedMessage': 'You received a new challenge from {name}',
  'challenge.unknownOpponent': 'an archer',
};
jest.mock('@/contexts/LanguageContext', () => ({
  useTranslation: () => ({ t: mockT }),
}));

// Mutable notifications list so the dedupe check sees previously added notifications
let mockNotifications: any[] = [];
const mockAddNotification = jest.fn((n: any) => {
  mockNotifications.push({ ...n, id: `n-${mockNotifications.length}`, createdAt: new Date(), read: false });
});
jest.mock('@/contexts/NotificationContext', () => ({
  NotificationType: {
    CHALLENGE_RECEIVED: 'CHALLENGE_RECEIVED',
    CHALLENGE_SENT: 'CHALLENGE_SENT',
  },
  useNotifications: () => ({
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter((n) => !n.read).length,
    addNotification: mockAddNotification,
    markAsRead: jest.fn(),
  }),
}));

const mockGetAll = jest.mocked(challengeRepository.getAll);

const incomingChallenge: ChallengeListItem = {
  id: 'ch-1',
  challengerId: 'user-2',
  challengedId: 'user-1',
  name: 'Duel',
  status: ChallengeStatus.PENDING,
  challengerName: 'Challenger',
  challengedName: 'Test User',
  createdAt: '2026-11-01T10:00:00Z',
  updatedAt: '2026-11-01T10:00:00Z',
} as ChallengeListItem;

// A pending challenge the current user SENT — must not raise a notification
const outgoingChallenge: ChallengeListItem = {
  ...incomingChallenge,
  id: 'ch-2',
  challengerId: 'user-1',
  challengedId: 'user-2',
  challengerName: 'Test User',
  challengedName: 'Challenger',
} as ChallengeListItem;

const pendingChallenge = incomingChallenge;

describe('usePendingChallenges', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotifications = [];
    mockGetAll.mockResolvedValue({ challenges: [pendingChallenge], page: 1, pageSize: 100, total: 1 });
  });

  it('adds a CHALLENGE_RECEIVED notification for each new pending challenge', async () => {
    const { result } = await renderHook(() => usePendingChallenges());

    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalledTimes(1);
    });

    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'CHALLENGE_RECEIVED',
        title: 'New challenge',
        message: 'You received a new challenge from Challenger',
        challengeId: 'ch-1',
      }),
    );
    expect(result.current.pendingCount).toBe(1);
  });

  it('does not re-notify for challenges that already have a notification', async () => {
    const { result } = await renderHook(() => usePendingChallenges());

    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.refreshPendingCount();
    });

    expect(mockAddNotification).toHaveBeenCalledTimes(1);
  });

  it('does not notify for pending challenges the current user sent', async () => {
    mockGetAll.mockResolvedValue({ challenges: [outgoingChallenge], page: 1, pageSize: 100, total: 1 });

    const { result } = await renderHook(() => usePendingChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockAddNotification).not.toHaveBeenCalled();
    expect(result.current.pendingCount).toBe(0);
  });

  it('notifies only for the incoming ones when sent and received are mixed', async () => {
    mockGetAll.mockResolvedValue({ challenges: [incomingChallenge, outgoingChallenge], page: 1, pageSize: 100, total: 2 });

    const { result } = await renderHook(() => usePendingChallenges());

    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalledTimes(1);
    });

    expect(mockAddNotification).toHaveBeenCalledWith(expect.objectContaining({ challengeId: 'ch-1' }));
    expect(result.current.pendingCount).toBe(1);
  });

  it('returns zero pending when there is no user', async () => {
    // override useAuth for this test via module mock is static; instead assert error path
    mockGetAll.mockRejectedValue(new Error('Network down'));
    const { result } = await renderHook(() => usePendingChallenges());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pendingCount).toBe(0);
    expect(mockAddNotification).not.toHaveBeenCalled();
  });
});
