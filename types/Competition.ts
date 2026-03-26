import type { Bow } from './Bow';
import type { Arrows } from './ArrowSet';
import { Environment, WeatherCondition, PracticeCategory } from './Practice';

export interface CompetitionRound {
  id: string;
  competitionId: string;
  roundNumber: number;
  arrows: number | null;
  arrowsWithoutScore: number | null;
  roundScore: number | null;
  distanceMeters: number | null;
  distanceFrom: number | null;
  distanceTo: number | null;
  targetType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Competition {
  id: string;
  userId: string;
  date: string;
  name: string;
  location: string | null;
  organizerName: string | null;
  environment: Environment;
  weather: WeatherCondition[];
  practiceCategory: PracticeCategory;
  notes: string | null;
  placement: number | null;
  numberOfParticipants: number | null;
  personalBest: boolean | null;
  totalScore: number;
  bowId: string | null;
  arrowsId: string | null;
  rounds: CompetitionRound[];
  bow?: Bow;
  arrows?: Arrows;
  createdAt: string;
  updatedAt: string;
}

