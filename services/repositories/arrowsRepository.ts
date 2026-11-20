import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { Arrows, Material } from '@/types';

/** Arrow set creation/update data */
export interface ArrowsData {
  name: string;
  material: Material;
  arrowsCount?: number;
  diameter?: number;
  weight?: number;
  length?: number;
  spine?: string;
  pointType?: string;
  pointWeight?: number;
  vanes?: string;
  nock?: string;
  notes?: string;
  isFavorite?: boolean;
}

/** Arrows repository */
export const arrowsRepository = {
  async getAll(): Promise<Arrows[]> {
    try {
      const response = await client.get<{ arrows: Arrows[] } | Arrows[]>('/arrows');
      if (!response.data) return [];
      return Array.isArray(response.data) ? response.data : ((response.data as { arrows: Arrows[] }).arrows ?? []);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: ArrowsData): Promise<Arrows> {
    try {
      const response = await client.post<Arrows>('/arrows', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: string, data: Partial<ArrowsData>): Promise<Arrows> {
    try {
      const response = await client.patch<Arrows>(`/arrows/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/arrows/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<Arrows> {
    try {
      const response = await client.patch<Arrows>(`/arrows/${id}`, { isFavorite });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
