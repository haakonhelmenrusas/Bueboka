import { authFetchClient as client } from '@/services/api/authFetch';
import { AimDistanceMark, BowSpecification, CalculatedMarks, MarksResult, SightMark, SightMarkCalc, SightMarkResult } from '@/types';
import * as Sentry from '@sentry/react-native';

export const sightMarksRepository = {
  async getAll(): Promise<SightMark[]> {
    const response = await client.get<SightMark[] | { sightMarks: SightMark[] }>('/sight-marks');
    return Array.isArray(response.data) ? response.data : response.data?.sightMarks || [];
  },

  async create(data: Partial<SightMark>): Promise<SightMark> {
    const response = await client.post<{ sightMark: SightMark } | SightMark>('/sight-marks', data);
    const raw = response.data as any;
    return raw?.sightMark ?? raw;
  },
  async update(id: string, data: Partial<SightMark>): Promise<SightMark> {
    const response = await client.put<{ sightMark: SightMark } | SightMark>(`/sight-marks/${id}`, data);
    const raw = response.data as any;
    return raw?.sightMark ?? raw;
  },
  async patch(id: string, data: Partial<SightMark>): Promise<SightMark> {
    const response = await client.patch<{ sightMark: SightMark } | SightMark>(`/sight-marks/${id}`, data);
    const raw = response.data as any;
    return raw?.sightMark ?? raw;
  },
  async delete(id: string): Promise<void> {
    await client.delete(`/sight-marks/${id}`);
  },

  async getBowSpecificationByBowId(bowId: string): Promise<BowSpecification> {
    const response = await client.get<{ bowSpecification: BowSpecification } | BowSpecification>(`/bow-specifications/by-bow/${bowId}`);

    // Handle wrapped response { bowSpecification: {...} } or direct response
    const spec = (response.data as any)?.bowSpecification || response.data;

    if (!spec?.id) {
      Sentry.captureMessage('Bow specification missing id field', {
        level: 'error',
        extra: { responseData: response.data, bowId },
      });
      throw new Error('Bow specification response is missing id field');
    }

    return spec;
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

  async getResults(sightMarkId?: string): Promise<SightMarkResult[]> {
    const url = sightMarkId ? `/sight-mark-results?sightMarkId=${sightMarkId}` : '/sight-mark-results';
    const response = await client.get<SightMarkResult[] | { sightMarkResults: SightMarkResult[] }>(url);
    const raw = response.data as any;
    return Array.isArray(raw) ? raw : (raw?.sightMarkResults ?? raw?.results ?? []);
  },
  async createResult(sightMarkId: string, data: Partial<SightMarkResult>): Promise<SightMarkResult> {
    const response = await client.post<{ sightMarkResult: SightMarkResult } | SightMarkResult>('/sight-mark-results', {
      ...data,
      sightMarkId,
    });
    const raw = response.data as any;
    return raw?.sightMarkResult ?? raw;
  },
  async deleteResult(id: string): Promise<void> {
    await client.delete(`/sight-mark-results/${id}`);
  },

  async calculateBallistics(data: AimDistanceMark): Promise<CalculatedMarks> {
    const response = await client.post<CalculatedMarks>('/ballistics/calculate', data);
    return response.data;
  },
  async calculateSightMarks(data: SightMarkCalc): Promise<MarksResult> {
    const response = await client.post<MarksResult>('/sight-marks/calculate', data);
    return response.data;
  },
};
