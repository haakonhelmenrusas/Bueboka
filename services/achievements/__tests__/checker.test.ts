/**
 * Supplemental checker tests covering requirement types and edge cases
 * not addressed in the co-located checker.test.ts.
 *
 * Covered here:
 *  - COMPETITION_COUNT
 *  - COMPETITION_WIN
 *  - CATEGORY_PRACTICE (all four categories)
 *  - STREAK_DAYS
 *  - BOW_TYPE_PRACTICES
 *  - BOW_TYPE_ARROWS
 *  - BOW_TYPE_COUNT increments (bow-collector, master-of-all-bows)
 *  - calculateUserStats edge cases (no ends, undefined ends, unknown category)
 *  - percentage clamping and zero-required guard
 */
import { calculateUserStats, calculateStreak, checkAllAchievements } from '../checker';
import { Practice, Environment, PracticeCategory } from '@/types';
import { BowType } from '@/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

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

function makeBow(type: BowType) {
  return {
    id: `bow-${type}`,
    userId: 'u1',
    name: type,
    type,
    eyeToNock: null,
    aimMeasure: null,
    eyeToSight: null,
    limbs: null,
    riser: null,
    handOrientation: null as 'RH' | 'LH' | null,
    drawWeight: null,
    bowLength: null,
    notes: null,
    isFavorite: false,
    createdAt: today,
    updatedAt: today,
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

// ── calculateUserStats – edge cases ──────────────────────────────────────────

describe('calculateUserStats – edge cases', () => {
  it('handles practices that have no ends (empty array)', () => {
    const stats = calculateUserStats([makePractice({ ends: [] })]);
    expect(stats.totalArrows).toBe(0);
  });

  it('handles practices where ends is not provided (undefined)', () => {
    const practice = makePractice();
    (practice as any).ends = undefined;
    const stats = calculateUserStats([practice]);
    expect(stats.totalArrows).toBe(0);
  });

  it('ignores practice categories not in the predefined list', () => {
    const practice = makePractice({ practiceCategory: 'UNKNOWN_CAT' as any });
    const stats = calculateUserStats([practice]);
    expect(stats.practicesByCategory['UNKNOWN_CAT']).toBeUndefined();
  });

  it('does not track bow type when bow is undefined', () => {
    const practice = makePractice({ bow: undefined });
    const stats = calculateUserStats([practice]);
    expect(stats.bowTypesUsed.size).toBe(0);
  });

  it('accumulates arrowsByBowType across multiple practices with the same bow type', () => {
    const practices = [
      makePractice({ id: 'p1', bow: makeBow(BowType.RECURVE), ends: [makeEnd(30)] }),
      makePractice({ id: 'p2', bow: makeBow(BowType.RECURVE), ends: [makeEnd(20)] }),
    ];
    const stats = calculateUserStats(practices);
    expect(stats.arrowsByBowType['RECURVE']).toBe(50);
  });
});

// ── calculateStreak – additional cases ───────────────────────────────────────

describe('calculateStreak – additional cases', () => {
  it('counts a streak that started yesterday (not today)', () => {
    const practices = [makePractice({ id: 'p1', date: yesterday }), makePractice({ id: 'p2', date: twoDaysAgo })];
    expect(calculateStreak(practices)).toBe(2);
  });

  it('returns 0 when the only practice is two days ago', () => {
    expect(calculateStreak([makePractice({ date: twoDaysAgo })])).toBe(0);
  });
});

// ── COMPETITION_COUNT achievements ────────────────────────────────────────────

describe('checkAllAchievements – COMPETITION_COUNT', () => {
  it('does not unlock first-competition when totalCompetitions is 0', () => {
    const result = checkAllAchievements([], [], true);
    const entry = result.find((r) => r.achievement.id === 'first-competition')!;
    expect(entry.isUnlocked).toBe(false);
    expect(entry.current).toBe(0);
  });

  it.todo('unlocks first-competition when totalCompetitions >= 1 (requires stats injection)');
  it.todo('unlocks competitions-10 when totalCompetitions >= 10');
});

// ── COMPETITION_WIN achievement ───────────────────────────────────────────────

describe('checkAllAchievements – COMPETITION_WIN', () => {
  it('does not unlock competition-winner when no win is recorded', () => {
    const result = checkAllAchievements([], [], true);
    const entry = result.find((r) => r.achievement.id === 'competition-winner')!;
    expect(entry.isUnlocked).toBe(false);
    expect(entry.current).toBe(0);
    expect(entry.required).toBe(1);
  });

  it.todo('unlocks competition-winner when hasCompetitionWin is true in stats (requires stats injection)');
});

// ── CATEGORY_PRACTICE achievements ───────────────────────────────────────────

describe('checkAllAchievements – CATEGORY_PRACTICE (indoor-specialist)', () => {
  it('tracks progress towards indoor-specialist correctly', () => {
    const practices = Array.from({ length: 25 }, (_, i) => makePractice({ id: `p${i}`, practiceCategory: PracticeCategory.SKIVE_INDOOR }));
    const result = checkAllAchievements(practices);
    const entry = result.find((r) => r.achievement.id === 'indoor-specialist')!;
    expect(entry.current).toBe(25);
    expect(entry.required).toBe(50);
    expect(entry.percentage).toBe(50);
  });

  it('unlocks indoor-specialist after 50 SKIVE_INDOOR sessions with autoUnlock', () => {
    const practices = Array.from({ length: 50 }, (_, i) => makePractice({ id: `p${i}`, practiceCategory: PracticeCategory.SKIVE_INDOOR }));
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'indoor-specialist')!;
    expect(entry.isUnlocked).toBe(true);
  });

  it('does not count SKIVE_OUTDOOR sessions towards indoor-specialist', () => {
    const practices = Array.from({ length: 50 }, (_, i) => makePractice({ id: `p${i}`, practiceCategory: PracticeCategory.SKIVE_OUTDOOR }));
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'indoor-specialist')!;
    expect(entry.isUnlocked).toBe(false);
    expect(entry.current).toBe(0);
  });

  it('unlocks outdoor-enthusiast after 50 SKIVE_OUTDOOR sessions', () => {
    const practices = Array.from({ length: 50 }, (_, i) => makePractice({ id: `p${i}`, practiceCategory: PracticeCategory.SKIVE_OUTDOOR }));
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'outdoor-enthusiast')!;
    expect(entry.isUnlocked).toBe(true);
  });

  it('unlocks 3d-hunter after 50 JAKT_3D sessions', () => {
    const practices = Array.from({ length: 50 }, (_, i) => makePractice({ id: `p${i}`, practiceCategory: PracticeCategory.JAKT_3D }));
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === '3d-hunter')!;
    expect(entry.isUnlocked).toBe(true);
  });

  it('unlocks field-archer after 50 FELT sessions', () => {
    const practices = Array.from({ length: 50 }, (_, i) => makePractice({ id: `p${i}`, practiceCategory: PracticeCategory.FELT }));
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'field-archer')!;
    expect(entry.isUnlocked).toBe(true);
  });
});

