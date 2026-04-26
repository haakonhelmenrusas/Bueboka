import { ACHIEVEMENTS } from '../definitions';
import type { AchievementRequirement } from '@/types/Achievement';

// All valid requirement types defined in the AchievementRequirement type
const VALID_REQUIREMENT_TYPES: AchievementRequirement['type'][] = [
  'PRACTICE_COUNT',
  'ARROW_COUNT',
  'STREAK_DAYS',
  'SCORE_AVERAGE',
  'PERFECT_END',
  'COMPETITION_COUNT',
  'COMPETITION_WIN',
  'CATEGORY_PRACTICE',
  'ALL_CATEGORIES',
  'EQUIPMENT_COUNT',
  'HIGH_SCORE',
  'ARROWS_IN_SESSION',
  'WEATHER_CONDITION',
  'EARLY_BIRD',
  'NIGHT_OWL',
  'BOW_TYPE_COUNT',
  'BOW_TYPE_PRACTICES',
  'BOW_TYPE_ARROWS',
];

const VALID_CATEGORIES = ['MILESTONE', 'STREAK', 'PERFORMANCE', 'COMPETITION', 'DEDICATION', 'EXPLORATION', 'SPECIAL'];
const VALID_RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
const VALID_TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
const VALID_COMPARATORS = ['EQUALS', 'GREATER_THAN', 'LESS_THAN', 'GREATER_OR_EQUAL'];

// ── Structural integrity ──────────────────────────────────────────────────────

describe('ACHIEVEMENTS definitions array', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(ACHIEVEMENTS)).toBe(true);
    expect(ACHIEVEMENTS.length).toBeGreaterThan(0);
  });

  it('every achievement has a non-empty id', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(typeof a.id).toBe('string');
      expect(a.id.trim().length).toBeGreaterThan(0);
    });
  });

  it('all achievement ids are unique', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('every achievement has a non-empty name', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(typeof a.name).toBe('string');
      expect(a.name.trim().length).toBeGreaterThan(0);
    });
  });

  it('every achievement has a non-empty description', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(typeof a.description).toBe('string');
      expect(a.description.trim().length).toBeGreaterThan(0);
    });
  });

  it('every achievement has a valid category', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(VALID_CATEGORIES).toContain(a.category);
    });
  });

  it('every achievement has a valid rarity', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(VALID_RARITIES).toContain(a.rarity);
    });
  });

  it('every optional tier is valid when present', () => {
    ACHIEVEMENTS.forEach((a) => {
      if (a.tier !== undefined) {
        expect(VALID_TIERS).toContain(a.tier);
      }
    });
  });

  it('every achievement has a non-empty icon name', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(typeof a.icon).toBe('string');
      expect(a.icon.trim().length).toBeGreaterThan(0);
    });
  });

  it('every achievement has a positive points value', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(typeof a.points).toBe('number');
      expect(a.points).toBeGreaterThan(0);
    });
  });

  it('every achievement has a requirements object', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(a.requirements).toBeDefined();
      expect(typeof a.requirements).toBe('object');
    });
  });

  it('every requirement has a valid type', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(VALID_REQUIREMENT_TYPES).toContain(a.requirements.type);
    });
  });

  it('every requirement has a value', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(a.requirements.value).toBeDefined();
    });
  });

  it('every optional comparator is valid when present', () => {
    ACHIEVEMENTS.forEach((a) => {
      if (a.requirements.comparator !== undefined) {
        expect(VALID_COMPARATORS).toContain(a.requirements.comparator);
      }
    });
  });
});

// ── Specific achievement spot-checks ─────────────────────────────────────────

describe('ACHIEVEMENTS specific entries', () => {
  it('includes a first-practice milestone', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'first-practice');
    expect(a).toBeDefined();
    expect(a!.requirements.type).toBe('PRACTICE_COUNT');
    expect(a!.requirements.value).toBe(1);
  });

  it('includes a perfect-end performance achievement', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'perfect-end');
    expect(a).toBeDefined();
    expect(a!.requirements.type).toBe('PERFECT_END');
    expect(a!.category).toBe('PERFORMANCE');
  });

  it('includes a first-competition achievement', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'first-competition');
    expect(a).toBeDefined();
    expect(a!.requirements.type).toBe('COMPETITION_COUNT');
  });

  it('includes a competition-winner achievement', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'competition-winner');
    expect(a).toBeDefined();
    expect(a!.requirements.type).toBe('COMPETITION_WIN');
    expect(a!.rarity).toBe('EPIC');
  });

  it('includes weather-warrior with metadata listing RAIN and WIND', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'weather-warrior');
    expect(a).toBeDefined();
    expect(a!.requirements.metadata?.conditions).toContain('RAIN');
    expect(a!.requirements.metadata?.conditions).toContain('WIND');
  });

  it('all-categories requires EQUALS comparator with value 4', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'all-categories');
    expect(a).toBeDefined();
    expect(a!.requirements.comparator).toBe('EQUALS');
    expect(a!.requirements.value).toBe(4);
  });

  it('CATEGORY_PRACTICE achievements include all four categories', () => {
    const categoryAchievements = ACHIEVEMENTS.filter((a) => a.requirements.type === 'CATEGORY_PRACTICE');
    const categories = categoryAchievements.map((a) => a.requirements.metadata?.category);
    expect(categories).toContain('SKIVE_INDOOR');
    expect(categories).toContain('SKIVE_OUTDOOR');
    expect(categories).toContain('JAKT_3D');
    expect(categories).toContain('FELT');
  });

  it('BOW_TYPE_PRACTICES achievements cover RECURVE, COMPOUND, LONGBOW, BAREBOW, HORSEBOW, TRADITIONAL', () => {
    const bowPracticeAchievements = ACHIEVEMENTS.filter((a) => a.requirements.type === 'BOW_TYPE_PRACTICES');
    const bowTypes = bowPracticeAchievements.map((a) => a.requirements.metadata?.bowType);
    expect(bowTypes).toContain('RECURVE');
    expect(bowTypes).toContain('COMPOUND');
    expect(bowTypes).toContain('LONGBOW');
    expect(bowTypes).toContain('BAREBOW');
    expect(bowTypes).toContain('HORSEBOW');
    expect(bowTypes).toContain('TRADITIONAL');
  });

  it('each CATEGORY_PRACTICE achievement has a metadata.category field', () => {
    ACHIEVEMENTS.filter((a) => a.requirements.type === 'CATEGORY_PRACTICE').forEach((a) => {
      expect(a.requirements.metadata?.category).toBeTruthy();
    });
  });

  it('each BOW_TYPE_PRACTICES achievement has a metadata.bowType field', () => {
    ACHIEVEMENTS.filter((a) => a.requirements.type === 'BOW_TYPE_PRACTICES').forEach((a) => {
      expect(a.requirements.metadata?.bowType).toBeTruthy();
    });
  });

  it('each BOW_TYPE_ARROWS achievement has a metadata.bowType field', () => {
    ACHIEVEMENTS.filter((a) => a.requirements.type === 'BOW_TYPE_ARROWS').forEach((a) => {
      expect(a.requirements.metadata?.bowType).toBeTruthy();
    });
  });
});
