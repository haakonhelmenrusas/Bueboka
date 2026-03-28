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
  arrows: number | null;
  arrowsWithoutScore: number | null;
  scores: number[];
  roundScore: number | null;
  distanceMeters: number | null;
  distanceFrom: number | null;
  distanceTo: number | null;
  targetSizeCm: number | null;
  targetType: string | null;
  arrowsPerEnd: number | null;
  arrowCoordinates?: { x: number; y: number }[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Round type model - predefined archery round configurations
 */
export interface RoundType {
  id: string;
  name: string;
  distanceMeters: number | null;
  targetType: any;
  numberArrows: number | null;
  arrowsWithoutScore: number | null;
  roundScore: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Filter type for combined practice/competition card list */
export type PracticeFilter = 'all' | 'TRENING' | 'KONKURRANSE';

/**
 * Unified card item returned by the /practices/cards endpoint.
 * Represents either a training session (TRENING) or a competition (KONKURRANSE).
 */
export interface PracticeCardItem {
  id: string;
  date: string;
  arrowsShot: number;
  arrowsWithScore?: number | null;
  location: string | null;
  environment: string | null;
  rating: number | null;
  practiceType: 'TRENING' | 'KONKURRANSE';
  totalScore: number | null;
  roundTypeName: string | null;
  practiceCategory: string | null;
  /** Only present when practiceType === 'KONKURRANSE' */
  competitionName?: string;
  placement?: number | null;
}

/** Paginated response from /practices/cards */
export interface PracticeCardsResponse {
  practices: PracticeCardItem[];
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Practice model matching backend Prisma schema
 */
export interface Practice {
  id: string;
  userId: string;
  date: string;
  notes: string | null;
  totalScore: number;
  rating: number | null;
  location: string | null;
  environment: Environment;
  weather: WeatherCondition[];
  practiceCategory: PracticeCategory;
  roundTypeId: string | null;
  bowId: string | null;
  arrowsId: string | null;
  ends: End[];
  createdAt: string;
  updatedAt: string;

  // Optional populated relations (when fetched with includes)
  bow?: Bow;
  arrows?: Arrows;
  roundType?: RoundType;
}
