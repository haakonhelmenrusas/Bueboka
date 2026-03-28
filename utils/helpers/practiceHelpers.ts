import { Practice, PracticeCardItem } from '@/types';

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