// ── STREAK_DAYS achievement ───────────────────────────────────────────────────

describe('checkAllAchievements – STREAK_DAYS (streak-3)', () => {
  it('unlocks streak-3 when current streak is exactly 3', () => {
    const practices = [
      makePractice({ id: 'p1', date: today }),
      makePractice({ id: 'p2', date: yesterday }),
      makePractice({ id: 'p3', date: twoDaysAgo }),
    ];
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'streak-3')!;
    expect(entry.isUnlocked).toBe(true);
    expect(entry.current).toBe(3);
  });

  it('does not unlock streak-3 when streak is 2', () => {
    const practices = [makePractice({ id: 'p1', date: today }), makePractice({ id: 'p2', date: yesterday })];
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'streak-3')!;
    expect(entry.isUnlocked).toBe(false);
    expect(entry.percentage).toBe(67); // Math.round(2/3 * 100)
  });
});

// ── BOW_TYPE_PRACTICES achievements ───────────────────────────────────────────

describe('checkAllAchievements – BOW_TYPE_PRACTICES (recurve-rider)', () => {
  it('tracks progress towards recurve-rider correctly', () => {
    const practices = Array.from({ length: 25 }, (_, i) => makePractice({ id: `p${i}`, bow: makeBow(BowType.RECURVE) }));
    const result = checkAllAchievements(practices);
    const entry = result.find((r) => r.achievement.id === 'recurve-rider')!;
    expect(entry.current).toBe(25);
    expect(entry.required).toBe(50);
    expect(entry.percentage).toBe(50);
  });

  it('unlocks recurve-rider after 50 RECURVE sessions with autoUnlock', () => {
    const practices = Array.from({ length: 50 }, (_, i) => makePractice({ id: `p${i}`, bow: makeBow(BowType.RECURVE) }));
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'recurve-rider')!;
    expect(entry.isUnlocked).toBe(true);
  });

  it('does not count COMPOUND sessions towards recurve-rider', () => {
    const practices = Array.from({ length: 50 }, (_, i) => makePractice({ id: `p${i}`, bow: makeBow(BowType.COMPOUND) }));
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'recurve-rider')!;
    expect(entry.isUnlocked).toBe(false);
    expect(entry.current).toBe(0);
  });

  it('unlocks compound-commander after 50 COMPOUND sessions', () => {
    const practices = Array.from({ length: 50 }, (_, i) => makePractice({ id: `p${i}`, bow: makeBow(BowType.COMPOUND) }));
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'compound-commander')!;
    expect(entry.isUnlocked).toBe(true);
  });
});

