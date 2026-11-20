import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { challengeRepository, type GetAllChallengesParams } from '@/services/repositories';
import { offlineMutation } from '@/services/offline/mutationHelper';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationType } from '@/types/Notification';
import type {
  Challenge,
  ChallengeListItem,
  ChallengeListResponse,
  ChallengeStatistics,
  CreateChallengeData,
  SubmitChallengeResultData,
} from '@/types';
import { ChallengeStatus } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';

/**
 * Parameters for fetching challenges
 */
export interface FetchChallengesParams extends GetAllChallengesParams {
  forceRefresh?: boolean;
}

/**
 * Module-level listeners so a mutation from one screen (e.g. deleting a
 * pending challenge on the detail screen) also refetches the list on every
 * other screen using useChallenge — each hook call holds its own state, so
 * refetching only the current instance would leave the list screen stale.
 */
const challengeListListeners = new Set<() => void>();

export function subscribeChallengeList(listener: () => void): () => void {
  challengeListListeners.add(listener);
  return () => {
    challengeListListeners.delete(listener);
  };
}

function emitChallengeListChanged(): void {
  challengeListListeners.forEach((listener) => listener());
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
  const { notifications, removeNotification } = useNotifications();

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
          ...(user?.id && { userId: user.id }),
        });

        setChallenges(response.challenges);
        setPagination({
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, t],
  );

  // Refetch this instance's list when another useChallenge instance mutates
  // challenges (create/update/accept/decline/cancel/delete/submit)
  const fetchChallengesRef = useRef(fetchChallenges);
  useEffect(() => {
    fetchChallengesRef.current = fetchChallenges;
  }, [fetchChallenges]);
  useEffect(() => subscribeChallengeList(() => void fetchChallengesRef.current()), []);

  // Drop the notification tied to a challenge when its status changes, so
  // the badge (unread CHALLENGE_RECEIVED) updates immediately
  const notificationsRef = useRef(notifications);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);
  const removeChallengeNotification = useCallback(
    (challengeId: string) => {
      const notification = notificationsRef.current.find(
        (n) => n.challengeId === challengeId && n.type === NotificationType.CHALLENGE_RECEIVED,
      );
      if (notification) removeNotification(notification.id);
    },
    [removeNotification],
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
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [t],
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
          { type: 'create', payload: data },
          async () => {
            return await challengeRepository.create(data);
          },
          user?.id,
        );

        // Refresh challenges list
        await fetchChallenges();
        emitChallengeListChanged();

        // No local notification for the sender — the server notifies the
        // challenged user, and the sender is notified only when they answer.
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, removeChallengeNotification, t],
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
          { type: 'update', payload: { id, data } },
          async () => {
            return await challengeRepository.update(id, data);
          },
          user?.id,
        );

        setCurrentChallenge(challenge);
        removeChallengeNotification(id);
        await fetchChallenges();
        emitChallengeListChanged();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, removeChallengeNotification, t],
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
          { type: 'accept', payload: { id } },
          async () => {
            return await challengeRepository.accept(id);
          },
          user?.id,
        );

        setCurrentChallenge(challenge);
        removeChallengeNotification(id);
        await fetchChallenges();
        emitChallengeListChanged();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, removeChallengeNotification, t],
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
          { type: 'decline', payload: { id } },
          async () => {
            return await challengeRepository.decline(id);
          },
          user?.id,
        );

        setCurrentChallenge(challenge);
        removeChallengeNotification(id);
        await fetchChallenges();
        emitChallengeListChanged();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, removeChallengeNotification, t],
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
          { type: 'cancel', payload: { id } },
          async () => {
            return await challengeRepository.cancel(id);
          },
          user?.id,
        );

        setCurrentChallenge(challenge);
        removeChallengeNotification(id);
        await fetchChallenges();
        emitChallengeListChanged();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, removeChallengeNotification, t],
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
          { type: 'submit', payload: { id, data } },
          async () => {
            return await challengeRepository.submitResult(id, data);
          },
          user?.id,
        );

        setCurrentChallenge(challenge);
        removeChallengeNotification(id);
        await fetchChallenges();
        emitChallengeListChanged();
        return challenge;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, removeChallengeNotification, t],
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
          { type: 'delete', payload: { id } },
          async () => {
            await challengeRepository.delete(id);
          },
          user?.id,
        );

        removeChallengeNotification(id);
        await fetchChallenges();
        emitChallengeListChanged();
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t['common.unknownError']));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchChallenges, removeChallengeNotification, t],
  );

  /**
   * Fetch challenge statistics for the current user
   */
  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const stats = await challengeRepository.getStatistics(user?.id || '');
      setStatistics(stats);
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(t['common.unknownError']));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

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
    [user?.id],
  );

  /**
   * Check if the current user can accept a challenge (is challenged and status is PENDING)
   */
  const canAcceptChallenge = useCallback(
    (challenge: Challenge) => {
      return challenge.challengedId === user?.id && challenge.status === ChallengeStatus.PENDING;
    },
    [user?.id],
  );

  /**
   * Check if the current user can cancel a challenge (is challenger and status is PENDING)
   */
  const canCancelChallenge = useCallback(
    (challenge: Challenge) => {
      return challenge.challengerId === user?.id && challenge.status === ChallengeStatus.PENDING;
    },
    [user?.id],
  );

  /**
   * Get localized status text for display
   */
  const getChallengeStatusText = useCallback(
    (status: ChallengeStatus): string => {
      switch (status) {
        case ChallengeStatus.PENDING:
          return t['challenge.statusPending'];
        case ChallengeStatus.ACCEPTED:
          return t['challenge.statusAccepted'];
        case ChallengeStatus.DECLINED:
          return t['challenge.statusDeclined'];
        case ChallengeStatus.COMPLETED:
          return t['challenge.statusCompleted'];
        case ChallengeStatus.CANCELLED:
          return t['challenge.statusCancelled'];
        default:
          return status;
      }
    },
    [t],
  );

  /**
   * Get the opponent's name for a challenge
   */
  const getOpponentName = useCallback(
    (challenge: ChallengeListItem) => {
      if (challenge.challengerId === user?.id) {
        return challenge.challengedName || t['challenge.opponent'];
      }
      return challenge.challengerName || t['challenge.opponent'];
    },
    [user?.id, t],
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
    [user?.id],
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
