import { AxiosError, AxiosHeaders } from 'axios';
import { roundTypeRepository } from '@/services/repositories';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';
import { RoundType } from '@/types';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: {
    get: jest.fn(),
  },
}));

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const mockClient = authFetchClient as jest.Mocked<typeof authFetchClient>;

function makeAxiosError(status: number): AxiosError {
  const err = new AxiosError('Request failed', 'ERR_BAD_RESPONSE');
  err.response = {
    status,
    data: {},
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() } as any,
    statusText: 'Error',
  };
  return err;
}

const fakeRoundType: RoundType = {
  id: 'rt-1',
  name: 'WA 18m',
  distanceMeters: 18,
  targetType: 'WA_40CM',
  numberArrows: 60,
  arrowsWithoutScore: 0,
  roundScore: 600,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe('roundTypeRepository.getAll', () => {
  it('fetches all round types from /round-types', async () => {
    mockClient.get.mockResolvedValueOnce({ data: [fakeRoundType] });
    const result = await roundTypeRepository.getAll();
    expect(result).toEqual([fakeRoundType]);
    expect(mockClient.get).toHaveBeenCalledWith('/round-types');
  });

  it('returns an empty array when the API returns empty list', async () => {
    mockClient.get.mockResolvedValueOnce({ data: [] });
    const result = await roundTypeRepository.getAll();
    expect(result).toEqual([]);
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(roundTypeRepository.getAll()).rejects.toBeInstanceOf(AppError);
  });

  it('throws AppError with SERVER_ERROR on 500', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(500));
    const caught = await roundTypeRepository.getAll().catch((e) => e);
    expect(caught.code).toBe('SERVER_ERROR');
  });
});

// ── getById ───────────────────────────────────────────────────────────────────

describe('roundTypeRepository.getById', () => {
  it('fetches a single round type from /round-types/:id', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeRoundType });
    const result = await roundTypeRepository.getById('rt-1');
    expect(result).toEqual(fakeRoundType);
    expect(mockClient.get).toHaveBeenCalledWith('/round-types/rt-1');
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await roundTypeRepository.getById('ghost').catch((e) => e);
    expect(caught).toBeInstanceOf(AppError);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

