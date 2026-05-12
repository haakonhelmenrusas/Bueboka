import { AxiosError, AxiosHeaders } from 'axios';
import { achievementRepository } from '@/services/repositories';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';
import { AchievementData } from '@/types/Achievement';

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

const fakeAchievementData: AchievementData = {
  achievements: [],
  summary: {
    totalUnlocked: 0,
    totalPoints: 0,
    totalAchievements: 0,
    completionPercentage: 0,
  },
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe('achievementRepository.getAll', () => {
  it('fetches achievement progress from /achievements and returns the data', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeAchievementData });
    const result = await achievementRepository.getAll();
    expect(result).toEqual(fakeAchievementData);
    expect(mockClient.get).toHaveBeenCalledWith('/achievements');
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(achievementRepository.getAll()).rejects.toBeInstanceOf(AppError);
  });

  it('throws AppError with UNAUTHORIZED on 401', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(401));
    const caught = await achievementRepository.getAll().catch((e) => e);
    expect(caught).toBeInstanceOf(AppError);
    expect(caught.code).toBe('UNAUTHORIZED');
  });

  it('throws AppError with SERVER_ERROR on 500', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(500));
    const caught = await achievementRepository.getAll().catch((e) => e);
    expect(caught.code).toBe('SERVER_ERROR');
  });
});
