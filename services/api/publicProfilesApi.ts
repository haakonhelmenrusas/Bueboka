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
      const response = await client.get<{ profiles: PublicProfile[]; error: null }>(`/public/profiles?q=${q}`);
      const profiles = response.data?.profiles;
      return Array.isArray(profiles) ? profiles : [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get detailed public profile by ID
   * GET /api/public/profiles/:id
   */
  async getById(id: string): Promise<PublicProfile> {
    try {
      const response = await client.get<{ profile: PublicProfile }>(`/public/profiles/${id}`);
      const profile = response.data?.profile;

      if (!profile) {
        throw new Error('Profilen ble ikke funnet');
      }

      return profile;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
