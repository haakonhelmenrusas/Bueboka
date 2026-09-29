import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { challengeRepository, type GetAllChallengesParams } from '@/services/repositories';
import { offlineMutation } from '@/services/offline/mutationHelper';
import type {
  Challenge,
  ChallengeListItem,
  ChallengeListResponse,
  ChallengeStatistics,
  CreateChallengeData,
  SubmitChallengeResultData,
} from '@/types';
import { ChallengeStatus } from '@/types';
import { useTranslation } from '@/lib/i18n';

/**
 * Parameters for fetching challenges
 */
export interface FetchChallengesParams extends GetAllChallengesParams {
  forceRefresh?: boolean;
}

/**
 * Custom hook for managing challenge state and operations
 *
 * Provides:
 * - Challenge listing with pagination
 * - Individual challenge operations (create, read, update, delete)
 * - Challenge actions (accept, decline, cancel, submit)
 * - Challenge statistics
 * - Helper functions for UI logic
 *
 * @example
 * ```typescript
 * const {
 *   challenges,
 *   loading,
 *   error,
 *   fetchChallenges,
 *   createChallenge,
 *   acceptChallenge,
 * } = useChallenge();
 *
 * useEffect(() => {
 *   fetchChallenges();
 * }, []);
 *
 * const handleAccept = async (challengeId: string) => {
 *   await acceptChallenge(challengeId);
 * };
 * ```
 */
