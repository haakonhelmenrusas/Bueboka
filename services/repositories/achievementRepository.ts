import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { AchievementData } from '@/types/Achievement';

/**
 * Achievement repository — fetches achievement progress from the API
 */
export const achievementRepository = {
  /**
   * Get all achievement progress for the current user
   */
  async getAll(): Promise<AchievementData> {
    try {
      const response = await client.get<AchievementData>('/achievements');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

