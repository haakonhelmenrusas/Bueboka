import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import type { Competition, Environment, WeatherCondition, PracticeCategory } from '@/types';

export interface CreateCompetitionRoundData {
  roundNumber: number;
  arrows?: number;
  arrowsWithoutScore?: number;
  roundScore?: number;
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
  targetType?: string;
}

export interface CreateCompetitionData {
  date: Date;
  name: string;
  location?: string;
  organizerName?: string;
  environment: Environment;
  weather?: WeatherCondition[];
  practiceCategory?: PracticeCategory;
  notes?: string;
  placement?: number;
  numberOfParticipants?: number;
  personalBest?: boolean;
  bowId?: string;
  arrowsId?: string;
  rounds?: CreateCompetitionRoundData[];
}

export type UpdateCompetitionData = Partial<CreateCompetitionData>;

export interface CompetitionListResponse {
  competitions: Competition[];
}

export const competitionRepository = {
  async getAll(): Promise<CompetitionListResponse> {
    try {
      const response = await client.get<CompetitionListResponse>('/competitions');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: string): Promise<Competition> {
    try {
      const response = await client.get<Competition>(`/competitions/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: CreateCompetitionData): Promise<Competition> {
    try {
      const response = await client.post<Competition>('/competitions', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: string, data: UpdateCompetitionData): Promise<Competition> {
    try {
      const response = await client.patch<Competition>(`/competitions/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await client.delete(`/competitions/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
