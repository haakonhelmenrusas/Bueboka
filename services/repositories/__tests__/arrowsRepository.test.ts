import { AxiosError, AxiosHeaders } from 'axios';
import { arrowsRepository } from '@/services/repositories';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';
import { Arrows, Material } from '@/types';

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

const fakeArrows: Arrows = {
  id: 'arrows-1',
  userId: 'user-1',
  name: 'Easton X10',
  material: Material.KARBON,
  arrowsCount: 12,
  diameter: 5.9,
  weight: 24,
  length: 700,
  spine: '600',
  pointType: 'Bullet',
  pointWeight: 120,
  vanes: 'AAE Max Stealth',
  nock: 'Pin nock',
  notes: null,
  isFavorite: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe('arrowsRepository.getAll', () => {
  it('unwraps { arrows: Arrows[] } envelope from the API', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { arrows: [fakeArrows] } });
    const result = await arrowsRepository.getAll();
    expect(result).toEqual([fakeArrows]);
    expect(mockClient.get).toHaveBeenCalledWith('/arrows');
  });

  it('returns a flat array when the API responds without a wrapper', async () => {
    mockClient.get.mockResolvedValueOnce({ data: [fakeArrows] });
    const result = await arrowsRepository.getAll();
    expect(result).toEqual([fakeArrows]);
  });

  it('returns an empty array when the API returns null/undefined', async () => {
    mockClient.get.mockResolvedValueOnce({ data: null });
    const result = await arrowsRepository.getAll();
    expect(result).toEqual([]);
  });

  it('returns an empty array when arrows key is absent', async () => {
    mockClient.get.mockResolvedValueOnce({ data: {} });
    const result = await arrowsRepository.getAll();
    expect(result).toEqual([]);
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(arrowsRepository.getAll()).rejects.toBeInstanceOf(AppError);
  });
});

// ── create ────────────────────────────────────────────────────────────────────

describe('arrowsRepository.create', () => {
  it('sends a POST to /arrows and returns the created arrow set', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeArrows });
    const result = await arrowsRepository.create({ name: 'Easton X10', material: Material.KARBON });
    expect(result).toEqual(fakeArrows);
    expect(mockClient.post).toHaveBeenCalledWith('/arrows', { name: 'Easton X10', material: Material.KARBON });
  });

  it('passes all optional fields to the API', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeArrows });
    await arrowsRepository.create({ name: 'X10', material: Material.KARBON, arrowsCount: 12, diameter: 5.9 });
    expect(mockClient.post).toHaveBeenCalledWith('/arrows', expect.objectContaining({ arrowsCount: 12, diameter: 5.9 }));
  });

  it('throws AppError with BAD_REQUEST on 400', async () => {
    mockClient.post.mockRejectedValueOnce(makeAxiosError(400, { message: 'Ugyldig data' }));
    const caught = await arrowsRepository.create({ name: '', material: Material.KARBON }).catch((e) => e);
    expect(caught).toBeInstanceOf(AppError);
    expect(caught.code).toBe('BAD_REQUEST');
  });
});

// ── update ────────────────────────────────────────────────────────────────────

describe('arrowsRepository.update', () => {
  it('sends a PATCH to /arrows/:id and returns the updated arrow set', async () => {
    const updated = { ...fakeArrows, arrowsCount: 6 };
    mockClient.patch.mockResolvedValueOnce({ data: updated });

    const result = await arrowsRepository.update('arrows-1', { arrowsCount: 6 });

    expect(result.arrowsCount).toBe(6);
    expect(mockClient.patch).toHaveBeenCalledWith('/arrows/arrows-1', { arrowsCount: 6 });
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await arrowsRepository.update('ghost', { arrowsCount: 1 }).catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── delete ────────────────────────────────────────────────────────────────────

describe('arrowsRepository.delete', () => {
  it('sends DELETE to /arrows/:id', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await arrowsRepository.delete('arrows-1');
    expect(mockClient.delete).toHaveBeenCalledWith('/arrows/arrows-1');
  });

  it('throws AppError on failure', async () => {
    mockClient.delete.mockRejectedValueOnce(makeAxiosError(500));
    await expect(arrowsRepository.delete('arrows-1')).rejects.toBeInstanceOf(AppError);
  });
});

// ── toggleFavorite ────────────────────────────────────────────────────────────

describe('arrowsRepository.toggleFavorite', () => {
  it('sends PATCH /arrows/:id with isFavorite: true', async () => {
    mockClient.patch.mockResolvedValueOnce({ data: { ...fakeArrows, isFavorite: true } });
    const result = await arrowsRepository.toggleFavorite('arrows-1', true);
    expect(result.isFavorite).toBe(true);
    expect(mockClient.patch).toHaveBeenCalledWith('/arrows/arrows-1', { isFavorite: true });
  });

  it('sends PATCH /arrows/:id with isFavorite: false', async () => {
    mockClient.patch.mockResolvedValueOnce({ data: { ...fakeArrows, isFavorite: false } });
    const result = await arrowsRepository.toggleFavorite('arrows-1', false);
    expect(result.isFavorite).toBe(false);
    expect(mockClient.patch).toHaveBeenCalledWith('/arrows/arrows-1', { isFavorite: false });
  });

  it('throws AppError on network failure', async () => {
    mockClient.patch.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(arrowsRepository.toggleFavorite('arrows-1', true)).rejects.toBeInstanceOf(AppError);
  });
});

