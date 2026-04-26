import { offlineMutation } from '@/services/offline/mutationHelper';
import { AppError } from '@/services/api/errors';
import { syncManager } from '@/services/offline/syncManager';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/services/offline/syncManager', () => ({
  syncManager: {
    enqueue: jest.fn(),
  },
}));

jest.mock('@sentry/react-native', () => ({
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
}));

const mockEnqueue = syncManager.enqueue as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── offlineMutation ───────────────────────────────────────────────────────────

describe('offlineMutation', () => {
  it('calls the online function and returns its result when the request succeeds', async () => {
    const onlineFn = jest.fn().mockResolvedValue({ id: 'bow-1' });
    const result = await offlineMutation({ type: 'bows/create', payload: { name: 'X' } }, onlineFn, 'user-1');
    expect(result).toEqual({ id: 'bow-1' });
    expect(onlineFn).toHaveBeenCalledTimes(1);
  });

  it('does not enqueue the operation when the request succeeds', async () => {
    const onlineFn = jest.fn().mockResolvedValue({});
    await offlineMutation({ type: 'bows/create', payload: {} }, onlineFn, 'user-1');
    expect(mockEnqueue).not.toHaveBeenCalled();
  });

  it('enqueues the operation when the online function throws a NETWORK_ERROR AppError', async () => {
    const networkError = new AppError('NETWORK_ERROR', 'Ingen nettverksforbindelse');
    const onlineFn = jest.fn().mockRejectedValue(networkError);

    await expect(
      offlineMutation({ type: 'bows/create', payload: { name: 'X' } }, onlineFn, 'user-1'),
    ).rejects.toBe(networkError);

    expect(mockEnqueue).toHaveBeenCalledWith({ type: 'bows/create', payload: { name: 'X' } }, 'user-1');
  });

  it('still throws the NETWORK_ERROR after enqueueing so the caller can show an offline indicator', async () => {
    const networkError = new AppError('NETWORK_ERROR', 'Ingen nettverksforbindelse');
    const onlineFn = jest.fn().mockRejectedValue(networkError);

    const caught = await offlineMutation({ type: 'bows/create', payload: {} }, onlineFn).catch((e) => e);
    expect(caught).toBe(networkError);
  });

  it('does NOT enqueue the operation for non-network AppErrors', async () => {
    const serverError = new AppError('SERVER_ERROR', 'Intern serverfeil');
    const onlineFn = jest.fn().mockRejectedValue(serverError);

    await expect(
      offlineMutation({ type: 'bows/create', payload: {} }, onlineFn, 'user-1'),
    ).rejects.toBe(serverError);

    expect(mockEnqueue).not.toHaveBeenCalled();
  });

  it('does NOT enqueue the operation for plain (non-AppError) errors', async () => {
    const rawError = new Error('Something went wrong');
    const onlineFn = jest.fn().mockRejectedValue(rawError);

    await expect(
      offlineMutation({ type: 'bows/create', payload: {} }, onlineFn, 'user-1'),
    ).rejects.toBe(rawError);

    expect(mockEnqueue).not.toHaveBeenCalled();
  });

  it('passes the correct userId to syncManager.enqueue', async () => {
    const networkError = new AppError('NETWORK_ERROR', 'Feil');
    const onlineFn = jest.fn().mockRejectedValue(networkError);

    await offlineMutation({ type: 'practices/create', payload: {} }, onlineFn, 'user-42').catch(() => {});

    expect(mockEnqueue).toHaveBeenCalledWith(expect.any(Object), 'user-42');
  });

  it('works without a userId (passes undefined to enqueue)', async () => {
    const networkError = new AppError('NETWORK_ERROR', 'Feil');
    const onlineFn = jest.fn().mockRejectedValue(networkError);

    await offlineMutation({ type: 'bows/create', payload: {} }, onlineFn).catch(() => {});

    expect(mockEnqueue).toHaveBeenCalledWith(expect.any(Object), undefined);
  });
});

