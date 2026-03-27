import { Practice, Competition, End, CompetitionRound } from '@/types';

/**
 * Calculate total arrows shot in a practice session
 */
export function calculateTotalArrows(practice: Practice | Competition): number {
  let total = 0;

  if ('ends' in practice && practice.ends) {
    practice.ends.forEach((end: End) => {
      const arrowsInEnd = end.arrows || 0;
      const arrowsWithoutScore = end.arrowsWithoutScore || 0;
      total += arrowsInEnd + arrowsWithoutScore;
    });
  }

  if ('rounds' in practice && practice.rounds) {
    practice.rounds.forEach((round: CompetitionRound) => {
      const arrowsInRound = round.arrows || 0;
      const arrowsWithoutScore = round.arrowsWithoutScore || 0;
      total += arrowsInRound + arrowsWithoutScore;
    });
  }

  return total;
}

/**
 * Calculate total score from all ends/rounds
 */
export function calculateTotalScore(practice: Practice | Competition): number {
  return practice.totalScore || 0;
}
