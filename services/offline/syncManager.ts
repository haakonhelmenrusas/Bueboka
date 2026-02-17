import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import * as Sentry from '@sentry/react-native';
import {
  enqueueOperation,
  getQueueLength,
  loadQueue,
  MAX_RETRIES,
  peekOperation,
  QueuedOperation,
  removeOperation,
  updateOperation,
} from '@/services';

export type OperationHandler = (operation: QueuedOperation) => Promise<void>;

export interface SyncStatus {
  isSyncing: boolean;
  queueLength: number;
  lastError: string | null;
  lastSync: string | null;
}

type Listener = (status: SyncStatus) => void;

const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 15000;

class SyncManager {
  private handlers = new Map<string, OperationHandler>();
  private listeners = new Set<Listener>();
  private status: SyncStatus = {
    isSyncing: false,
    queueLength: 0,
    lastError: null,
    lastSync: null,
  };
  private netInfoUnsubscribe: (() => void) | null = null;
  private appStateUnsubscribe: (() => void) | null = null;
  private currentUserId: string | undefined;

  registerHandler(type: string, handler: OperationHandler) {
    this.handlers.set(type, handler);
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.status));
  }

  private setStatus(next: Partial<SyncStatus>) {
    this.status = { ...this.status, ...next };
    this.notify();
  }

  async start(userId?: string) {
    this.currentUserId = userId;
    const queueLength = await getQueueLength(userId);
    this.setStatus({ queueLength });

    this.netInfoUnsubscribe?.();
    this.netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        this.sync(userId);
      }
    });

    this.appStateUnsubscribe?.();
    this.appStateUnsubscribe = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        this.sync(userId);
      }
    }).remove;

    const netInfoState = await NetInfo.fetch();
    if (netInfoState.isConnected && netInfoState.isInternetReachable !== false) {
      this.sync(userId);
    }
  }

  stop() {
    this.netInfoUnsubscribe?.();
    this.netInfoUnsubscribe = null;
    this.appStateUnsubscribe?.();
    this.appStateUnsubscribe = null;
  }

  async sync(userId = this.currentUserId) {
    if (this.status.isSyncing) return;

    this.setStatus({ isSyncing: true });

    try {
      const initialQueue = await loadQueue(userId);
      this.setStatus({ queueLength: initialQueue.length });

      while (true) {
        const next = await peekOperation(userId);
        if (!next) break;

        const handler = this.handlers.get(next.type);

        if (!handler) {
          Sentry.captureMessage(`No handler registered for operation type: ${next.type}`, {
            level: 'warning',
            tags: { type: 'sync_missing_handler' },
            extra: { operationType: next.type, operationId: next.id },
          });
          await removeOperation(next.id, userId);
          const remaining = await getQueueLength(userId);
          this.setStatus({ queueLength: remaining });
          continue;
        }

        try {
          await handler(next);
          await removeOperation(next.id, userId);
          const remaining = await getQueueLength(userId);
          this.setStatus({ queueLength: remaining, lastError: null });
        } catch (error: any) {
          const attempts = next.attempts + 1;
          const errorMessage = error?.message || 'Unknown error';
          const updated: QueuedOperation = {
            ...next,
            attempts,
            lastError: errorMessage,
          };

          if (attempts >= MAX_RETRIES) {
            Sentry.captureMessage(`Dropping operation after max retries`, {
              level: 'warning',
              tags: { type: 'sync_max_retries' },
              extra: {
                operationType: next.type,
                operationId: next.id,
                attempts,
                error: errorMessage,
              },
            });
            await removeOperation(next.id, userId);
          } else {
            await updateOperation(updated, userId);
            const delayMs = Math.min(BASE_BACKOFF_MS * 2 ** (attempts - 1), MAX_BACKOFF_MS);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }

          const remaining = await getQueueLength(userId);
          this.setStatus({ queueLength: remaining, lastError: errorMessage });
        }
      }

      this.setStatus({ lastSync: new Date().toISOString() });
    } finally {
      this.setStatus({ isSyncing: false });
    }
  }

  async enqueue(input: { type: string; payload: any }, userId?: string) {
    const operation = await enqueueOperation(input, userId);
    const queueLength = await getQueueLength(userId);
    this.setStatus({ queueLength });
    return operation;
  }
}

export const syncManager = new SyncManager();
