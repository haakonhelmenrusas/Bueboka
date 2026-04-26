import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearQueue,
  enqueueOperation,
  getQueueLength,
  loadQueue,
  MAX_RETRIES,
  peekOperation,
  removeOperation,
  updateOperation,
} from '@/services/offline/operationQueue';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

const mockStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

beforeEach(() => {
  jest.clearAllMocks();
  // Default: empty queue
  mockStorage.getItem.mockResolvedValue(null);
  mockStorage.setItem.mockResolvedValue(undefined);
  mockStorage.removeItem.mockResolvedValue(undefined);
});

// ── MAX_RETRIES ───────────────────────────────────────────────────────────────

describe('MAX_RETRIES constant', () => {
  it('is set to 5', () => {
    expect(MAX_RETRIES).toBe(5);
  });
});

// ── enqueueOperation ──────────────────────────────────────────────────────────

describe('enqueueOperation', () => {
  it('adds an operation to an empty queue and persists it', async () => {
    const op = await enqueueOperation({ type: 'bows/create', payload: { name: 'Test' } }, 'user-1');

    expect(op.type).toBe('bows/create');
    expect(op.payload).toEqual({ name: 'Test' });
    expect(op.attempts).toBe(0);
    expect(op.id).toBeTruthy();
    expect(mockStorage.setItem).toHaveBeenCalledWith('offline_queue:user-1', expect.stringContaining('bows/create'));
  });

  it('assigns each operation a unique id', async () => {
    const op1 = await enqueueOperation({ type: 'bows/create', payload: {} }, 'user-1');
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify([op1]));
    const op2 = await enqueueOperation({ type: 'bows/create', payload: {} }, 'user-1');
    expect(op1.id).not.toBe(op2.id);
  });

  it('appends to an existing queue', async () => {
    const existing = [{ id: 'old-1', type: 'bows/delete', payload: {}, createdAt: '', attempts: 0 }];
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(existing));

    await enqueueOperation({ type: 'bows/create', payload: {} }, 'user-1');

    const saved = JSON.parse(mockStorage.setItem.mock.calls[0][1] as string);
    expect(saved).toHaveLength(2);
  });

  it('uses "anonymous" key when no userId is provided', async () => {
    await enqueueOperation({ type: 'bows/create', payload: {} });
    expect(mockStorage.setItem).toHaveBeenCalledWith('offline_queue:anonymous', expect.any(String));
  });

  it('drops the oldest operation when the queue is at capacity (100)', async () => {
    const full = Array.from({ length: 100 }, (_, i) => ({
      id: `op-${i}`,
      type: 'bows/create',
      payload: { name: `Op ${i}` },
      createdAt: '',
      attempts: 0,
    }));
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(full));

    const newOp = await enqueueOperation({ type: 'bows/create', payload: { name: 'New' } }, 'user-1');

    const saved = JSON.parse(mockStorage.setItem.mock.calls[0][1] as string);
    expect(saved).toHaveLength(100);
    expect(saved[saved.length - 1].id).toBe(newOp.id);
    // First entry was shifted out
    expect(saved.find((op: any) => op.id === 'op-0')).toBeUndefined();
  });
});

// ── getQueueLength ────────────────────────────────────────────────────────────

describe('getQueueLength', () => {
  it('returns 0 when the queue is empty', async () => {
    expect(await getQueueLength('user-1')).toBe(0);
  });

  it('returns the number of queued operations', async () => {
    const ops = [
      { id: '1', type: 'a', payload: {}, createdAt: '', attempts: 0 },
      { id: '2', type: 'b', payload: {}, createdAt: '', attempts: 0 },
    ];
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(ops));
    expect(await getQueueLength('user-1')).toBe(2);
  });
});

// ── peekOperation ─────────────────────────────────────────────────────────────

describe('peekOperation', () => {
  it('returns the first operation without removing it', async () => {
    const ops = [
      { id: 'first', type: 'bows/create', payload: {}, createdAt: '', attempts: 0 },
      { id: 'second', type: 'bows/delete', payload: {}, createdAt: '', attempts: 0 },
    ];
    mockStorage.getItem.mockResolvedValue(JSON.stringify(ops));

    const result = await peekOperation('user-1');
    expect(result?.id).toBe('first');
  });

  it('returns undefined when the queue is empty', async () => {
    const result = await peekOperation('user-1');
    expect(result).toBeUndefined();
  });
});

// ── removeOperation ───────────────────────────────────────────────────────────

describe('removeOperation', () => {
  it('removes the operation with the matching id from the queue', async () => {
    const ops = [
      { id: 'op-1', type: 'bows/create', payload: {}, createdAt: '', attempts: 0 },
      { id: 'op-2', type: 'bows/delete', payload: {}, createdAt: '', attempts: 0 },
    ];
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(ops));

    await removeOperation('op-1', 'user-1');

    const saved = JSON.parse(mockStorage.setItem.mock.calls[0][1] as string);
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe('op-2');
  });

  it('does not mutate the queue when id is not found', async () => {
    const ops = [{ id: 'op-1', type: 'bows/create', payload: {}, createdAt: '', attempts: 0 }];
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(ops));

    await removeOperation('ghost', 'user-1');

    const saved = JSON.parse(mockStorage.setItem.mock.calls[0][1] as string);
    expect(saved).toHaveLength(1);
  });
});

// ── updateOperation ───────────────────────────────────────────────────────────

describe('updateOperation', () => {
  it('replaces the matching operation with the updated version', async () => {
    const ops = [{ id: 'op-1', type: 'bows/create', payload: {}, createdAt: '', attempts: 0 }];
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(ops));

    await updateOperation({ id: 'op-1', type: 'bows/create', payload: {}, createdAt: '', attempts: 2, lastError: 'Failed' }, 'user-1');

    const saved = JSON.parse(mockStorage.setItem.mock.calls[0][1] as string);
    expect(saved[0].attempts).toBe(2);
    expect(saved[0].lastError).toBe('Failed');
  });
});

// ── clearQueue ────────────────────────────────────────────────────────────────

describe('clearQueue', () => {
  it('removes the queue from storage for the given user', async () => {
    await clearQueue('user-1');
    expect(mockStorage.removeItem).toHaveBeenCalledWith('offline_queue:user-1');
  });

  it('clears the anonymous queue when no userId is provided', async () => {
    await clearQueue();
    expect(mockStorage.removeItem).toHaveBeenCalledWith('offline_queue:anonymous');
  });
});

// ── loadQueue ─────────────────────────────────────────────────────────────────

describe('loadQueue', () => {
  it('returns all queued operations', async () => {
    const ops = [{ id: 'op-1', type: 'bows/create', payload: {}, createdAt: '', attempts: 0 }];
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(ops));
    const result = await loadQueue('user-1');
    expect(result).toEqual(ops);
  });

  it('returns an empty array when the queue is empty', async () => {
    expect(await loadQueue('user-1')).toEqual([]);
  });

  it('returns an empty array and clears storage when stored data is malformed JSON', async () => {
    mockStorage.getItem.mockResolvedValueOnce('NOT_VALID_JSON{{{');
    const result = await loadQueue('user-1');
    expect(result).toEqual([]);
    expect(mockStorage.removeItem).toHaveBeenCalledWith('offline_queue:user-1');
  });

  it('returns an empty array when stored data is not an array', async () => {
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify({ invalid: true }));
    const result = await loadQueue('user-1');
    expect(result).toEqual([]);
  });
});
