import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import type { Series } from '@/types';

export interface StatsData {
  totalArrows: number;
  scoredArrows: number;
  unscoredArrows: number;
  avgScorePerArrow: number | null;
}

export interface StatsResponse {
  last7Days: StatsData;
  last30Days: StatsData;
  overall: StatsData;
}

const EMPTY_STATS_DATA: StatsData = {
  totalArrows: 0,
  scoredArrows: 0,
  unscoredArrows: 0,
  avgScorePerArrow: null,
};

/**
 * Stats API service
 */
export const statsApi = {
  /**
   * Get user statistics
   */
  async getStats(): Promise<StatsResponse> {
    try {
      const response = await client.get<{ stats: StatsResponse } | StatsResponse>('/stats');
      // Handle both { stats: StatsResponse } and StatsResponse directly
      const data = response.data as any;
      const raw = (data?.stats ?? data) as Partial<StatsResponse> | null | undefined;
      return {
        last7Days: raw?.last7Days ?? EMPTY_STATS_DATA,
        last30Days: raw?.last30Days ?? EMPTY_STATS_DATA,
        overall: raw?.overall ?? EMPTY_STATS_DATA,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get detailed statistics with per-series breakdown
   */
  async getDetailedStats(): Promise<Series[]> {
    try {
      const response = await client.get<{ series: Series[] }>('/stats/detailed');
      return response.data?.series ?? [];
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
