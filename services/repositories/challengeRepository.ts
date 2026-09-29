import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import type {
  Challenge,
  ChallengeStatus,
  ChallengeListResponse,
  ChallengeListItem,
  ChallengeStatistics,
  CreateChallengeData,
  UpdateChallengeData,
  SubmitChallengeResultData,
} from '@/types';

/**
 * Parameters for filtering challenges in getAll
 */
export interface GetAllChallengesParams {
  page?: number;
  pageSize?: number;
  status?: ChallengeStatus;
  userId?: string; // Filter by specific user
}

/**
 * Challenge repository for managing 1v1 challenges between archers
 */
export const challengeRepository = {
  /**
   * Get all challenges with optional pagination and filtering
   */
  async getAll(params?: GetAllChallengesParams): Promise<ChallengeListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', String(params.page));
      if (params?.pageSize !== undefined) queryParams.append('pageSize', String(params.pageSize));
      if (params?.status !== undefined) queryParams.append('status', params.status);
      if (params?.userId !== undefined) queryParams.append('userId', params.userId);

      const queryString = queryParams.toString();
      const url = queryString ? `/challenges?${queryString}` : '/challenges';

      const response = await client.get<ChallengeListResponse>(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a specific challenge by ID
   */
  async getById(id: string): Promise<Challenge> {
    try {
      const response = await client.get<Challenge>(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new challenge
   */
  async create(data: CreateChallengeData): Promise<Challenge> {
    try {
      // Convert Date objects to ISO strings for JSON serialization
      const payload = {
        ...data,
        startDate: data.startDate ? data.startDate.toISOString() : undefined,
        endDate: data.endDate ? data.endDate.toISOString() : undefined,
      };

      const response = await client.post<Challenge>('/challenges', payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing challenge
   */
  async update(id: string, data: UpdateChallengeData): Promise<Challenge> {
    try {
      // Convert Date objects to ISO strings for JSON serialization
      const payload = {
        ...data,
        startDate: data.startDate ? data.startDate.toISOString() : undefined,
        endDate: data.endDate ? data.endDate.toISOString() : undefined,
      };

      const response = await client.patch<Challenge>(`/challenges/${id}`, payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Accept a challenge (challenged user only)
   */
  async accept(id: string): Promise<Challenge> {
    try {
      const response = await client.patch<Challenge>(`/challenges/${id}/accept`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Decline a challenge (challenged user only)
   */
  async decline(id: string): Promise<Challenge> {
    try {
      const response = await client.patch<Challenge>(`/challenges/${id}/decline`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cancel a challenge (challenger only)
   */
  async cancel(id: string): Promise<Challenge> {
    try {
      const response = await client.patch<Challenge>(`/challenges/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Submit results for a challenge
   */
  async submitResult(id: string, data: SubmitChallengeResultData): Promise<Challenge> {
    try {
      const response = await client.post<Challenge>(`/challenges/${id}/submit`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a challenge (challenger only, before accepted)
   */
  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/challenges/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get challenge statistics for a user
   */
  async getStatistics(userId: string): Promise<ChallengeStatistics> {
    try {
      const response = await client.get<ChallengeStatistics>(`/challenges/statistics`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