export function useChallenge() {
  const { user } = useAuth();
  const { t } = useTranslation();

  // State
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [statistics, setStatistics] = useState<ChallengeStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
    total: number;
  }>({ page: 1, pageSize: 20, total: 0 });

  /**
   * Fetch challenges with optional pagination and filtering
   */
  const fetchChallenges = useCallback(
    async (params?: FetchChallengesParams) => {
      try {
        setLoading(true);
        setError(null);

        const page = params?.page ?? pagination.page;
        const pageSize = params?.pageSize ?? pagination.pageSize;
        const status = params?.status;

        const response = await challengeRepository.getAll({
          page,
          pageSize,
          status,
        });

        setChallenges(response.challenges);
        setPagination({
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, t]
  );

  /**
   * Fetch a specific challenge by ID
   */
  const fetchChallengeById = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const challenge = await challengeRepository.getById(id);
        setCurrentChallenge(challenge);
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  /**
   * Create a new challenge
   */
  const createChallenge = useCallback(
    async (data: CreateChallengeData) => {
      try {
        setLoading(true);
        setError(null);

        const challenge = await offlineMutation(
          async () => {
            return await challengeRepository.create(data);
          },
          `challenge-create-${Date.now()}`
        );

        // Refresh challenges list
        await fetchChallenges();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, t]
  );

  /**
   * Update a challenge
   */
  const updateChallenge = useCallback(
    async (id: string, data: Partial<CreateChallengeData>) => {
      try {
        setLoading(true);
        setError(null);

        const challenge = await offlineMutation(
          async () => {
            return await challengeRepository.update(id, data);
          },
          `challenge-update-${id}`
        );

        setCurrentChallenge(challenge);
        await fetchChallenges();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, t]
  );

  /**
   * Accept a challenge (challenged user only)
   */
  const acceptChallenge = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const challenge = await offlineMutation(
          async () => {
            return await challengeRepository.accept(id);
          },
          `challenge-accept-${id}`
        );

        setCurrentChallenge(challenge);
        await fetchChallenges();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, t]
  );

  /**
   * Decline a challenge (challenged user only)
   */
  const declineChallenge = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const challenge = await offlineMutation(
          async () => {
            return await challengeRepository.decline(id);
          },
          `challenge-decline-${id}`
        );

        setCurrentChallenge(challenge);
        await fetchChallenges();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, t]
  );

  /**
   * Cancel a challenge (challenger only, before accepted)
   */
  const cancelChallenge = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const challenge = await offlineMutation(
          async () => {
            return await challengeRepository.cancel(id);
          },
          `challenge-cancel-${id}`
        );

        setCurrentChallenge(challenge);
        await fetchChallenges();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, t]
  );

  /**
   * Submit results for a challenge
   */
  const submitChallengeResult = useCallback(
    async (id: string, data: SubmitChallengeResultData) => {
      try {
        setLoading(true);
        setError(null);

        const challenge = await offlineMutation(
          async () => {
            return await challengeRepository.submitResult(id, data);
          },
          `challenge-submit-${id}`
        );

        setCurrentChallenge(challenge);
        await fetchChallenges();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, t]
  );

  /**
   * Delete a challenge (challenger only, before accepted)
   */
  const deleteChallenge = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        await offlineMutation(
          async () => {
            await challengeRepository.delete(id);
          },
          `challenge-delete-${id}`
        );

        await fetchChallenges();
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, t]
  );

  /**
   * Fetch challenge statistics for the current user
   */
  const fetchStatistics = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const stats = await challengeRepository.getStatistics(user?.id || '');
        setStatistics(stats);
        return stats;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t('common.unknownError')));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, t]
  );

  /**
   * Clear the error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if the current user is the owner (challenger) of a challenge
   */
  const isChallengeOwner = useCallback(
    (challenge: Challenge) => {
      return challenge.challengerId === user?.id;
    },
    [user?.id]
  );

  /**
   * Check if the current user can accept a challenge (is challenged and status is PENDING)
   */
  const canAcceptChallenge = useCallback(
    (challenge: Challenge) => {
      return challenge.challengedId === user?.id && challenge.status === ChallengeStatus.PENDING;
    },
    [user?.id]
  );

  /**
   * Check if the current user can cancel a challenge (is challenger and status is PENDING)
   */
  const canCancelChallenge = useCallback(
    (challenge: Challenge) => {
      return challenge.challengerId === user?.id && challenge.status === ChallengeStatus.PENDING;
    },
    [user?.id]
  );

  /**
   * Get localized status text for display
   */
  const getChallengeStatusText = useCallback(
    (status: ChallengeStatus): string => {
      switch (status) {
        case ChallengeStatus.PENDING:
          return t('challengeStatus.PENDING');
        case ChallengeStatus.ACCEPTED:
          return t('challengeStatus.ACCEPTED');
        case ChallengeStatus.DECLINED:
          return t('challengeStatus.DECLINED');
        case ChallengeStatus.COMPLETED:
          return t('challengeStatus.COMPLETED');
        case ChallengeStatus.CANCELLED:
          return t('challengeStatus.CANCELLED');
        default:
          return status;
      }
    },
    [t]
  );

  /**
   * Get the opponent's name for a challenge
   */
  const getOpponentName = useCallback(
    (challenge: ChallengeListItem) => {
      if (challenge.challengerId === user?.id) {
        return challenge.challengedName || t('common.opponent');
      }
      return challenge.challengerName || t('common.opponent');
    },
    [user?.id, t]
  );

  /**
   * Check if a challenge can be submitted to (ACCEPTED and user hasn't submitted yet)
   */
  const canSubmitResult = useCallback(
    (challenge: Challenge) => {
      if (challenge.status !== ChallengeStatus.ACCEPTED) {
        return false;
      }

      if (challenge.challengerId === user?.id) {
        return !challenge.challengerSubmittedAt;
      }

      if (challenge.challengedId === user?.id) {
        return !challenge.challengedSubmittedAt;
      }

      return false;
    },
    [user?.id]
  );

  return {
    // State
    challenges,
    currentChallenge,
    statistics,
    loading,
    error,
    pagination,

    // Actions
    fetchChallenges,
    fetchChallengeById,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    acceptChallenge,
    declineChallenge,
    cancelChallenge,
    submitChallengeResult,
    fetchStatistics,

    // State setters
    setChallenges,
    setCurrentChallenge,
    setStatistics,
    setLoading,
    setError,
    resetError,

    // Helper functions
    isChallengeOwner,
    canAcceptChallenge,
    canCancelChallenge,
    getChallengeStatusText,
    getOpponentName,
    canSubmitResult,
  };
}
