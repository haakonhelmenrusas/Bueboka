import { calculateUserStats, calculateStreak, checkAllAchievements } from './checker';
import { Practice, Environment, WeatherCondition, PracticeCategory } from '@/types';
import { BowType } from '@/types';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
const fourDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0];

function makePractice(overrides: Partial<Practice> = {}): Practice {
  return {
    id: 'p1',
    userId: 'u1',
    date: today,
    notes: null,
    totalScore: 0,
    rating: null,
    location: null,
    environment: Environment.OUTDOOR,
    weather: [],
    practiceCategory: PracticeCategory.SKIVE_OUTDOOR,
    roundTypeId: null,
    bowId: null,
    arrowsId: null,
    ends: [],
    createdAt: today,
    updatedAt: today,
    ...overrides,
  };
}

function makeEnd(arrows: number, scores: number[] = []): Practice['ends'][number] {
  return {
    id: 'e1',
    practiceId: 'p1',
    arrows,
    arrowsWithoutScore: null,
    scores,
    roundScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) : null,
    distanceMeters: null,
    distanceFrom: null,
    distanceTo: null,
    targetSizeCm: null,
    targetType: null,
    arrowsPerEnd: null,
    createdAt: today,
    updatedAt: today,
  };
}

describe('calculateUserStats', () => {
  it('returns zero stats for empty practice list', () => {
    const stats = calculateUserStats([]);
    expect(stats.totalPractices).toBe(0);
    expect(stats.totalArrows).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.bowTypesUsed.size).toBe(0);
  });

  it('counts total practices', () => {
    const practices = [makePractice({ id: 'p1' }), makePractice({ id: 'p2' }), makePractice({ id: 'p3' })];
    const stats = calculateUserStats(practices);
    expect(stats.totalPractices).toBe(3);
  });

  it('sums arrows across all ends', () => {
    const practice = makePractice({
      ends: [makeEnd(6), makeEnd(6), makeEnd(3)],
    });
    const stats = calculateUserStats([practice]);
    expect(stats.totalArrows).toBe(15);
  });

  it('sums arrows across multiple practices', () => {
    const practices = [makePractice({ id: 'p1', ends: [makeEnd(10)] }), makePractice({ id: 'p2', ends: [makeEnd(5), makeEnd(5)] })];
    const stats = calculateUserStats(practices);
    expect(stats.totalArrows).toBe(20);
  });

  it('counts practices by category', () => {
    const practices = [
      makePractice({ id: 'p1', practiceCategory: PracticeCategory.SKIVE_INDOOR }),
      makePractice({ id: 'p2', practiceCategory: PracticeCategory.SKIVE_INDOOR }),
      makePractice({ id: 'p3', practiceCategory: PracticeCategory.JAKT_3D }),
    ];
    const stats = calculateUserStats(practices);
    expect(stats.practicesByCategory['SKIVE_INDOOR']).toBe(2);
    expect(stats.practicesByCategory['JAKT_3D']).toBe(1);
    expect(stats.practicesByCategory['FELT']).toBe(0);
  });

  it('tracks unique bow types used', () => {
    const practices = [
      makePractice({
        id: 'p1',
        bow: {
          id: 'b1',
          userId: 'u1',
          name: 'A',
          type: BowType.RECURVE,
          eyeToNock: null,
          aimMeasure: null,
          eyeToSight: null,
          limbs: null,
          riser: null,
          handOrientation: null,
          drawWeight: null,
          bowLength: null,
          notes: null,
          isFavorite: false,
          createdAt: today,
          updatedAt: today,
        },
      }),
      makePractice({
        id: 'p2',
        bow: {
          id: 'b2',
          userId: 'u1',
          name: 'B',
          type: BowType.COMPOUND,
          eyeToNock: null,
          aimMeasure: null,
          eyeToSight: null,
          limbs: null,
          riser: null,
          handOrientation: null,
          drawWeight: null,
          bowLength: null,
          notes: null,
          isFavorite: false,
          createdAt: today,
          updatedAt: today,
        },
      }),
      makePractice({
        id: 'p3',
        bow: {
          id: 'b3',
          userId: 'u1',
          name: 'C',
          type: BowType.RECURVE,
          eyeToNock: null,
          aimMeasure: null,
          eyeToSight: null,
          limbs: null,
          riser: null,
          handOrientation: null,
          drawWeight: null,
          bowLength: null,
          notes: null,
          isFavorite: false,
          createdAt: today,
          updatedAt: today,
        },
      }),
    ];
    const stats = calculateUserStats(practices);
    expect(stats.bowTypesUsed.size).toBe(2);
    expect(stats.practicesByBowType['RECURVE']).toBe(2);
    expect(stats.practicesByBowType['COMPOUND']).toBe(1);
  });

  it('counts arrows per bow type', () => {
    const recurveBow = {
      id: 'b1',
      userId: 'u1',
      name: 'R',
      type: BowType.RECURVE,
      eyeToNock: null,
      aimMeasure: null,
      eyeToSight: null,
      limbs: null,
      riser: null,
      handOrientation: null,
      drawWeight: null,
      bowLength: null,
      notes: null,
      isFavorite: false,
      createdAt: today,
      updatedAt: today,
    };
    const practice = makePractice({ ends: [makeEnd(12)], bow: recurveBow });
    const stats = calculateUserStats([practice]);
    expect(stats.arrowsByBowType['RECURVE']).toBe(12);
  });
});