// ── BOW_TYPE_ARROWS achievements ──────────────────────────────────────────────

describe('checkAllAchievements – BOW_TYPE_ARROWS (recurve-dedicated)', () => {
  it('tracks progress towards recurve-dedicated (10,000 recurve arrows)', () => {
    const practice = makePractice({ bow: makeBow(BowType.RECURVE), ends: [makeEnd(5000)] });
    const result = checkAllAchievements([practice]);
    const entry = result.find((r) => r.achievement.id === 'recurve-dedicated')!;
    expect(entry.current).toBe(5000);
    expect(entry.required).toBe(10000);
    expect(entry.percentage).toBe(50);
  });

  it('unlocks recurve-dedicated after 10,000 RECURVE arrows', () => {
    const practice = makePractice({ bow: makeBow(BowType.RECURVE), ends: [makeEnd(10000)] });
    const result = checkAllAchievements([practice], [], true);
    const entry = result.find((r) => r.achievement.id === 'recurve-dedicated')!;
    expect(entry.isUnlocked).toBe(true);
  });

  it('does not count COMPOUND arrows towards recurve-dedicated', () => {
    const practice = makePractice({ bow: makeBow(BowType.COMPOUND), ends: [makeEnd(10000)] });
    const result = checkAllAchievements([practice], [], true);
    const entry = result.find((r) => r.achievement.id === 'recurve-dedicated')!;
    expect(entry.isUnlocked).toBe(false);
    expect(entry.current).toBe(0);
  });

  it('unlocks compound-expert after 10,000 COMPOUND arrows', () => {
    const practice = makePractice({ bow: makeBow(BowType.COMPOUND), ends: [makeEnd(10000)] });
    const result = checkAllAchievements([practice], [], true);
    const entry = result.find((r) => r.achievement.id === 'compound-expert')!;
    expect(entry.isUnlocked).toBe(true);
  });

  it('unlocks longbow-master after 5,000 LONGBOW arrows', () => {
    const practice = makePractice({ bow: makeBow(BowType.LONGBOW), ends: [makeEnd(5000)] });
    const result = checkAllAchievements([practice], [], true);
    const entry = result.find((r) => r.achievement.id === 'longbow-master')!;
    expect(entry.isUnlocked).toBe(true);
  });
});

