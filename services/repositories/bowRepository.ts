import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { Bow, BowType } from '@/types';

/** Fields for creating or updating a bow. Required fields (name, type) are only enforced on create. */
export interface BowData {
  name: string;
  type: BowType;
  eyeToNock?: number;
  aimMeasure?: number;
  eyeToSight?: number;
  limbs?: string;
  riser?: string;
  handOrientation?: 'RH' | 'LH' | null;
  drawWeight?: number;
  bowLength?: number;
  notes?: string;
  isFavorite?: boolean;
}

/**
 * Bow repository - handles all bow-related API operations
 */
export const bowRepository = {
  /**
   * Get all bows for the current user
   */
  async getAll(): Promise<Bow[]> {
    try {
      const response = await client.get<{ bows: Bow[] }>('/bows');
      if (!response.data) return [];
      return Array.isArray(response.data) ? response.data : (response.data.bows ?? []);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new bow
   */
  async create(data: BowData): Promise<Bow> {
    try {
      const response = await client.post<{ bow: Bow }>('/bows', data);
      return response.data.bow;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing bow
   */
  async update(id: string, data: Partial<BowData>): Promise<Bow> {
    try {
      const response = await client.patch<{ bow: Bow }>(`/bows/${id}`, data);
      return response.data.bow;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a bow
   */
  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/bows/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Toggle favorite status of a bow
   */
  async toggleFavorite(id: string, isFavorite: boolean): Promise<Bow> {
    try {
      const response = await client.patch<{ bow: Bow }>(`/bows/${id}`, { isFavorite });
      return response.data.bow;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
