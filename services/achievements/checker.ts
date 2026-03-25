import { AchievementProgress, AchievementRequirement } from '@/types/Achievement';
import { ACHIEVEMENTS } from './definitions';
import { Practice } from '@/types';

interface UserStats {
  totalPractices: number;
  totalCompetitions: number;
  totalArrows: number;
  currentStreak: number;
  practicesByCategory: Record<string, number>;
  hasCompetitionWin?: boolean;
  bowTypesUsed: Set<string>;
  practicesByBowType: Record<string, number>;
  arrowsByBowType: Record<string, number>;
}

export function calculateUserStats(practices: Practice[]): UserStats {
  const stats: UserStats = {
    totalPractices: practices.length,
    totalCompetitions: 0,
    totalArrows: 0,
    currentStreak: 0,
    practicesByCategory: {
      SKIVE_INDOOR: 0,
      SKIVE_OUTDOOR: 0,
      JAKT_3D: 0,
      FELT: 0,
    },
    bowTypesUsed: new Set<string>(),
    practicesByBowType: {},
    arrowsByBowType: {},
  };

  practices.forEach((practice) => {
    let practiceArrows = 0;

    if (practice.ends && Array.isArray(practice.ends)) {
      practiceArrows = practice.ends.reduce((sum, end) => sum + (end.arrows ?? 0), 0);
      stats.totalArrows += practiceArrows;
    }

    if (practice.practiceCategory && Object.prototype.hasOwnProperty.call(stats.practicesByCategory, practice.practiceCategory)) {
      stats.practicesByCategory[practice.practiceCategory]++;
    }

    const bowType = practice.bow?.type;
    if (bowType) {
      stats.bowTypesUsed.add(bowType);
      stats.practicesByBowType[bowType] = (stats.practicesByBowType[bowType] || 0) + 1;
      stats.arrowsByBowType[bowType] = (stats.arrowsByBowType[bowType] || 0) + practiceArrows;
    }
  });

  stats.currentStreak = calculateStreak(practices);
  return stats;
}

export function calculateStreak(practices: Practice[]): number {
  if (practices.length === 0) return 0;

  const sortedPractices = [...practices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const uniqueDates = new Set(sortedPractices.map((p) => new Date(p.date).toISOString().split('T')[0]));
  const dates = Array.from(uniqueDates).sort((a, b) => b.localeCompare(a));

  if (dates.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const current = new Date(dates[i]);
    const prev = new Date(dates[i - 1]);
    const diffDays = Math.round((prev.getTime() - current.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function compareValues(current: number, required: number, comparator: string): boolean {
  switch (comparator) {
    case 'EQUALS':
      return current === required;
    case 'GREATER_THAN':
      return current > required;
    case 'LESS_THAN':
      return current < required;
    case 'GREATER_OR_EQUAL':
    default:
      return current >= required;
  }
}

function checkRequirement(
  requirement: AchievementRequirement,
  stats: UserStats,
  practices: Practice[],
): { isMet: boolean; current: number; required: number } {
  const { type, value, comparator = 'GREATER_OR_EQUAL', metadata } = requirement;
  let current = 0;
  let required = typeof value === 'number' ? value : 0;
  let isMet = false;

  switch (type) {
    case 'PRACTICE_COUNT':
      current = stats.totalPractices;
      required = value as number;
      isMet = compareValues(current, required, comparator);
      break;

    case 'ARROW_COUNT':
      current = stats.totalArrows;
      required = value as number;
      isMet = compareValues(current, required, comparator);
      break;

    case 'STREAK_DAYS':
      current = stats.currentStreak;
      required = value as number;
      isMet = compareValues(current, required, comparator);
      break;

    case 'COMPETITION_COUNT':
      current = stats.totalCompetitions;
      required = value as number;
      isMet = compareValues(current, required, comparator);
      break;

    case 'PERFECT_END':
      isMet = practices.some((p) =>
        p.ends?.some(
          (end) => end.scores && Array.isArray(end.scores) && end.scores.length > 0 && end.scores.every((score) => score === 10),
        ),
      );
      current = isMet ? 1 : 0;
      required = 1;
      break;

    case 'ARROWS_IN_SESSION': {
      current = Math.max(...practices.map((p) => p.ends?.reduce((sum, end) => sum + (end.arrows ?? 0), 0) || 0), 0);
      required = value as number;
      isMet = compareValues(current, required, comparator);
      break;
    }

    case 'CATEGORY_PRACTICE': {
      const category = metadata?.category;
      if (category && stats.practicesByCategory[category] !== undefined) {
        current = stats.practicesByCategory[category];
        required = value as number;
        isMet = compareValues(current, required, comparator);
      }
      break;
    }

    case 'ALL_CATEGORIES': {
      current = Object.values(stats.practicesByCategory).filter((count) => count > 0).length;
      required = value as number;
      isMet = compareValues(current, required, comparator);
      break;
    }

    case 'COMPETITION_WIN':
      isMet = stats.hasCompetitionWin || false;
      current = isMet ? 1 : 0;
      required = 1;
      break;

    case 'WEATHER_CONDITION': {
      const targetConditions = metadata?.conditions || [];
      isMet = practices.some((p) => p.weather && Array.isArray(p.weather) && p.weather.some((w) => targetConditions.includes(w)));
      current = isMet ? 1 : 0;
      required = 1;
      break;
    }

    case 'EARLY_BIRD':
    case 'NIGHT_OWL':
      isMet = false;
      current = 0;
      required = 1;
      break;

    case 'BOW_TYPE_COUNT':
      current = stats.bowTypesUsed.size;
      required = value as number;
      isMet = compareValues(current, required, comparator);
      break;

    case 'BOW_TYPE_PRACTICES': {
      const bowType = metadata?.bowType;
      if (bowType) {
        current = stats.practicesByBowType[bowType] || 0;
        required = value as number;
        isMet = compareValues(current, required, comparator);
      }
      break;
    }

    case 'BOW_TYPE_ARROWS': {
      const bowType = metadata?.bowType;
      if (bowType) {
        current = stats.arrowsByBowType[bowType] || 0;
        required = value as number;
        isMet = compareValues(current, required, comparator);
      }
      break;
    }

    default:
      break;
  }

  return { isMet, current, required };
}

export function checkAllAchievements(
  practices: Practice[],
  unlockedAchievementIds: string[] = [],
  autoUnlock = false,
): AchievementProgress[] {
  const stats = calculateUserStats(practices);

  return ACHIEVEMENTS.map((achievement) => {
    const isUnlocked = unlockedAchievementIds.includes(achievement.id);
    const { isMet, current, required } = checkRequirement(achievement.requirements, stats, practices);
    const percentage = required > 0 ? Math.min(100, Math.round((current / required) * 100)) : 0;

    return {
      achievement,
      current,
      required,
      percentage,
      isUnlocked: autoUnlock ? isUnlocked || isMet : isUnlocked,
    };
  });
}
