import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { Bow, BowType } from '@/types';

/** Bow creation/update data */
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

/** Bow repository */
export const bowRepository = {
  async getAll(): Promise<Bow[]> {
    try {
      const response = await client.get<{ bows: Bow[] }>('/bows');
      if (!response.data) return [];
      return Array.isArray(response.data) ? response.data : (response.data.bows ?? []);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: BowData): Promise<Bow> {
    try {
      const response = await client.post<{ bow: Bow }>('/bows', data);
      return response.data.bow;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: string, data: Partial<BowData>): Promise<Bow> {
    try {
      const response = await client.patch<{ bow: Bow }>(`/bows/${id}`, data);
      return response.data.bow;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/bows/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
