import { useCallback, useEffect, useState } from 'react';
import { enqueueOperation as enqueue, getQueueLength, QueuedOperation } from '@/services/offline/operationQueue';
import { syncManager, SyncStatus } from '@/services/offline/syncManager';
import { useAuth } from './useAuth';

export interface OfflineQueueState extends SyncStatus {}

export interface EnqueueParams {
  type: string;
  payload: any;
}

export function useOfflineQueue() {
  const { user } = useAuth();
  const [state, setState] = useState<OfflineQueueState>({
    isSyncing: false,
    queueLength: 0,
    lastError: null,
    lastSync: null,
  });

  const userId = user?.id;

  useEffect(() => {
    const unsubscribeStatus = syncManager.subscribe((status) => setState(status));
    syncManager.start(userId);

    return () => {
      unsubscribeStatus();
      syncManager.stop();
    };
  }, [userId]);

  useEffect(() => {
    const loadLength = async () => {
      const length = await getQueueLength(userId);
      setState((prev) => ({ ...prev, queueLength: length }));
    };
    loadLength();
  }, [userId]);

  const enqueueOperation = useCallback(
    async (operation: EnqueueParams): Promise<QueuedOperation> => {
      const op = await enqueue(operation, userId);
      const length = await getQueueLength(userId);
      setState((prev) => ({ ...prev, queueLength: length }));
      return op;
    },
    [userId],
  );

  const syncNow = useCallback(() => syncManager.sync(userId), [userId]);

  return {
    ...state,
    enqueueOperation,
    syncNow,
  };
}
