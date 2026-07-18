import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { AimDistanceMark, CalculatedMarks, MarksResult, SightMark, SightMarkCalc, SightMarkResult } from '@/types';

export const sightMarksRepository = {
  async getAll(): Promise<SightMark[]> {
    try {
      const response = await client.get<SightMark[] | { sightMarks: SightMark[] }>('/sight-marks');
      return Array.isArray(response.data) ? response.data : response.data?.sightMarks || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: Partial<SightMark>): Promise<SightMark> {
    try {
      const response = await client.post<{ sightMark: SightMark } | SightMark>('/sight-marks', data);
      const raw = response.data as any;
      return raw?.sightMark ?? raw;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: string, data: Partial<SightMark>): Promise<SightMark> {
    try {
      const response = await client.put<{ sightMark: SightMark } | SightMark>(`/sight-marks/${id}`, data);
      const raw = response.data as any;
      return raw?.sightMark ?? raw;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async patch(id: string, data: Partial<SightMark>): Promise<SightMark> {
    try {
      const response = await client.patch<{ sightMark: SightMark } | SightMark>(`/sight-marks/${id}`, data);
      const raw = response.data as any;
      return raw?.sightMark ?? raw;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/sight-marks/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getResults(sightMarkId: string): Promise<SightMarkResult[]> {
    try {
      const response = await client.get<SightMarkResult[] | { sightMarkResults: SightMarkResult[] }>(`/sight-marks/${sightMarkId}/results`);
      const raw = response.data as any;
      return Array.isArray(raw) ? raw : (raw?.sightMarkResults ?? raw?.results ?? []);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createResult(sightMarkId: string, data: Partial<SightMarkResult>): Promise<SightMarkResult> {
    try {
      const response = await client.post<{ sightMarkResult: SightMarkResult } | SightMarkResult>(
        `/sight-marks/${sightMarkId}/results`,
        data,
      );
      const raw = response.data as any;
      return raw?.sightMarkResult ?? raw;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteResult(id: string): Promise<void> {
    try {
      await client.delete(`/sight-mark-results/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async calculateBallistics(data: AimDistanceMark): Promise<CalculatedMarks> {
    try {
      const response = await client.post<CalculatedMarks>('/ballistics/calculate', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async calculateSightMarks(data: SightMarkCalc): Promise<MarksResult> {
    try {
      const response = await client.post<MarksResult>('/sight-marks/calculate', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
