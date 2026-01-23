import AsyncStorage from '@react-native-async-storage/async-storage';

export type OperationType = string;

export interface QueuedOperation {
  id: string;
  type: OperationType;
  payload: any;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

const QUEUE_KEY_PREFIX = 'offline_queue';
const MAX_QUEUE_LENGTH = 100;
export const MAX_RETRIES = 5;

function storageKey(userId?: string) {
  return `${QUEUE_KEY_PREFIX}:${userId || 'anonymous'}`;
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function getQueue(userId?: string): Promise<QueuedOperation[]> {
  const raw = await AsyncStorage.getItem(storageKey(userId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as QueuedOperation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse offline queue, clearing', error);
    await AsyncStorage.removeItem(storageKey(userId));
    return [];
  }
}

async function saveQueue(queue: QueuedOperation[], userId?: string) {
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(queue));
}

export async function getQueueLength(userId?: string) {
  const queue = await getQueue(userId);
  return queue.length;
}

export interface EnqueueOperationInput {
  type: OperationType;
  payload: any;
}

export async function enqueueOperation(input: EnqueueOperationInput, userId?: string): Promise<QueuedOperation> {
  const queue = await getQueue(userId);

  if (queue.length >= MAX_QUEUE_LENGTH) {
    queue.shift();
  }

  const operation: QueuedOperation = {
    id: generateId(),
    type: input.type,
    payload: input.payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };

  queue.push(operation);
  await saveQueue(queue, userId);
  return operation;
}

export async function peekOperation(userId?: string) {
  const queue = await getQueue(userId);
  return queue[0];
}

export async function removeOperation(operationId: string, userId?: string) {
  const queue = await getQueue(userId);
  const filtered = queue.filter((op) => op.id !== operationId);
  await saveQueue(filtered, userId);
}

export async function updateOperation(updated: QueuedOperation, userId?: string) {
  const queue = await getQueue(userId);
  const nextQueue = queue.map((op) => (op.id === updated.id ? updated : op));
  await saveQueue(nextQueue, userId);
}

export async function clearQueue(userId?: string) {
  await AsyncStorage.removeItem(storageKey(userId));
}

export async function loadQueue(userId?: string) {
  return getQueue(userId);
}
