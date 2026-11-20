import { PracticeCategory } from '@/types';
import type { ScoringOption, ScoringScheme, ScoringZone } from '@/types';

/**
 * Scoring schemes per target face / practice category.
 *
 * Domain rules (World Archery):
 * - WA 10-ring faces (40/60/80/122 cm, triple/Vegas): X counts 10 and is used
 *   outdoors; indoor WA rounds do not use the X-ring, so it's hidden for
 *   SKIVE_INDOOR. Rings: gold 9-10(+X), red 7-8, blue 5-6, black 3-4, white 1-2.
 * - 6-ring centre (80cm-centre-6): six scoring zones X, 10, 9, 8, 7, 6.
 * - Field faces (felt-*): four black rings 1-4, yellow outer 5, yellow inner 6.
 * - 3D animals (JAKT_3D): 11 (inner kill), 10, 8 (kill zone), 5 (body).
 * - A miss (M) always scores 0. A bare mat without a face ('bar') has no
 *   scoring zones at all.
 */

const opt = (label: string, value: number, zone: ScoringZone): ScoringOption => ({ label, value, zone });

const WA_10_RING_OPTIONS: ScoringOption[] = [
  opt('X', 10, 'gold'),
  opt('10', 10, 'gold'),
  opt('9', 9, 'gold'),
  opt('8', 8, 'red'),
  opt('7', 7, 'red'),
  opt('6', 6, 'blue'),
  opt('5', 5, 'blue'),
  opt('4', 4, 'black'),
  opt('3', 3, 'black'),
  opt('2', 2, 'white'),
  opt('1', 1, 'white'),
  opt('M', 0, 'miss'),
];

const WA_6_RING_OPTIONS: ScoringOption[] = [
  opt('X', 10, 'gold'),
  opt('10', 10, 'gold'),
  opt('9', 9, 'gold'),
  opt('8', 8, 'red'),
  opt('7', 7, 'red'),
  opt('6', 6, 'blue'),
  opt('M', 0, 'miss'),
];

const FIELD_OPTIONS: ScoringOption[] = [
  opt('6', 6, 'gold'),
  opt('5', 5, 'gold'),
  opt('4', 4, 'black'),
  opt('3', 3, 'black'),
  opt('2', 2, 'black'),
  opt('1', 1, 'black'),
  opt('M', 0, 'miss'),
];

const THREE_D_OPTIONS: ScoringOption[] = [
  opt('11', 11, 'gold'),
  opt('10', 10, 'red'),
  opt('8', 8, 'blue'),
  opt('5', 5, 'black'),
  opt('M', 0, 'miss'),
];

export const SCORING_SCHEMES: Record<ScoringScheme['id'], ScoringScheme> = {
  WA_10_RING: { id: 'WA_10_RING', options: WA_10_RING_OPTIONS },
  WA_6_RING: { id: 'WA_6_RING', options: WA_6_RING_OPTIONS },
  FIELD: { id: 'FIELD', options: FIELD_OPTIONS },
  THREE_D: { id: 'THREE_D', options: THREE_D_OPTIONS },
  NONE: { id: 'NONE', options: [] },
};

/**
 * Resolve which scoring scheme applies for a practice category combined with
 * the round's chosen target face. The target face wins when it implies a
 * specific scheme (felt-*, 80cm-centre-6, bar); otherwise the category
 * decides (FELT, JAKT_3D) with WA 10-ring as the default for skive inne/ute.
 */
export function resolveScoringScheme(category: PracticeCategory, targetType: string | null | undefined): ScoringScheme {
  const target = (targetType ?? '').toLowerCase();

  if (target === 'bar') return SCORING_SCHEMES.NONE;
  if (target.startsWith('felt-') || category === PracticeCategory.FELT) return SCORING_SCHEMES.FIELD;
  if (category === PracticeCategory.JAKT_3D) return SCORING_SCHEMES.THREE_D;
  if (target === '80cm-centre-6') return SCORING_SCHEMES.WA_6_RING;

  const base = SCORING_SCHEMES.WA_10_RING;
  if (category === PracticeCategory.SKIVE_INDOOR) {
    // Indoor WA rounds do not score the X-ring
    return { ...base, options: base.options.filter((o) => o.label !== 'X') };
  }
  return base;
}

/**
 * Look up the visual zone for a stored score value. Falls back to ring
 * thresholds for values not present in the scheme (e.g. legacy data scored
 * before the target type was changed).
 */
export function getZoneForScore(scheme: ScoringScheme, score: number): ScoringZone {
  const match = scheme.options.find((o) => o.value === score);
  if (match) return match.zone;
  if (score >= 9) return 'gold';
  if (score >= 7) return 'red';
  if (score >= 5) return 'blue';
  if (score >= 3) return 'black';
  if (score >= 1) return 'white';
  return 'miss';
}
