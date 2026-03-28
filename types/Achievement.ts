/**
 * Achievement System Types
 * Ported from web app
 */

export type AchievementCategory =
  | 'MILESTONE' // One-time achievements (first practice, 100 practices)
  | 'STREAK' // Consistency achievements (7-day streak, 30-day streak)
  | 'PERFORMANCE' // Score/skill achievements (perfect end, high average)
  | 'COMPETITION' // Competition-specific achievements (first competition, podium)
  | 'DEDICATION' // Long-term commitment (arrows shot, time invested)
  | 'EXPLORATION' // Trying new things (all categories, different equipment)
  | 'SPECIAL'; // Rare/seasonal achievements

export type AchievementRarity =
  | 'COMMON' // 50%+ users achieve
  | 'UNCOMMON' // 25-50% users achieve
  | 'RARE' // 10-25% users achieve
  | 'EPIC' // 5-10% users achieve
  | 'LEGENDARY'; // <5% users achieve

export type AchievementTier =
  | 'BRONZE' // Entry level
  | 'SILVER' // Intermediate
  | 'GOLD' // Advanced
  | 'PLATINUM' // Expert
  | 'DIAMOND'; // Master

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  tier?: AchievementTier;
  icon: string; // Icon name mapped to FontAwesome icon
  points: number;
  requirements: AchievementRequirement;
  unlockedAt?: Date;
  progress?: number; // 0-100 percentage
}

export interface AchievementRequirement {
  type:
    | 'PRACTICE_COUNT'
    | 'ARROW_COUNT'
    | 'STREAK_DAYS'
    | 'SCORE_AVERAGE'
    | 'PERFECT_END'
    | 'COMPETITION_COUNT'
    | 'COMPETITION_WIN'
    | 'CATEGORY_PRACTICE'
    | 'ALL_CATEGORIES'
    | 'EQUIPMENT_COUNT'
    | 'HIGH_SCORE'
    | 'ARROWS_IN_SESSION'
    | 'WEATHER_CONDITION'
    | 'EARLY_BIRD'
    | 'NIGHT_OWL'
    | 'BOW_TYPE_COUNT'
    | 'BOW_TYPE_PRACTICES'
    | 'BOW_TYPE_ARROWS';

  value: number | string | boolean;
  comparator?: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_OR_EQUAL';
  metadata?: Record<string, any>;
}

export interface AchievementProgress {
  achievement: Achievement;
  current: number;
  required: number;
  percentage: number;
  isUnlocked: boolean;
}

export interface AchievementSummary {
  totalUnlocked: number;
  totalPoints: number;
  totalAchievements: number;
  completionPercentage: number;
}

export interface AchievementData {
  achievements: AchievementProgress[];
  summary: AchievementSummary;
}

export type FilterStatus = 'all' | 'unlocked' | 'locked';
export type FilterCategory = 'all' | AchievementCategory;
export type FilterRarity = 'all' | AchievementRarity;
