import client from '@/services/api/client';
import { PublicProfile } from '@/types';

/**
 * Public profiles API service
 */
export const publicProfilesApi = {
  /**
   * Search public profiles by name or club
   */
  async search(query: string): Promise<PublicProfile[]> {
    try {
      const response = await client.get<{ profiles: PublicProfile[] }>('/public/profiles', {
        params: { q: query.trim() },
      });
      return response.data.profiles || [];
    } catch (error) {
      throw error;
    }
  },
};
