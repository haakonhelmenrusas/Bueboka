import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
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
      const q = encodeURIComponent(query.trim());
      const response = await client.get<{ data: { profiles: PublicProfile[] }; error: null }>(`/public/profiles?q=${q}`);
      const profiles = response.data?.data?.profiles;
      return Array.isArray(profiles) ? profiles : [];
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
