import { notificationsApi } from '../notificationsApi';
import { authFetchClient } from '../authFetch';

jest.mock('../authFetch', () => ({
  authFetchClient: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

jest.mock('../errors', () => ({
  handleApiError: (error: unknown) => error,
}));

const mockGet = authFetchClient.get as jest.Mock;
const mockPost = authFetchClient.post as jest.Mock;
const mockPatch = authFetchClient.patch as jest.Mock;
const mockDelete = authFetchClient.delete as jest.Mock;

const serverNotification = {
  id: 'n1',
  type: 'CHALLENGE_RECEIVED',
  title: 'Ny utfordring',
  message: 'Du har mottatt en ny utfordring fra Ola',
  challengeId: 'ch-1',
  read: false,
  createdAt: '2026-11-03T10:00:00.000Z',
};

describe('notificationsApi.getAll', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GETs /notifications and returns notifications + unreadCount', async () => {
    mockGet.mockResolvedValueOnce({ data: { notifications: [serverNotification], unreadCount: 1 } });

    const result = await notificationsApi.getAll();

    expect(mockGet).toHaveBeenCalledWith('/notifications');
    expect(result.notifications).toHaveLength(1);
    expect(result.unreadCount).toBe(1);
    expect(result.notifications[0]).toMatchObject({ id: 'n1', challengeId: 'ch-1' });
  });

  it('passes unreadOnly=true when asked', async () => {
    mockGet.mockResolvedValueOnce({ data: { notifications: [], unreadCount: 2 } });

    const result = await notificationsApi.getAll(true);

    expect(mockGet).toHaveBeenCalledWith('/notifications?unreadOnly=true');
    expect(result.unreadCount).toBe(2);
  });

  it('falls back to deriving unreadCount when the response omits it', async () => {
    mockGet.mockResolvedValueOnce({ data: { notifications: [serverNotification, { ...serverNotification, id: 'n2', read: true }] } });

    const result = await notificationsApi.getAll();
    expect(result.unreadCount).toBe(1);
  });

  it('throws the handled error on failure', async () => {
    const err = new Error('Network down');
    mockGet.mockRejectedValueOnce(err);
    await expect(notificationsApi.getAll()).rejects.toBe(err);
  });
});

describe('notificationsApi.markAsRead', () => {
  beforeEach(() => jest.clearAllMocks());

  it('PATCHes /notifications/:id with { read: true } and returns the notification', async () => {
    mockPatch.mockResolvedValueOnce({ data: { notification: { ...serverNotification, read: true } } });

    const result = await notificationsApi.markAsRead('n1');

    expect(mockPatch).toHaveBeenCalledWith('/notifications/n1', { read: true });
    expect(result.read).toBe(true);
  });
});

describe('notificationsApi.markAllAsRead', () => {
  it('PATCHes /notifications/read-all and returns the updated count', async () => {
    mockPatch.mockResolvedValueOnce({ data: { success: true, updated: 3 } });
    expect(await notificationsApi.markAllAsRead()).toBe(3);
    expect(mockPatch).toHaveBeenCalledWith('/notifications/read-all', undefined);
  });
});

describe('notificationsApi.delete', () => {
  it('DELETEs /notifications/:id', async () => {
    mockDelete.mockResolvedValueOnce({ data: undefined });
    await notificationsApi.delete('n1');
    expect(mockDelete).toHaveBeenCalledWith('/notifications/n1');
  });
});

describe('notificationsApi push token', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POSTs the token to /notifications/push-token', async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true } });
    await notificationsApi.registerPushToken('ExponentPushToken[abc]');
    expect(mockPost).toHaveBeenCalledWith('/notifications/push-token', { token: 'ExponentPushToken[abc]' });
  });

  it('DELETEs the push token', async () => {
    mockDelete.mockResolvedValueOnce({ data: undefined });
    await notificationsApi.removePushToken();
    expect(mockDelete).toHaveBeenCalledWith('/notifications/push-token');
  });
});
