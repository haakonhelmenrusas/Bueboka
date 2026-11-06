import { Environment, Practice, PracticeCardItem, PracticeCategory } from '@/types';
import type { CreateEndData, CreatePracticeData } from '@/services/repositories/practiceRepository';

/**
 * Build the end payloads sent to the API from the form's round inputs.
 *
 * `numberArrows` maps to the End's `arrows` (arrows WITH score). When the user
 * entered individual arrow scores, the score count is authoritative — without
 * this, a round with 72 scored arrows but an empty "number of arrows" field
 * stored arrows=null and the card only showed the arrowsWithoutScore count.
 */
export function buildEndData(rounds: CreateEndData[]): CreateEndData[] {
  return rounds.map((r) => {
    const round: CreateEndData = { roundScore: r.roundScore ?? 0 };
    const scoredCount = r.scores?.length ?? 0;
    const numberArrows = scoredCount > 0 ? scoredCount : r.numberArrows;
    if (numberArrows !== undefined) round.numberArrows = numberArrows;
    if (r.arrowsPerEnd !== undefined) round.arrowsPerEnd = r.arrowsPerEnd;
    if (r.arrowsWithoutScore !== undefined) round.arrowsWithoutScore = r.arrowsWithoutScore;
    if (r.distanceMeters !== undefined) round.distanceMeters = r.distanceMeters;
    if (r.distanceFrom !== undefined) round.distanceFrom = r.distanceFrom;
    if (r.distanceTo !== undefined) round.distanceTo = r.distanceTo;
    if (r.targetType) round.targetType = r.targetType;
    if (r.scores && r.scores.length > 0) round.scores = r.scores;
    return round;
  });
}

/** Round setup chosen in the practice form, passed to the quick-practice screen */
export interface QuickPracticeInfo {
  distanceMeters?: number;
  distanceFrom?: number;
  distanceTo?: number;
  targetType?: string;
  targetSizeCm?: number;
  environment: Environment;
  practiceCategory: PracticeCategory;
}

/**
 * Build the payload for a quick practice (hurtigtrening): one round where the
 * user only counted arrows — all arrows are unscored (arrowsWithoutScore),
 * no scores and no round score.
 */
export function buildQuickPracticeData(arrowCount: number, info: QuickPracticeInfo): CreatePracticeData {
  const round: CreateEndData = {
    roundScore: 0,
    scores: [],
    arrowsWithoutScore: arrowCount,
  };
  if (info.distanceMeters !== undefined) round.distanceMeters = info.distanceMeters;
  if (info.distanceFrom !== undefined) round.distanceFrom = info.distanceFrom;
  if (info.distanceTo !== undefined) round.distanceTo = info.distanceTo;
  if (info.targetType) round.targetType = info.targetType;
  return {
    date: new Date().toISOString(),
    environment: info.environment,
    practiceCategory: info.practiceCategory,
    rounds: [round],
  };
}

/**
 * Convert a full Practice object to a PracticeCardItem for display in cards
 */
export function practiceToCardItem(practice: Practice): PracticeCardItem {
  // Calculate total arrows shot from ends
  const arrowsShot =
    practice.ends?.reduce((total, end) => {
      const endArrows = (end.arrows ?? 0) + (end.arrowsWithoutScore ?? 0);
      return total + endArrows;
    }, 0) ?? 0;

  // Calculate total score and arrows with score
  const totalScore = practice.ends?.reduce((sum, end) => sum + (end.roundScore ?? 0), 0) ?? null;
  const arrowsWithScore = practice.ends?.reduce((sum, end) => sum + (end.arrows ?? 0), 0) ?? null;

  // Get round type name if available
  const roundTypeName = practice.roundType?.name ?? null;

  return {
    id: practice.id,
    date: practice.date,
    arrowsShot,
    arrowsWithScore,
    location: practice.location ?? null,
    environment: practice.environment ?? null,
    rating: practice.rating ?? null,
    practiceType: 'TRENING', // Practices are always TRENING, competitions would be handled separately
    totalScore,
    roundTypeName,
    practiceCategory: practice.practiceCategory ?? null,
  };
}