// ── BOW_TYPE_COUNT increments ─────────────────────────────────────────────────

describe('checkAllAchievements – BOW_TYPE_COUNT increments', () => {
  it('unlocks bow-collector when 3 bow types are used', () => {
    const practices = [
      makePractice({ id: 'p1', bow: makeBow(BowType.RECURVE) }),
      makePractice({ id: 'p2', bow: makeBow(BowType.COMPOUND) }),
      makePractice({ id: 'p3', bow: makeBow(BowType.LONGBOW) }),
    ];
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'bow-collector')!;
    expect(entry.isUnlocked).toBe(true);
    expect(entry.current).toBe(3);
  });

  it('does not unlock bow-collector with only 2 bow types', () => {
    const practices = [
      makePractice({ id: 'p1', bow: makeBow(BowType.RECURVE) }),
      makePractice({ id: 'p2', bow: makeBow(BowType.COMPOUND) }),
    ];
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'bow-collector')!;
    expect(entry.isUnlocked).toBe(false);
  });

  it('unlocks master-of-all-bows when 5 distinct bow types are used', () => {
    const practices = [
      makePractice({ id: 'p1', bow: makeBow(BowType.RECURVE) }),
      makePractice({ id: 'p2', bow: makeBow(BowType.COMPOUND) }),
      makePractice({ id: 'p3', bow: makeBow(BowType.LONGBOW) }),
      makePractice({ id: 'p4', bow: makeBow(BowType.BAREBOW) }),
      makePractice({ id: 'p5', bow: makeBow(BowType.HORSEBOW) }),
    ];
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'master-of-all-bows')!;
    expect(entry.isUnlocked).toBe(true);
    expect(entry.current).toBe(5);
  });

  it('does not unlock master-of-all-bows with only 4 bow types', () => {
    const practices = [
      makePractice({ id: 'p1', bow: makeBow(BowType.RECURVE) }),
      makePractice({ id: 'p2', bow: makeBow(BowType.COMPOUND) }),
      makePractice({ id: 'p3', bow: makeBow(BowType.LONGBOW) }),
      makePractice({ id: 'p4', bow: makeBow(BowType.BAREBOW) }),
    ];
    const result = checkAllAchievements(practices, [], true);
    const entry = result.find((r) => r.achievement.id === 'master-of-all-bows')!;
    expect(entry.isUnlocked).toBe(false);
  });
});

// ── Percentage calculation edge cases ────────────────────────────────────────

describe('checkAllAchievements – percentage edge cases', () => {
  it('clamps percentage to 100 when current exceeds required', () => {
    const practices = Array.from({ length: 200 }, (_, i) => makePractice({ id: `p${i}` }));
    const result = checkAllAchievements(practices);
    // first-practice requires 1, we have 200+ → should not exceed 100%
    const entry = result.find((r) => r.achievement.id === 'first-practice')!;
    expect(entry.percentage).toBe(100);
  });

  it('returns 0 percentage for PERFECT_END when no ends have all 10 scores', () => {
    const practice = makePractice({
      ends: [
        {
          id: 'e1',
          practiceId: 'p1',
          arrows: 3,
          arrowsWithoutScore: null,
          scores: [9, 9, 9],
          roundScore: 27,
          distanceMeters: null,
          distanceFrom: null,
          distanceTo: null,
          targetSizeCm: null,
          targetType: null,
          arrowsPerEnd: null,
          createdAt: today,
          updatedAt: today,
        },
      ],
    });
    const result = checkAllAchievements([practice]);
    const entry = result.find((r) => r.achievement.id === 'perfect-end')!;
    expect(entry.current).toBe(0);
    expect(entry.percentage).toBe(0);
  });
});
