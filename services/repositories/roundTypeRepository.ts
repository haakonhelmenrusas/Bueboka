import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { RoundType } from '@/types';

/**
 * Round type repository - handles all round type related API operations
 */
export const roundTypeRepository = {
  /**
   * Get all available round types
   */
  async getAll(): Promise<RoundType[]> {
    try {
      const response = await client.get<RoundType[]>('/round-types');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a specific round type by ID
   */
  async getById(id: string): Promise<RoundType> {
    try {
      const response = await client.get<RoundType>(`/round-types/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