describe('calculateStreak', () => {
  it('returns 0 for empty list', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 1 for a single practice today', () => {
    expect(calculateStreak([makePractice({ date: today })])).toBe(1);
  });

  it('returns 1 for a single practice yesterday', () => {
    expect(calculateStreak([makePractice({ date: yesterday })])).toBe(1);
  });

  it('returns 0 when most recent practice is older than yesterday', () => {
    expect(calculateStreak([makePractice({ date: twoDaysAgo })])).toBe(0);
  });

  it('counts consecutive days', () => {
    const practices = [
      makePractice({ id: 'p1', date: today }),
      makePractice({ id: 'p2', date: yesterday }),
      makePractice({ id: 'p3', date: twoDaysAgo }),
    ];
    expect(calculateStreak(practices)).toBe(3);
  });

  it('stops streak at a gap', () => {
    const practices = [
      makePractice({ id: 'p1', date: today }),
      makePractice({ id: 'p2', date: yesterday }),
      makePractice({ id: 'p3', date: fourDaysAgo }),
    ];
    expect(calculateStreak(practices)).toBe(2);
  });

  it('deduplicates multiple practices on the same day', () => {
    const practices = [
      makePractice({ id: 'p1', date: today }),
      makePractice({ id: 'p2', date: today }),
      makePractice({ id: 'p3', date: yesterday }),
    ];
    expect(calculateStreak(practices)).toBe(2);
  });
});

