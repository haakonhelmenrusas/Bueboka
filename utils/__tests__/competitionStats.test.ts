import { computeCompetitionStats, isActiveCompetition, splitCompetitions } from '../competitionStats';
import type { Competition } from '@/types';
import { Environment, PracticeCategory, WeatherCondition } from '@/types';

// Local-time dates (no Z suffix) so the tests are deterministic in any timezone.
const NOW = new Date(2026, 10, 3, 12, 0, 0); // 2026-11-03 12:00 local time

const makeCompetition = (overrides: Partial<Competition>): Competition => ({
  id: 'c1',
  userId: 'u1',
  date: '2026-10-01T10:00:00',
  name: 'Test Cup',
  location: null,
  organizerName: null,
  environment: Environment.INDOOR,
  weather: [] as WeatherCondition[],
  practiceCategory: PracticeCategory.SKIVE_INDOOR,
  notes: null,
  placement: null,
  numberOfParticipants: null,
  personalBest: null,
  totalScore: 0,
  bowId: null,
  arrowsId: null,
  rounds: [],
  createdAt: '2026-10-01T10:00:00',
  updatedAt: '2026-10-01T10:00:00',
  ...overrides,
});

describe('isActiveCompetition', () => {
  it('treats a competition later today as active', () => {
    expect(isActiveCompetition(makeCompetition({ date: '2026-11-03T18:00:00' }), NOW)).toBe(true);
  });

  it('treats a competition earlier today as active (start of day boundary)', () => {
    expect(isActiveCompetition(makeCompetition({ date: '2026-11-03T00:30:00' }), NOW)).toBe(true);
  });

  it('treats a competition tomorrow as active', () => {
    expect(isActiveCompetition(makeCompetition({ date: '2026-11-04T09:00:00' }), NOW)).toBe(true);
  });

  it('treats yesterday as past', () => {
    expect(isActiveCompetition(makeCompetition({ date: '2026-11-02T23:59:00' }), NOW)).toBe(false);
  });
});

describe('splitCompetitions', () => {
  it('splits into active (today or later) and past, sorted active asc / past desc', () => {
    const competitions = [
      makeCompetition({ id: 'past-old', date: '2026-09-01T10:00:00' }),
      makeCompetition({ id: 'past-recent', date: '2026-11-01T10:00:00' }),
      makeCompetition({ id: 'active-later', date: '2026-11-10T10:00:00' }),
      makeCompetition({ id: 'active-today', date: '2026-11-03T08:00:00' }),
    ];

    const { active, past } = splitCompetitions(competitions, NOW);

    expect(active.map((c) => c.id)).toEqual(['active-today', 'active-later']);
    expect(past.map((c) => c.id)).toEqual(['past-recent', 'past-old']);
  });

  it('returns empty lists for an empty input', () => {
    expect(splitCompetitions([], NOW)).toEqual({ active: [], past: [] });
  });
});

describe('computeCompetitionStats', () => {
  it('computes totals, podiums, personal bests, best placement and average score', () => {
    const competitions = [
      makeCompetition({ id: '1', date: '2026-10-01T10:00:00', placement: 2, personalBest: true, totalScore: 600 }),
      makeCompetition({ id: '2', date: '2026-10-15T10:00:00', placement: 1, personalBest: false, totalScore: 650 }),
      makeCompetition({ id: '3', date: '2026-11-05T10:00:00', placement: null, personalBest: null, totalScore: 550 }),
      makeCompetition({ id: '4', date: '2026-10-20T10:00:00', placement: 7, personalBest: null, totalScore: 500 }),
    ];

    const stats = computeCompetitionStats(competitions, NOW);

    expect(stats.total).toBe(4);
    expect(stats.active).toBe(1); // only id 3 is after start of today
    expect(stats.podiums).toBe(2); // placements 2 and 1
    expect(stats.personalBests).toBe(1);
    expect(stats.bestPlacement).toBe(1);
    expect(stats.averageScore).toBe(575); // (600+650+550+500)/4
  });

  it('rounds the average score to one decimal', () => {
    const competitions = [
      makeCompetition({ id: '1', totalScore: 601 }),
      makeCompetition({ id: '2', totalScore: 600 }),
      makeCompetition({ id: '3', totalScore: 600 }),
    ];
    expect(computeCompetitionStats(competitions, NOW).averageScore).toBe(600.3);
  });

  it('returns nulls and zeros for an empty list', () => {
    const stats = computeCompetitionStats([], NOW);
    expect(stats).toEqual({ total: 0, active: 0, podiums: 0, personalBests: 0, bestPlacement: null, averageScore: null });
  });
});
