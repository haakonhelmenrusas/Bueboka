import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { Achievement, AchievementData } from '@/types/Achievement';

interface AchievementCheckResponse {
  newAchievements: Achievement[];
  totalNewlyUnlocked: number;
}

export const achievementRepository = {
  async getAll(): Promise<AchievementData> {
    try {
      const response = await client.get<AchievementData>('/achievements');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async check(): Promise<AchievementCheckResponse> {
    try {
      const response = await client.post<AchievementCheckResponse>('/achievements/check', {});
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
