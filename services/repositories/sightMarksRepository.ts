import { authFetchClient as client } from '@/services/api/authFetch';
import { AimDistanceMark, CalculatedMarks, MarksResult, SightMark, SightMarkCalc, SightMarkResult } from '@/types';

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

  async getResults(sightMarkId: string): Promise<SightMarkResult[]> {
    const response = await client.get<SightMarkResult[] | { sightMarkResults: SightMarkResult[] }>(`/sight-marks/${sightMarkId}/results`);
    const raw = response.data as any;
    return Array.isArray(raw) ? raw : (raw?.sightMarkResults ?? raw?.results ?? []);
  },
  async createResult(sightMarkId: string, data: Partial<SightMarkResult>): Promise<SightMarkResult> {
    const response = await client.post<{ sightMarkResult: SightMarkResult } | SightMarkResult>(`/sight-marks/${sightMarkId}/results`, data);
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
