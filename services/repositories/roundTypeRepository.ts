import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { RoundType } from '@/types';

/** Round type repository */
export const roundTypeRepository = {
  async getAll(): Promise<RoundType[]> {
    try {
      const response = await client.get<RoundType[]>('/round-types');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: string): Promise<RoundType> {
    try {
      const response = await client.get<RoundType>(`/round-types/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