describe('checkAllAchievements', () => {
  it('returns an entry for every defined achievement', () => {
    const { ACHIEVEMENTS } = require('./definitions');
    const result = checkAllAchievements([]);
    expect(result).toHaveLength(ACHIEVEMENTS.length);
  });

  it('marks no achievements as unlocked for an empty list with no unlocked IDs', () => {
    const result = checkAllAchievements([]);
    expect(result.every((r) => !r.isUnlocked)).toBe(true);
  });

  describe('PRACTICE_COUNT achievements', () => {
    it('unlocks first-practice after 1 practice with autoUnlock', () => {
      const result = checkAllAchievements([makePractice()], [], true);
      const entry = result.find((r) => r.achievement.id === 'first-practice')!;
      expect(entry.isUnlocked).toBe(true);
      expect(entry.percentage).toBe(100);
    });

    it('does not unlock first-practice without autoUnlock', () => {
      const result = checkAllAchievements([makePractice()], [], false);
      const entry = result.find((r) => r.achievement.id === 'first-practice')!;
      expect(entry.isUnlocked).toBe(false);
    });

    it('respects pre-unlocked IDs from database', () => {
      const result = checkAllAchievements([], ['first-practice']);
      const entry = result.find((r) => r.achievement.id === 'first-practice')!;
      expect(entry.isUnlocked).toBe(true);
    });

    it('calculates correct progress percentage for practices-10', () => {
      const practices = Array.from({ length: 5 }, (_, i) => makePractice({ id: `p${i}` }));
      const result = checkAllAchievements(practices);
      const entry = result.find((r) => r.achievement.id === 'practices-10')!;
      expect(entry.current).toBe(5);
      expect(entry.required).toBe(10);
      expect(entry.percentage).toBe(50);
    });
  });

  describe('ARROW_COUNT achievements', () => {
    it('unlocks arrows-1000 when enough arrows are shot', () => {
      const practice = makePractice({ ends: [makeEnd(1000)] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'arrows-1000')!;
      expect(entry.isUnlocked).toBe(true);
    });

    it('does not unlock arrows-1000 with insufficient arrows', () => {
      const practice = makePractice({ ends: [makeEnd(500)] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'arrows-1000')!;
      expect(entry.isUnlocked).toBe(false);
      expect(entry.percentage).toBe(50);
    });
  });

  describe('PERFECT_END achievement', () => {
    it('unlocks perfect-end when all scores are 10', () => {
      const practice = makePractice({ ends: [makeEnd(3, [10, 10, 10])] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'perfect-end')!;
      expect(entry.isUnlocked).toBe(true);
    });

    it('does not unlock perfect-end when scores are mixed', () => {
      const practice = makePractice({ ends: [makeEnd(3, [10, 9, 10])] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'perfect-end')!;
      expect(entry.isUnlocked).toBe(false);
    });

    it('does not unlock perfect-end when scores array is empty', () => {
      const practice = makePractice({ ends: [makeEnd(3, [])] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'perfect-end')!;
      expect(entry.isUnlocked).toBe(false);
    });
  });

  describe('ARROWS_IN_SESSION achievement', () => {
    it('unlocks big-session when a single practice has 200+ arrows', () => {
      const practice = makePractice({ ends: [makeEnd(200)] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'big-session')!;
      expect(entry.isUnlocked).toBe(true);
    });

    it('does not unlock big-session when arrows are split across practices', () => {
      const practices = [makePractice({ id: 'p1', ends: [makeEnd(100)] }), makePractice({ id: 'p2', ends: [makeEnd(100)] })];
      const result = checkAllAchievements(practices, [], true);
      const entry = result.find((r) => r.achievement.id === 'big-session')!;
      expect(entry.isUnlocked).toBe(false);
    });
  });

  describe('WEATHER_CONDITION achievement', () => {
    it('unlocks weather-warrior when practiced in rain', () => {
      const practice = makePractice({ weather: [WeatherCondition.RAIN] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'weather-warrior')!;
      expect(entry.isUnlocked).toBe(true);
    });

    it('unlocks weather-warrior when practiced in wind', () => {
      const practice = makePractice({ weather: [WeatherCondition.WIND] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'weather-warrior')!;
      expect(entry.isUnlocked).toBe(true);
    });

    it('does not unlock weather-warrior in clear conditions', () => {
      const practice = makePractice({ weather: [WeatherCondition.SUN] });
      const result = checkAllAchievements([practice], [], true);
      const entry = result.find((r) => r.achievement.id === 'weather-warrior')!;
      expect(entry.isUnlocked).toBe(false);
    });
  });

  describe('BOW_TYPE achievements', () => {
    function bowPractice(id: string, type: BowType): Practice {
      return makePractice({
        id,
        bow: {
          id: `b-${id}`,
          userId: 'u1',
          name: type,
          type,
          eyeToNock: null,
          aimMeasure: null,
          eyeToSight: null,
          limbs: null,
          riser: null,
          handOrientation: null,
          drawWeight: null,
          bowLength: null,
          notes: null,
          isFavorite: false,
          createdAt: today,
          updatedAt: today,
        },
      });
    }

    it('unlocks bow-diversity when 2 bow types are used', () => {
      const practices = [bowPractice('p1', BowType.RECURVE), bowPractice('p2', BowType.COMPOUND)];
      const result = checkAllAchievements(practices, [], true);
      const entry = result.find((r) => r.achievement.id === 'bow-diversity')!;
      expect(entry.isUnlocked).toBe(true);
    });

    it('does not unlock bow-diversity with only 1 bow type', () => {
      const practices = [bowPractice('p1', BowType.RECURVE), bowPractice('p2', BowType.RECURVE)];
      const result = checkAllAchievements(practices, [], true);
      const entry = result.find((r) => r.achievement.id === 'bow-diversity')!;
      expect(entry.isUnlocked).toBe(false);
    });
  });

  describe('ALL_CATEGORIES achievement', () => {
    it('unlocks all-categories when all four categories are used', () => {
      const practices = [
        makePractice({ id: 'p1', practiceCategory: PracticeCategory.SKIVE_INDOOR }),
        makePractice({ id: 'p2', practiceCategory: PracticeCategory.SKIVE_OUTDOOR }),
        makePractice({ id: 'p3', practiceCategory: PracticeCategory.JAKT_3D }),
        makePractice({ id: 'p4', practiceCategory: PracticeCategory.FELT }),
      ];
      const result = checkAllAchievements(practices, [], true);
      const entry = result.find((r) => r.achievement.id === 'all-categories')!;
      expect(entry.isUnlocked).toBe(true);
    });

    it('does not unlock all-categories with only three categories', () => {
      const practices = [
        makePractice({ id: 'p1', practiceCategory: PracticeCategory.SKIVE_INDOOR }),
        makePractice({ id: 'p2', practiceCategory: PracticeCategory.SKIVE_OUTDOOR }),
        makePractice({ id: 'p3', practiceCategory: PracticeCategory.JAKT_3D }),
      ];
      const result = checkAllAchievements(practices, [], true);
      const entry = result.find((r) => r.achievement.id === 'all-categories')!;
      expect(entry.isUnlocked).toBe(false);
    });
  });

  describe('EARLY_BIRD and NIGHT_OWL', () => {
    it('never unlocks early-bird or night-owl (time not tracked)', () => {
      const result = checkAllAchievements([makePractice()], [], true);
      const earlyBird = result.find((r) => r.achievement.id === 'early-bird')!;
      const nightOwl = result.find((r) => r.achievement.id === 'night-owl')!;
      expect(earlyBird.isUnlocked).toBe(false);
      expect(nightOwl.isUnlocked).toBe(false);
    });
  });
});
