import client from '@/services/api/client';
import { AimDistanceMark, BowSpecification, CalculatedMarks, MarksResult, SightMark, SightMarkCalc } from '@/types';

export const sightMarksRepository = {
  // SightMarks CRUD
  async getAll(): Promise<SightMark[]> {
    const response = await client.get<SightMark[]>('/sight-marks');
    return response.data;
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
  async getSpecification(bowId: string): Promise<BowSpecification | null> {
    try {
      const response = await client.get<BowSpecification>(`/bow-specifications/${bowId}`);
      return response.data;
    } catch {
      return null;
    }
  },
  async createSpecification(data: Partial<BowSpecification>): Promise<BowSpecification> {
    try {
      const response = await client.post<BowSpecification>('/bow-specifications', data);
      return response.data;
    } catch (error: any) {
      // If specification already exists (409 Conflict), fetch and return it
      if (error.response?.status === 409 && data.bowId) {
        const existing = await this.getSpecification(data.bowId);
        if (existing) {
          return existing;
        }
      }
      throw error;
    }
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
