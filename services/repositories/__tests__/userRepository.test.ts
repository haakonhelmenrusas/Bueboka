import { AxiosError, AxiosHeaders } from 'axios';
import { userRepository } from '@/services';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';
import { User } from '@/types';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/services/sentryStub', () => ({
  captureException: jest.fn(),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const mockClient = authFetchClient as jest.Mocked<typeof authFetchClient>;

function makeAxiosError(status: number, data?: Record<string, any>): AxiosError {
  const err = new AxiosError('Request failed', 'ERR_BAD_RESPONSE');
  err.response = {
    status,
    data: data ?? {},
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() } as any,
    statusText: 'Error',
  };
  return err;
}

const fakeUser: User = {
  id: 'user-1',
  email: 'archer@bueboka.no',
  emailVerified: true,
  name: 'Ola Nordmann',
  club: 'Oslo Bueskyttere',
  image: null,
  skytternr: '12345',
  isPublic: false,
  publicName: true,
  publicClub: true,
  publicStats: false,
  publicSkytternr: false,
  publicAchievements: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// ── getCurrentUser ────────────────────────────────────────────────────────────

describe('userRepository.getCurrentUser', () => {
  it('unwraps { profile: User } envelope from the API', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { profile: fakeUser } });
    const result = await userRepository.getCurrentUser();
    expect(result).toEqual(fakeUser);
    expect(mockClient.get).toHaveBeenCalledWith('/profile');
  });

  it('returns a flat User object when there is no profile wrapper', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeUser });
    const result = await userRepository.getCurrentUser();
    expect(result).toEqual(fakeUser);
  });

  it('throws an AppError on network failure', async () => {
    const err = new AxiosError('Network Error', 'ERR_NETWORK');
    mockClient.get.mockRejectedValueOnce(err);
    await expect(userRepository.getCurrentUser()).rejects.toBeInstanceOf(AppError);
  });

  it('throws AppError with UNAUTHORIZED code on 401', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(401, { message: 'Unauthorized' }));
    const caught = await userRepository.getCurrentUser().catch((e) => e);
    expect(caught).toBeInstanceOf(AppError);
    expect(caught.code).toBe('UNAUTHORIZED');
  });

  it('throws AppError with NOT_FOUND code on 404', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await userRepository.getCurrentUser().catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── updateProfile ─────────────────────────────────────────────────────────────

describe('userRepository.updateProfile', () => {
  it('sends a PATCH to /profile and returns the updated user', async () => {
    const updated = { ...fakeUser, name: 'Kari Nordmann' };
    mockClient.patch.mockResolvedValueOnce({ data: updated });

    const result = await userRepository.updateProfile({ name: 'Kari Nordmann' });

    expect(result.name).toBe('Kari Nordmann');
    expect(mockClient.patch).toHaveBeenCalledWith('/profile', { name: 'Kari Nordmann' });
  });

  it('can send club and skytternr together', async () => {
    mockClient.patch.mockResolvedValueOnce({ data: fakeUser });
    await userRepository.updateProfile({ name: 'Ola', club: 'Bergen BK', skytternr: '99' });
    expect(mockClient.patch).toHaveBeenCalledWith('/profile', { name: 'Ola', club: 'Bergen BK', skytternr: '99' });
  });

  it('throws AppError with BAD_REQUEST on 400', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(400, { message: 'Ugyldig data' }));
    const caught = await userRepository.updateProfile({ name: '' }).catch((e) => e);
    expect(caught).toBeInstanceOf(AppError);
    expect(caught.code).toBe('BAD_REQUEST');
  });

  it('throws AppError with UNAUTHORIZED on 401', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(401));
    const caught = await userRepository.updateProfile({ name: 'X' }).catch((e) => e);
    expect(caught.code).toBe('UNAUTHORIZED');
  });
});

// ── updateAvatar ──────────────────────────────────────────────────────────────

describe('userRepository.updateAvatar', () => {
  it('sends a multipart/form-data PATCH to /users with the image file', async () => {
    mockClient.patch.mockResolvedValueOnce({ data: { ...fakeUser, image: 'https://cdn.example.com/avatar.jpg' } });

    const result = await userRepository.updateAvatar('file:///tmp/avatar.jpg');

    expect(result.image).toBe('https://cdn.example.com/avatar.jpg');
    expect(mockClient.patch).toHaveBeenCalledWith(
      '/users',
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'multipart/form-data' }),
      }),
    );
  });

  it('throws AppError on upload failure', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(500));
    await expect(userRepository.updateAvatar('file:///tmp/avatar.jpg')).rejects.toBeInstanceOf(AppError);
  });
});

// ── removeAvatar ──────────────────────────────────────────────────────────────

describe('userRepository.removeAvatar', () => {
  it('sends PATCH /users with image: null', async () => {
    mockClient.patch.mockResolvedValueOnce({ data: { ...fakeUser, image: null } });

    const result = await userRepository.removeAvatar();

    expect(result.image).toBeNull();
    expect(mockClient.patch).toHaveBeenCalledWith('/users', { image: null });
  });

  it('throws AppError on failure', async () => {
    mockClient.patch.mockRejectedValueOnce(new Error('Remove failed'));
    await expect(userRepository.removeAvatar()).rejects.toBeInstanceOf(AppError);
  });
});

// ── updatePublicSettings ──────────────────────────────────────────────────────

describe('userRepository.updatePublicSettings', () => {
  it('sends PATCH /users with all provided fields', async () => {
    const settings = { isPublic: true, publicName: true, publicClub: false };
    mockClient.patch.mockResolvedValueOnce({ data: { ...fakeUser, ...settings } });

    const result = await userRepository.updatePublicSettings(settings);

    expect(result.isPublic).toBe(true);
    expect(result.publicClub).toBe(false);
    expect(mockClient.patch).toHaveBeenCalledWith('/users', settings);
  });

  it('can update a single setting', async () => {
    mockClient.patch.mockResolvedValueOnce({ data: { ...fakeUser, publicStats: true } });
    await userRepository.updatePublicSettings({ publicStats: true });
    expect(mockClient.patch).toHaveBeenCalledWith('/users', { publicStats: true });
  });

  it('throws AppError with SERVER_ERROR on 500', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(500));
    const caught = await userRepository.updatePublicSettings({ isPublic: false }).catch((e) => e);
    expect(caught.code).toBe('SERVER_ERROR');
  });
});

// ── deleteAccount ─────────────────────────────────────────────────────────────

describe('userRepository.deleteAccount', () => {
  it('sends DELETE to /users/delete', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await userRepository.deleteAccount();
    expect(mockClient.delete).toHaveBeenCalledWith('/users/delete');
  });

  it('throws AppError on failure', async () => {
    mockClient.delete.mockRejectedValueOnce(makeAxiosError(401));
    await expect(userRepository.deleteAccount()).rejects.toBeInstanceOf(AppError);
  });
});
