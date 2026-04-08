/**
 * Public profile model for searching archers
 */
export interface PublicProfile {
  id: string;
  name: string | null;
  club?: string | null;
  image?: string | null;
  skytternr?: string | null;
  stats?: {
    totalArrows: number;
    avgScorePerArrow: number | null;
  } | null;
  achievementCount?: number | null;
}
