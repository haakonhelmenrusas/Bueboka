import { sumArrows } from './sumArrows';
import type { Practice } from '@/types';
import { Environment, PracticeCategory } from '@/types';

const makePractice = (overrides: Partial<Practice>): Practice => ({
  id: 'p1',
  userId: 'u1',
  date: new Date().toISOString(),
  notes: null,
  totalScore: 0,
  rating: null,
  location: null,
  environment: Environment.INDOOR,
  weather: [],
  practiceCategory: PracticeCategory.SKIVE_INDOOR,
  roundTypeId: null,
  bowId: null,
  arrowsId: null,
  ends: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const makeEnd = (arrows: number | null, arrowsWithoutScore: number | null) => ({
  id: 'e1',
  practiceId: 'p1',
  arrows,
  arrowsWithoutScore,
  scores: [],
  roundScore: null,
  distanceMeters: null,
  distanceFrom: null,
  distanceTo: null,
  targetSizeCm: null,
  targetType: null,
  arrowsPerEnd: null,
  createdAt: '',
  updatedAt: '',
});

describe('sumArrows', () => {
  it('counts both scored and unscored arrows (warm-up arrows included)', () => {
    const practice = makePractice({ ends: [makeEnd(72, 14)] });
    expect(sumArrows([practice])).toBe(86);
  });

  it('counts unscored-only ends', () => {
    const practice = makePractice({ ends: [makeEnd(null, 14)] });
    expect(sumArrows([practice])).toBe(14);
  });

  it('returns 0 for empty input', () => {
    expect(sumArrows([])).toBe(0);
    expect(sumArrows([makePractice({ ends: [] })] as Practice[])).toBe(0);
  });
});
