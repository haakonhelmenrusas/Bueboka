import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { End, Environment, Practice, PracticeCardsResponse, PracticeCategory, PracticeFilter, WeatherCondition } from '@/types';

/** End creation data */
export interface CreateEndData {
  numberArrows?: number;
  arrowsWithoutScore?: number;
  scores?: number[];
  roundScore?: number;
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
  targetType?: string;
  arrowsPerEnd?: number;
}

/** Practice creation data */
export interface CreatePracticeData {
  date: Date | string;
  environment: Environment;
  rating?: number;
  location?: string;
  weather?: WeatherCondition[];
  practiceCategory?: PracticeCategory;
  bowId?: string;
  arrowsId?: string;
  roundTypeId?: string;
  notes?: string;
  rounds: CreateEndData[];
}

/** Practice update data */
export interface UpdatePracticeData {
  date?: Date | string;
  environment?: Environment;
  rating?: number;
  location?: string;
  weather?: WeatherCondition[];
  practiceCategory?: PracticeCategory;
  bowId?: string;
  arrowsId?: string;
  notes?: string;
  rounds?: CreateEndData[];
}

/** Practice query parameters */
export interface PracticeQueryParams {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

/** Practice cards query parameters */
export interface PracticeCardsQueryParams {
  page?: number;
  pageSize?: number;
  filter?: PracticeFilter;
}

/** Practice list response */
export interface PracticeListResponse {
  practices: Practice[];
}

/** Practice repository */
export const practiceRepository = {
  async getCards(params?: PracticeCardsQueryParams): Promise<PracticeCardsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.filter) queryParams.append('filter', params.filter);
      const response = await client.get<PracticeCardsResponse>(`/practices/cards?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all practices for the current user with optional pagination and filters
   */
  async getAll(params?: PracticeQueryParams): Promise<PracticeListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.startDate) queryParams.append('startDate', params.startDate.toISOString());
      if (params?.endDate) queryParams.append('endDate', params.endDate.toISOString());
      const response = await client.get<PracticeListResponse>(`/practices?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: string): Promise<Practice> {
    try {
      const response = await client.get<{ practice: Practice }>(`/practices/${id}/details`);
      return (response.data as any).practice || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: CreatePracticeData): Promise<Practice> {
    try {
      const response = await client.post<Practice>('/practices', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: string, data: UpdatePracticeData): Promise<Practice> {
    try {
      const response = await client.patch<Practice>(`/practices/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/practices/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async addEnd(practiceId: string, data: CreateEndData): Promise<End> {
    try {
      const response = await client.post<End>(`/practices/${practiceId}/ends`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateEnd(practiceId: string, endId: string, data: Partial<CreateEndData>): Promise<End> {
    try {
      const response = await client.put<End>(`/practices/${practiceId}/ends/${endId}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteEnd(practiceId: string, endId: string): Promise<void> {
    try {
      await client.delete(`/practices/${practiceId}/ends/${endId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
