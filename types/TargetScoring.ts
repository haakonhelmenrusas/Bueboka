/**
 * Scoring domain model — which arrow values (and colors) a given
 * practice category + target face supports.
 *
 * Scoring is driven by the combination of PracticeCategory (inne/ute/felt/3D)
 * and the chosen target face (targetType on the round), resolved via
 * `resolveScoringScheme` in utils/helpers/scoringHelpers.ts.
 */

/**
 * Visual scoring zone. Maps to the colored rings on the target face and is
 * used to color score buttons and arrow chips.
 */
export type ScoringZone = 'gold' | 'red' | 'blue' | 'black' | 'white' | 'miss';

/**
 * One pressable score value, e.g. { label: 'X', value: 10, zone: 'gold' }.
 * `label` is what's shown on the button/chip; `value` is the stored score.
 */
export interface ScoringOption {
  label: string;
  value: number;
  zone: ScoringZone;
}

export type ScoringSchemeId = 'WA_10_RING' | 'WA_6_RING' | 'FIELD' | 'THREE_D' | 'NONE';

/**
 * A scoring scheme: the full set of allowed arrow scores for a target,
 * in descending order. `NONE` (e.g. bare mat without a face) has no options.
 */
export interface ScoringScheme {
  id: ScoringSchemeId;
  options: ScoringOption[];
}
