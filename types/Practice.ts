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
 * Practice category enum matching backend Prisma schema
 */
export enum PracticeCategory {
  SKIVE_INDOOR = 'SKIVE_INDOOR',
  SKIVE_OUTDOOR = 'SKIVE_OUTDOOR',
  JAKT_3D = 'JAKT_3D',
  FELT = 'FELT',
}

/**
 * End model - represents a single end/round within a practice session
 */
export interface End {
  id: string;
  practiceId: string;
  arrows?: number;
  arrowsWithoutScore?: number;
  scores: number[];
  roundScore?: number;
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
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
  distanceMeters?: number;
  targetType?: any;
  numberArrows?: number;
  arrowsWithoutScore?: number;
  roundScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Practice model matching backend Prisma schema
 */
export interface Practice {
  id: string;
  userId?: string;
  date: Date;
  notes?: string;
  totalScore: number;
  rating?: number;
  location?: string;
  environment: Environment;
  weather?: WeatherCondition[];
  practiceCategory?: PracticeCategory;
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
