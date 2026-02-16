import { AppError } from '@/services/api/errors';
import { syncManager } from '@/services';

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
    // Try to execute online first
    const result = await onlineFn();
    return result;
  } catch (error) {
    // If it's a network error, enqueue for later
    if (error instanceof AppError && error.code === 'NETWORK_ERROR') {
      console.log(`Network error, enqueueing ${operation.type}`);
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
