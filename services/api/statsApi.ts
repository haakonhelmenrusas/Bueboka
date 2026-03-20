import client from '@/services/api/client';

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

/**
 * Stats API service
 */
export const statsApi = {
  /**
   * Get user statistics
   */
  async getStats(): Promise<StatsResponse> {
    try {
      const response = await client.get<{ stats: StatsResponse }>('/stats');
      return response.data.stats;
    } catch (error) {
      throw error;
    }
  },
};
