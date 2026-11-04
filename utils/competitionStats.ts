import type { Competition, CompetitionStats } from '@/types';

const startOfDay = (d: Date): number => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
};

const toTime = (date: string): number => new Date(date).getTime();

/**
 * A competition is active when its date is today or in the future.
 */
export function isActiveCompetition(competition: Competition, now: Date = new Date()): boolean {
  return toTime(competition.date) >= startOfDay(now);
}

/**
 * Splits competitions into active (today or later, soonest first) and
 * past (before today, most recent first).
 */
export function splitCompetitions(
  competitions: Competition[],
  now: Date = new Date(),
): { active: Competition[]; past: Competition[] } {
  const active: Competition[] = [];
  const past: Competition[] = [];

  for (const competition of competitions) {
    (isActiveCompetition(competition, now) ? active : past).push(competition);
  }

  active.sort((a, b) => toTime(a.date) - toTime(b.date));
  past.sort((a, b) => toTime(b.date) - toTime(a.date));

  return { active, past };
}

/**
 * Computes overview statistics for a list of competitions.
 */
export function computeCompetitionStats(competitions: Competition[], now: Date = new Date()): CompetitionStats {
  const placements = competitions.map((c) => c.placement).filter((p): p is number => p != null);
  const scores = competitions.map((c) => c.totalScore);

  const averageScore =
    scores.length > 0 ? Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 10) / 10 : null;

  return {
    total: competitions.length,
    active: competitions.filter((c) => isActiveCompetition(c, now)).length,
    podiums: placements.filter((p) => p <= 3).length,
    personalBests: competitions.filter((c) => c.personalBest === true).length,
    bestPlacement: placements.length > 0 ? Math.min(...placements) : null,
    averageScore,
  };
}
