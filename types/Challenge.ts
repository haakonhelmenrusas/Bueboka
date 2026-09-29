import type { User } from './User';
import type { RoundType } from './Practice';

/**
 * Challenge status enum
 */
export enum ChallengeStatus {
  PENDING = 'PENDING',      // Waiting for response
  ACCEPTED = 'ACCEPTED',    // Both users accepted
  DECLINED = 'DECLINED',    // Declined by challenged user
  COMPLETED = 'COMPLETED',  // Both users submitted scores
  CANCELLED = 'CANCELLED',  // Cancelled by challenger
}

/**
 * Challenge model - represents a 1v1 competition between archers
 */
export interface Challenge {
  id: string;
  challengerId: string;
  challengedId: string;
  name: string;
  description?: string | null;
  roundTypeId?: string | null;
  customRules?: ChallengeCustomRules | null;
  startDate?: string | null;
  endDate?: string | null;
  status: ChallengeStatus;
  winnerId?: string | null;
  challengerScore?: number | null;
  challengedScore?: number | null;
  challengerTotalArrows?: number | null;
  challengedTotalArrows?: number | null;
  challengerSubmittedAt?: string | null;
  challengedSubmittedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  // Optional populated relations
  challenger?: User;
  challenged?: User;
  winner?: User;
  roundType?: RoundType;
}

/**
 * Custom rules for a challenge (used when not using a predefined round type)
 */
export interface ChallengeCustomRules {
  distanceMeters?: number | null;
  distanceFrom?: number | null;
  distanceTo?: number | null;
  targetType?: string | null;
  targetSizeCm?: number | null;
  numberArrows?: number | null;
  arrowsWithoutScore?: number | null;
}

/**
 * Input data for creating a new challenge
 */
export interface CreateChallengeData {
  challengedId: string;
  name: string;
  description?: string;
  roundTypeId?: string;
  customRules?: ChallengeCustomRules;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Input data for updating a challenge
 */
export interface UpdateChallengeData {
  name?: string;
  description?: string | null;
  roundTypeId?: string | null;
  customRules?: ChallengeCustomRules | null;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: ChallengeStatus;
}

/**
 * Input data for submitting challenge results
 */
export interface SubmitChallengeResultData {
  score: number;
  totalArrows?: number;
}

/**
 * Challenge with additional metadata for listings
 */
export interface ChallengeListItem {
  id: string;
  challengerId: string;
  challengedId: string;
  name: string;
  status: ChallengeStatus;
  challengerName?: string | null;
  challengedName?: string | null;
  challengerScore?: number | null;
  challengedScore?: number | null;
  winnerId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated response for challenge listings
 */
export interface ChallengeListResponse {
  challenges: ChallengeListItem[];
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Challenge statistics for a user
 */
export interface ChallengeStatistics {
  totalChallenges: number;
  wins: number;
  losses: number;
  winRate: number;
  pendingChallenges: number;
  completedChallenges: number;
}
