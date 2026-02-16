import client from '@/services/api/client';
import { handleApiError } from '@/services/api/errors';
import { Bow, BowType } from '@/types';

/**
 * Bow creation data structure
 */
export interface CreateBowData {
  name: string;
  type: BowType;
  eyeToNock?: number;
  aimMeasure?: number;
  eyeToSight?: number;
  notes?: string;
  isFavorite?: boolean;
}

/**
 * Bow update data structure
 */
export interface UpdateBowData {
  name?: string;
  type?: BowType;
  eyeToNock?: number;
  aimMeasure?: number;
  eyeToSight?: number;
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
      // Extract the bows array from the response object
      return Array.isArray(response.data) ? response.data : response.data.bows || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a specific bow by ID
   */
  async getById(id: string): Promise<Bow> {
    try {
      const response = await client.get<Bow>(`/bows/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new bow
   */
  async create(data: CreateBowData): Promise<Bow> {
    try {
      const response = await client.post<Bow>('/bows', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing bow
   */
  async update(id: string, data: UpdateBowData): Promise<Bow> {
    try {
      const response = await client.patch<Bow>(`/bows/${id}`, data);
      return response.data;
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
      const response = await client.patch<Bow>(`/bows/${id}`, { isFavorite });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
