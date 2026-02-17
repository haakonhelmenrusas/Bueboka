import client from '@/services/api/client';
import { AimDistanceMark, BowSpecification, CalculatedMarks, MarksResult, SightMark, SightMarkCalc, SightMarkResult } from '@/types';
import * as Sentry from '@sentry/react-native';

export const sightMarksRepository = {
  // SightMarks CRUD
  async getAll(): Promise<SightMark[]> {
    const response = await client.get<SightMark[] | { sightMarks: SightMark[] }>('/sight-marks');
    // Handle both wrapped {sightMarks: [...]} and direct array responses
    return Array.isArray(response.data) ? response.data : (response.data as any)?.sightMarks || [];
  },
  async getById(id: string): Promise<SightMark> {
    const response = await client.get<SightMark>(`/sight-marks/${id}`);
    return response.data;
  },
  async create(data: Partial<SightMark>): Promise<SightMark> {
    const response = await client.post<SightMark>('/sight-marks', data);
    return response.data;
  },
  async update(id: string, data: Partial<SightMark>): Promise<SightMark> {
    const response = await client.put<SightMark>(`/sight-marks/${id}`, data);
    return response.data;
  },
  async delete(id: string): Promise<void> {
    await client.delete(`/sight-marks/${id}`);
  },

  // Bow Specifications
  async getBowSpecificationByBowId(bowId: string): Promise<BowSpecification> {
    const response = await client.get<BowSpecification>(`/bow-specifications/by-bow/${bowId}`);
    return response.data;
  },
  async createSpecification(data: Partial<BowSpecification>): Promise<BowSpecification> {
    try {
      const response = await client.post<BowSpecification>('/bow-specifications', data);
      return response.data;
    } catch (error: any) {
      // Log the error to Sentry with context
      Sentry.captureException(error, {
        tags: { type: 'bow_specification_create_error' },
        extra: {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          bowId: data.bowId,
        },
      });

      throw error;
    }
  },

  // SightMarkResult CRUD
  async getResults(sightMarkId?: string): Promise<SightMarkResult[]> {
    const url = sightMarkId ? `/sight-mark-results?sightMarkId=${sightMarkId}` : '/sight-mark-results';
    const response = await client.get<SightMarkResult[]>(url);
    return response.data;
  },
  async createResult(sightMarkId: string, data: Partial<SightMarkResult>): Promise<SightMarkResult> {
    const response = await client.post<SightMarkResult>('/sight-mark-results', {
      ...data,
      sightMarkId,
    });
    return response.data;
  },
  async deleteResult(id: string): Promise<void> {
    await client.delete(`/sight-mark-results/${id}`);
  },

  // Ballistics calculations
  async calculateBallistics(data: AimDistanceMark): Promise<CalculatedMarks> {
    const response = await client.post<CalculatedMarks>('/ballistics/calculate', data);
    return response.data;
  },
  async calculateSightMarks(data: SightMarkCalc): Promise<MarksResult> {
    const response = await client.post<MarksResult>('/sight-marks/calculate', data);
    return response.data;
  },
};
