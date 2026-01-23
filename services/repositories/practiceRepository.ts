import client from '@/services/api/client';
import { handleApiError } from '@/services/api/errors';
import { End, Environment, Practice, WeatherCondition } from '@/types';
import { PaginatedResponse } from '@/services/api/types';

/**
 * End creation data structure (for creating practice ends)
 */
export interface CreateEndData {
  arrows: number;
  scores: number[];
  distanceMeters?: number;
  targetSizeCm?: number;
  arrowsPerEnd?: number;
}

/**
 * Practice creation data structure
 */
export interface CreatePracticeData {
  date: Date;
  environment: Environment;
  location?: string;
  weather?: WeatherCondition[];
  bowId?: string;
  arrowsId?: string;
  roundTypeId?: string;
  notes?: string;
  ends?: CreateEndData[];
}

/**
 * Practice update data structure
 */
export interface UpdatePracticeData {
  date?: Date;
  environment?: Environment;
  location?: string;
  weather?: WeatherCondition[];
  bowId?: string;
  arrowsId?: string;
  roundTypeId?: string;
  notes?: string;
}

/**
 * Practice query parameters
 */
export interface PracticeQueryParams {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Practice repository - handles all practice-related API operations
 */
export const practiceRepository = {
  /**
   * Get all practices for the current user with optional pagination and filters
   */
  async getAll(params?: PracticeQueryParams): Promise<PaginatedResponse<Practice>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.startDate) queryParams.append('startDate', params.startDate.toISOString());
      if (params?.endDate) queryParams.append('endDate', params.endDate.toISOString());

      const response = await client.get<PaginatedResponse<Practice>>(`/practices?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a specific practice by ID (includes ends)
   */
  async getById(id: string): Promise<Practice> {
    try {
      const response = await client.get<Practice>(`/practices/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new practice session
   */
  async create(data: CreatePracticeData): Promise<Practice> {
    try {
      const response = await client.post<Practice>('/practices', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing practice
   */
  async update(id: string, data: UpdatePracticeData): Promise<Practice> {
    try {
      const response = await client.put<Practice>(`/practices/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a practice
   */
  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/practices/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Add an end to a practice session
   */
  async addEnd(practiceId: string, data: CreateEndData): Promise<End> {
    try {
      const response = await client.post<End>(`/practices/${practiceId}/ends`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a specific end
   */
  async updateEnd(practiceId: string, endId: string, data: Partial<CreateEndData>): Promise<End> {
    try {
      const response = await client.put<End>(`/practices/${practiceId}/ends/${endId}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a specific end
   */
  async deleteEnd(practiceId: string, endId: string): Promise<void> {
    try {
      await client.delete(`/practices/${practiceId}/ends/${endId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get practices within a date range (convenience method)
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<Practice[]> {
    try {
      const response = await this.getAll({ startDate, endDate, limit: 1000 });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
