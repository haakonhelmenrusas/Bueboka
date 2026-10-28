import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { challengeRepository } from '@/services/repositories';
import { ChallengeStatus } from '@/types';
import { useNotifications } from '@/contexts';
import { NotificationType } from '@/contexts/NotificationContext';

/**
 * Hook to track and manage pending challenges for the current user
 * Automatically adds notifications when pending challenges are detected
 */
export function usePendingChallenges() {
  const { user } = useAuth();
  const { addNotification, notifications, markAsRead } = useNotifications();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Fetch pending challenges for the current user
   */
  const fetchPendingChallenges = useCallback(async () => {
    if (!user) {
      setPendingCount(0);
      return 0;
    }

    try {
      setLoading(true);
      const response = await challengeRepository.getAll({
        status: ChallengeStatus.PENDING,
        userId: user.id,
        pageSize: 100, // Get all pending challenges
      });

      const pendingCount = response.challenges.length;
      setPendingCount(pendingCount);

      // Add notification for each pending challenge that hasn't been notified yet
      const existingNotificationIds = notifications.filter((n) => n.type === 'CHALLENGE_RECEIVED').map((n) => n.challengeId);

      const newChallenges = response.challenges.filter((challenge) => !existingNotificationIds.includes(challenge.id));

      // Add notifications for new pending challenges
      newChallenges.forEach((challenge) => {
        addNotification({
          type: NotificationType.CHALLENGE_RECEIVED,
          title: 'Ny utfordring',
          message: `Du har mottatt en ny utfordring fra ${challenge.challengerName || 'en skytter'}`,
          challengeId: challenge.id,
        });
      });

      return pendingCount;
    } catch (err) {
      console.error('Error fetching pending challenges:', err);
      setPendingCount(0);
      return 0;
    } finally {
      setLoading(false);
    }
  }, [user, addNotification, notifications]);

  /**
   * Refresh pending challenges count
   */
  const refreshPendingCount = useCallback(async () => {
    await fetchPendingChallenges();
  }, [fetchPendingChallenges]);

  /**
   * Mark a specific challenge as read (removes its notification)
   */
  const markChallengeAsRead = useCallback(
    (challengeId: string) => {
      // Find and mark the notification for this challenge as read
      const notification = notifications.find((n) => n.challengeId === challengeId && n.type === 'CHALLENGE_RECEIVED');
      if (notification) {
        markAsRead(notification.id);
      }
      // Refresh the count
      refreshPendingCount();
    },
    [notifications, markAsRead, refreshPendingCount],
  );

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchPendingChallenges();

    // Set up periodic polling (every 30 seconds)
    const interval = setInterval(() => {
      fetchPendingChallenges();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchPendingChallenges]);

  return {
    pendingCount,
    loading,
    refreshPendingCount,
    markChallengeAsRead,
  };
}
