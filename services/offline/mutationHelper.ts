import { AppError } from '@/services/api/errors';
import { syncManager } from '@/services';
import * as Sentry from '@sentry/react-native';

/**
 * Mutation helper that enqueues operations when offline or on network failure
 */
export async function offlineMutation<T>(
  operation: {
    type: string;
    payload: any;
  },
  onlineFn: () => Promise<T>,
  userId?: string,
): Promise<T> {
  try {
    return await onlineFn();
  } catch (error) {
    // If it's a network error, enqueue for later
    if (error instanceof AppError && error.code === 'NETWORK_ERROR') {
      Sentry.addBreadcrumb({
        category: 'offline',
        message: `Network error, enqueueing operation: ${operation.type}`,
        level: 'info',
        data: { operationType: operation.type },
      });
      await syncManager.enqueue(operation, userId);
      throw error;
    }
    // For other errors, just throw
    throw error;
  }
}

/**
 * Check if currently offline
 */
export async function isOffline(): Promise<boolean> {
  const NetInfo = await import('@react-native-community/netinfo');
  const state = await NetInfo.default.fetch();
  return !state.isConnected || state.isInternetReachable === false;
}
