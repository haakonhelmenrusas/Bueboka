import { Bow } from './Bow';
import { Arrows } from './ArrowSet';

/**
 * Environment enum matching backend Prisma schema
 */
export enum Environment {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
}

/**
 * Weather condition enum matching backend Prisma schema
 */
export enum WeatherCondition {
  SUN = 'SUN',
  CLOUDED = 'CLOUDED',
  CLEAR = 'CLEAR',
  RAIN = 'RAIN',
  WIND = 'WIND',
  SNOW = 'SNOW',
  FOG = 'FOG',
  THUNDER = 'THUNDER',
  CHANGING_CONDITIONS = 'CHANGING_CONDITIONS',
  OTHER = 'OTHER',
}

/**
 * End model - represents a single end/round within a practice session
 */
export interface End {
  id: string;
  practiceId: string;
  arrows: number;
  scores: number[];
  distanceMeters?: number;
  targetSizeCm?: number;
  arrowsPerEnd?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Round type model - predefined archery round configurations
 */
export interface RoundType {
  id: string;
  name: string;
  environment: Environment;
  distanceMeters?: number;
  targetSizeCm?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Practice model matching backend Prisma schema (was Training in mobile app)
 */
export interface Practice {
  id: string;
  userId?: string;
  date: Date;
  notes?: string;
  totalScore: number;
  location?: string;
  environment: Environment;
  weather?: WeatherCondition[];
  roundTypeId?: string;
  bowId?: string;
  arrowsId?: string;
  ends?: End[];
  createdAt?: Date;
  updatedAt?: Date;

  // Optional populated relations (when fetched with includes)
  bow?: Bow;
  arrows?: Arrows;
  roundType?: RoundType;
}
