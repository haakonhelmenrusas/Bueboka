import { AxiosError, AxiosHeaders } from 'axios';
import { statsApi } from '@/services/api/statsApi';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: {
    get: jest.fn(),
  },
}));

jest.mock('@/services/sentryStub', () => ({
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

const fakeStatsData = {
  totalArrows: 500,
  scoredArrows: 480,
  unscoredArrows: 20,
  avgScorePerArrow: 8.2,
};

const fakeStatsResponse = {
  last7Days: fakeStatsData,
  last30Days: { ...fakeStatsData, totalArrows: 1200 },
  overall: { ...fakeStatsData, totalArrows: 10000, avgScorePerArrow: null },
};

// ── getStats ──────────────────────────────────────────────────────────────────

describe('statsApi.getStats', () => {
  it('unwraps { stats: StatsResponse } envelope from the API', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { stats: fakeStatsResponse } });
    const result = await statsApi.getStats();
    expect(result.last7Days.totalArrows).toBe(500);
    expect(result.overall.avgScorePerArrow).toBeNull();
    expect(mockClient.get).toHaveBeenCalledWith('/stats');
  });

  it('returns data directly when there is no stats wrapper', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeStatsResponse });
    const result = await statsApi.getStats();
    expect(result.last30Days.totalArrows).toBe(1200);
  });

  it('falls back to empty stats when a period key is missing from the response', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { stats: { last7Days: fakeStatsData } } });
    const result = await statsApi.getStats();
    expect(result.last30Days.totalArrows).toBe(0);
    expect(result.overall.avgScorePerArrow).toBeNull();
  });

  it('falls back to empty stats when the API returns null data', async () => {
    mockClient.get.mockResolvedValueOnce({ data: null });
    const result = await statsApi.getStats();
    expect(result.last7Days.totalArrows).toBe(0);
    expect(result.last30Days.totalArrows).toBe(0);
    expect(result.overall.totalArrows).toBe(0);
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(statsApi.getStats()).rejects.toBeInstanceOf(AppError);
  });

  it('throws AppError with UNAUTHORIZED on 401', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(401));
    const caught = await statsApi.getStats().catch((e) => e);
    expect(caught.code).toBe('UNAUTHORIZED');
  });
});

// ── getDetailedStats ──────────────────────────────────────────────────────────

describe('statsApi.getDetailedStats', () => {
  it('fetches detailed stats from /stats/detailed and returns the series array', async () => {
    const fakeSeries = [{ id: 's-1', label: 'Januar 2024', data: [8, 9, 10] }];
    mockClient.get.mockResolvedValueOnce({ data: { series: fakeSeries } });
    const result = await statsApi.getDetailedStats();
    expect(result).toEqual(fakeSeries);
    expect(mockClient.get).toHaveBeenCalledWith('/stats/detailed');
  });

  it('returns an empty array when the series key is absent', async () => {
    mockClient.get.mockResolvedValueOnce({ data: {} });
    const result = await statsApi.getDetailedStats();
    expect(result).toEqual([]);
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(statsApi.getDetailedStats()).rejects.toBeInstanceOf(AppError);
  });
});
