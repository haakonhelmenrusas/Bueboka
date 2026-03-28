import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { End, Environment, Practice, PracticeCardsResponse, PracticeCategory, PracticeFilter, WeatherCondition } from '@/types';

/**
 * End creation data structure (for creating practice ends)
 */
export interface CreateEndData {
  arrows?: number;
  arrowsWithoutScore?: number;
  /** Per-arrow breakdown – only accepted by the live-shooting endpoint, not by practice create/update. */
  scores?: number[];
  roundScore?: number;
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
  targetSizeCm?: number;
  targetType?: string;
  arrowsPerEnd?: number;
  arrowCoordinates?: { x: number; y: number }[];
}

/**
 * Practice creation data structure
 */
export interface CreatePracticeData {
  date: Date;
  environment: Environment;
  totalScore: number;
  rating?: number;
  location?: string;
  weather?: WeatherCondition[];
  practiceCategory?: PracticeCategory;
  bowId?: string;
  arrowsId?: string;
  roundTypeId?: string;
  notes?: string;
  ends?: CreateEndData[];
}

/**
 * Practice update data structure (matches API updatePracticeSchema)
 */
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
 * Query parameters for the unified practice+competition cards endpoint
 */
export interface PracticeCardsQueryParams {
  page?: number;
  pageSize?: number;
  filter?: PracticeFilter;
}

/**
 * Practice list response structure (actual API response)
 */
export interface PracticeListResponse {
  practices: Practice[];
}

/**
 * Practice repository - handles all practice-related API operations
 */
export const practiceRepository = {
  /**
   * Get paginated combined practice + competition cards for the current user.
   * Calls the /practices/cards endpoint which returns both TRENING and KONKURRANSE items.
   */
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

  /**
   * Get a specific practice by ID (includes ends)
   */
  async getById(id: string): Promise<Practice> {
    try {
      const response = await client.get<{ practice: Practice }>(`/practices/${id}/details`);
      // API returns { practice: {...} }, unwrap it
      return (response.data as any).practice || response.data;
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
      const response = await client.patch<Practice>(`/practices/${id}`, data);
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
};
