import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useChallenge } from '../useChallenge';
import { challengeRepository } from '@/services/repositories';
import type { Challenge, ChallengeListItem, ChallengeStatistics } from '@/types';
import { ChallengeStatus } from '@/types';

// Mock the challenge repository
jest.mock('@/services/repositories', () => ({
  challengeRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    accept: jest.fn(),
    decline: jest.fn(),
    cancel: jest.fn(),
    submitResult: jest.fn(),
    getStatistics: jest.fn(),
  },
}));

// Mock the auth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-1', name: 'Test User' },
    isAuthenticated: true,
  }),
}));

// Mock i18n hook
jest.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock offlineMutation
jest.mock('@/services/offline/mutationHelper', () => ({
  offlineMutation: jest.fn((fn: any) => fn()),
}));

const mockChallenge: Challenge = {
  id: 'challenge-1',
  challengerId: 'user-1',
  challengedId: 'user-2',
  name: 'Test Challenge',
  description: 'A test challenge',
  status: ChallengeStatus.PENDING,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockChallengeListItem: ChallengeListItem = {
  id: 'challenge-1',
  challengerId: 'user-1',
  challengedId: 'user-2',
  name: 'Test Challenge',
  status: ChallengeStatus.PENDING,
  challengerName: 'Test User',
  challengedName: 'Other User',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockStatistics: ChallengeStatistics = {
  totalChallenges: 10,
  wins: 7,
  losses: 2,
  winRate: 0.77,
  pendingChallenges: 1,
  completedChallenges: 9,
};

const mockChallengeRepository = challengeRepository as jest.Mocked<typeof challengeRepository>;

describe('useChallenge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchChallenges', () => {
    it('fetches challenges with default params', async () => {
      mockChallengeRepository.getAll.mockResolvedValue({
        challenges: [mockChallengeListItem],
        page: 1,
        pageSize: 20,
        total: 1,
      });

      const { result } = renderHook(() => useChallenge());

      // Need to explicitly call fetchChallenges
      act(() => {
        result.current.fetchChallenges();
      });

      await waitFor(() => {
        expect(result.current.challenges).toEqual([mockChallengeListItem]);
        expect(result.current.pagination).toEqual({
          page: 1,
          pageSize: 20,
          total: 1,
        });
      });

      // The hook uses default values from state, which are { page: 1, pageSize: 20, total: 0 }
      // So it should call with no params (undefined) or use defaults
      expect(mockChallengeRepository.getAll).toHaveBeenCalledWith({
        page: 1,
        pageSize: 20,
      });
    });

    it('fetches challenges with custom params', async () => {
      mockChallengeRepository.getAll.mockResolvedValue({
        challenges: [mockChallengeListItem],
        page: 2,
        pageSize: 50,
        total: 1,
      });

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.fetchChallenges({ page: 2, pageSize: 50, status: ChallengeStatus.PENDING });
      });

      await waitFor(() => {
        expect(result.current.challenges).toEqual([mockChallengeListItem]);
        expect(result.current.pagination).toEqual({
          page: 2,
          pageSize: 50,
          total: 1,
        });
      });

      expect(mockChallengeRepository.getAll).toHaveBeenCalledWith({
        page: 2,
        pageSize: 50,
        status: ChallengeStatus.PENDING,
      });
    });

    it('handles fetch error gracefully', async () => {
      mockChallengeRepository.getAll.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.fetchChallenges();
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });

    it('sets loading state correctly', async () => {
      mockChallengeRepository.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ challenges: [], page: 1, pageSize: 20, total: 0 }), 100))
      );

      const { result } = renderHook(() => useChallenge());

      expect(result.current.loading).toBe(false);

      act(() => {
        result.current.fetchChallenges();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('fetchChallengeById', () => {
    it('fetches a specific challenge by ID', async () => {
      mockChallengeRepository.getById.mockResolvedValue(mockChallenge);

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.fetchChallengeById('challenge-1');
      });

      await waitFor(() => {
        expect(result.current.currentChallenge).toEqual(mockChallenge);
      });

      expect(mockChallengeRepository.getById).toHaveBeenCalledWith('challenge-1');
    });

    it('handles not found error', async () => {
      mockChallengeRepository.getById.mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useChallenge());

      let error: Error | undefined;
      act(() => {
        result.current.fetchChallengeById('non-existent').catch((e) => { error = e; });
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(error).toBeDefined();
      });
    });
  });

  describe('createChallenge', () => {
    it('creates a new challenge and refreshes list', async () => {
      mockChallengeRepository.create.mockResolvedValue(mockChallenge);
      mockChallengeRepository.getAll.mockResolvedValue({
        challenges: [mockChallengeListItem],
        page: 1,
        pageSize: 20,
        total: 1,
      });

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.createChallenge({
          challengedId: 'user-2',
          name: 'New Challenge',
        });
      });

      await waitFor(() => {
        expect(mockChallengeRepository.create).toHaveBeenCalledWith({
          challengedId: 'user-2',
          name: 'New Challenge',
        });
        // After creating, fetchChallenges is called, so we should have the mocked list
        expect(result.current.challenges).toEqual([mockChallengeListItem]);
      });
    });

    it('handles create error', async () => {
      mockChallengeRepository.create.mockRejectedValue(new Error('Validation error'));

      const { result } = renderHook(() => useChallenge());

      let error: Error | undefined;
      act(() => {
        result.current.createChallenge({
          challengedId: 'user-2',
          name: 'New Challenge',
        }).catch((e) => { error = e; });
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        // Error is set in the hook's state
        expect(error).toBeDefined();
      });
    });
  });

  describe('acceptChallenge', () => {
    it('accepts a challenge', async () => {
      const acceptedChallenge = { ...mockChallenge, status: ChallengeStatus.ACCEPTED };
      mockChallengeRepository.accept.mockResolvedValue(acceptedChallenge);

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.acceptChallenge('challenge-1');
      });

      await waitFor(() => {
        expect(result.current.currentChallenge?.status).toBe(ChallengeStatus.ACCEPTED);
      });

      expect(mockChallengeRepository.accept).toHaveBeenCalledWith('challenge-1');
    });
  });

  describe('declineChallenge', () => {
    it('declines a challenge', async () => {
      const declinedChallenge = { ...mockChallenge, status: ChallengeStatus.DECLINED };
      mockChallengeRepository.decline.mockResolvedValue(declinedChallenge);

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.declineChallenge('challenge-1');
      });

      await waitFor(() => {
        expect(result.current.currentChallenge?.status).toBe(ChallengeStatus.DECLINED);
      });

      expect(mockChallengeRepository.decline).toHaveBeenCalledWith('challenge-1');
    });
  });

  describe('cancelChallenge', () => {
    it('cancels a challenge', async () => {
      const cancelledChallenge = { ...mockChallenge, status: ChallengeStatus.CANCELLED };
      mockChallengeRepository.cancel.mockResolvedValue(cancelledChallenge);

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.cancelChallenge('challenge-1');
      });

      await waitFor(() => {
        expect(result.current.currentChallenge?.status).toBe(ChallengeStatus.CANCELLED);
      });

      expect(mockChallengeRepository.cancel).toHaveBeenCalledWith('challenge-1');
    });
  });

  describe('submitChallengeResult', () => {
    it('submits challenge result', async () => {
      const updatedChallenge = {
        ...mockChallenge,
        challengerScore: 280,
        challengerTotalArrows: 30,
        challengerSubmittedAt: '2024-01-02T00:00:00Z',
      };
      mockChallengeRepository.submitResult.mockResolvedValue(updatedChallenge);

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.submitChallengeResult('challenge-1', {
          score: 280,
          totalArrows: 30,
        });
      });

      await waitFor(() => {
        expect(result.current.currentChallenge?.challengerScore).toBe(280);
      });

      expect(mockChallengeRepository.submitResult).toHaveBeenCalledWith('challenge-1', {
        score: 280,
        totalArrows: 30,
      });
    });
  });

  describe('deleteChallenge', () => {
    it('deletes a challenge', async () => {
      mockChallengeRepository.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.deleteChallenge('challenge-1');
      });

      await waitFor(() => {
        expect(mockChallengeRepository.delete).toHaveBeenCalledWith('challenge-1');
      });
    });
  });

  describe('fetchStatistics', () => {
    it('fetches challenge statistics', async () => {
      mockChallengeRepository.getStatistics.mockResolvedValue(mockStatistics);

      const { result } = renderHook(() => useChallenge());

      act(() => {
        result.current.fetchStatistics();
      });

      await waitFor(() => {
        expect(result.current.statistics).toEqual(mockStatistics);
      });

      expect(mockChallengeRepository.getStatistics).toHaveBeenCalled();
    });
  });

  describe('resetError', () => {
    it('clears the error state', () => {
      const { result } = renderHook(() => useChallenge());

      // Set error
      act(() => {
        result.current.setError(new Error('Test error'));
      });

      expect(result.current.error).toBeDefined();

      // Clear error
      act(() => {
        result.current.resetError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('isChallengeOwner', () => {
    it('returns true if user is the challenger', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.isChallengeOwner({ ...mockChallenge, challengerId: 'user-1' })).toBe(true);
    });

    it('returns false if user is the challenged', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.isChallengeOwner({ ...mockChallenge, challengerId: 'user-2' })).toBe(false);
    });
  });

  describe('canAcceptChallenge', () => {
    it('returns true if user is challenged and status is PENDING', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.canAcceptChallenge({ ...mockChallenge, challengedId: 'user-1' })).toBe(true);
    });

    it('returns false if status is not PENDING', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.canAcceptChallenge({ ...mockChallenge, status: ChallengeStatus.ACCEPTED })).toBe(false);
    });

    it('returns false if user is not the challenged', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.canAcceptChallenge({ ...mockChallenge, challengedId: 'user-2' })).toBe(false);
    });
  });

  describe('canCancelChallenge', () => {
    it('returns true if user is challenger and status is PENDING', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.canCancelChallenge(mockChallenge)).toBe(true);
    });

    it('returns false if status is not PENDING', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.canCancelChallenge({ ...mockChallenge, status: ChallengeStatus.ACCEPTED })).toBe(false);
    });

    it('returns false if user is not the challenger', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.canCancelChallenge({ ...mockChallenge, challengerId: 'user-2' })).toBe(false);
    });
  });

  describe('getChallengeStatusText', () => {
    it('returns correct status text for PENDING', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.getChallengeStatusText(ChallengeStatus.PENDING)).toBe('challengeStatus.PENDING');
    });

    it('returns correct status text for ACCEPTED', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.getChallengeStatusText(ChallengeStatus.ACCEPTED)).toBe('challengeStatus.ACCEPTED');
    });

    it('returns correct status text for DECLINED', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.getChallengeStatusText(ChallengeStatus.DECLINED)).toBe('challengeStatus.DECLINED');
    });

    it('returns correct status text for COMPLETED', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.getChallengeStatusText(ChallengeStatus.COMPLETED)).toBe('challengeStatus.COMPLETED');
    });

    it('returns correct status text for CANCELLED', () => {
      const { result } = renderHook(() => useChallenge());

      expect(result.current.getChallengeStatusText(ChallengeStatus.CANCELLED)).toBe('challengeStatus.CANCELLED');
    });
  });
});
