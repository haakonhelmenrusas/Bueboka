import { AxiosError, AxiosHeaders } from 'axios';
import { bowRepository } from '@/services/repositories';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';
import { Bow, BowType } from '@/types';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@sentry/react-native', () => ({
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

const fakeBow: Bow = {
  id: 'bow-1',
  userId: 'user-1',
  name: 'Hoyt Formula XI',
  type: BowType.RECURVE,
  eyeToNock: 820,
  aimMeasure: null,
  eyeToSight: null,
  limbs: 'WNS Limbs',
  riser: null,
  handOrientation: 'RH',
  drawWeight: 36,
  bowLength: 68,
  notes: null,
  isFavorite: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe('bowRepository.getAll', () => {
  it('unwraps { bows: Bow[] } envelope from the API', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { bows: [fakeBow] } });
    const result = await bowRepository.getAll();
    expect(result).toEqual([fakeBow]);
    expect(mockClient.get).toHaveBeenCalledWith('/bows');
  });

  it('returns a flat array when the API responds without a wrapper', async () => {
    mockClient.get.mockResolvedValueOnce({ data: [fakeBow] });
    const result = await bowRepository.getAll();
    expect(result).toEqual([fakeBow]);
  });

  it('returns an empty array when the API returns null/undefined', async () => {
    mockClient.get.mockResolvedValueOnce({ data: null });
    const result = await bowRepository.getAll();
    expect(result).toEqual([]);
  });

  it('returns an empty array when bows key is absent', async () => {
    mockClient.get.mockResolvedValueOnce({ data: {} });
    const result = await bowRepository.getAll();
    expect(result).toEqual([]);
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(bowRepository.getAll()).rejects.toBeInstanceOf(AppError);
  });

  it('throws AppError with UNAUTHORIZED code on 401', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(401));
    const caught = await bowRepository.getAll().catch((e) => e);
    expect(caught).toBeInstanceOf(AppError);
    expect(caught.code).toBe('UNAUTHORIZED');
  });
});

// ── create ────────────────────────────────────────────────────────────────────

describe('bowRepository.create', () => {
  it('sends a POST to /bows and returns the unwrapped bow', async () => {
    mockClient.post.mockResolvedValueOnce({ data: { bow: fakeBow } });
    const result = await bowRepository.create({ name: 'Hoyt Formula XI', type: BowType.RECURVE });
    expect(result).toEqual(fakeBow);
    expect(mockClient.post).toHaveBeenCalledWith('/bows', { name: 'Hoyt Formula XI', type: BowType.RECURVE });
  });

  it('passes all optional fields to the API', async () => {
    mockClient.post.mockResolvedValueOnce({ data: { bow: fakeBow } });
    await bowRepository.create({
      name: 'My Bow',
      type: BowType.COMPOUND,
      drawWeight: 50,
      handOrientation: 'LH',
      isFavorite: true,
    });
    expect(mockClient.post).toHaveBeenCalledWith(
      '/bows',
      expect.objectContaining({ drawWeight: 50, handOrientation: 'LH', isFavorite: true }),
    );
  });

  it('throws AppError with BAD_REQUEST on 400', async () => {
    mockClient.post.mockRejectedValueOnce(makeAxiosError(400, { message: 'Ugyldig data' }));
    const caught = await bowRepository.create({ name: '', type: BowType.RECURVE }).catch((e) => e);
    expect(caught).toBeInstanceOf(AppError);
    expect(caught.code).toBe('BAD_REQUEST');
  });

  it('throws AppError on network failure', async () => {
    mockClient.post.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(bowRepository.create({ name: 'X', type: BowType.RECURVE })).rejects.toBeInstanceOf(AppError);
  });
});

// ── update ────────────────────────────────────────────────────────────────────

describe('bowRepository.update', () => {
  it('sends a PATCH to /bows/:id and returns the updated bow', async () => {
    const updated = { ...fakeBow, drawWeight: 40 };
    mockClient.patch.mockResolvedValueOnce({ data: { bow: updated } });

    const result = await bowRepository.update('bow-1', { drawWeight: 40 });

    expect(result.drawWeight).toBe(40);
    expect(mockClient.patch).toHaveBeenCalledWith('/bows/bow-1', { drawWeight: 40 });
  });

  it('can set isFavorite to true (API handles unfavouriting others)', async () => {
    mockClient.patch.mockResolvedValueOnce({ data: { bow: { ...fakeBow, isFavorite: true } } });
    const result = await bowRepository.update('bow-1', { isFavorite: true });
    expect(result.isFavorite).toBe(true);
    expect(mockClient.patch).toHaveBeenCalledWith('/bows/bow-1', { isFavorite: true });
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await bowRepository.update('ghost', { name: 'X' }).catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });

  it('throws AppError with UNAUTHORIZED on 401', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(401));
    const caught = await bowRepository.update('bow-1', { name: 'Y' }).catch((e) => e);
    expect(caught.code).toBe('UNAUTHORIZED');
  });
});

// ── delete ────────────────────────────────────────────────────────────────────

describe('bowRepository.delete', () => {
  it('sends DELETE to /bows/:id', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await bowRepository.delete('bow-1');
    expect(mockClient.delete).toHaveBeenCalledWith('/bows/bow-1');
  });

  it('throws AppError on failure', async () => {
    mockClient.delete.mockRejectedValueOnce(makeAxiosError(403));
    await expect(bowRepository.delete('bow-1')).rejects.toBeInstanceOf(AppError);
  });
});
