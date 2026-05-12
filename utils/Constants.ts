import { AimDistanceMark } from '@/types';
import type { TranslationKeys } from '@/lib/i18n';

/**
 * Source of truth for archery target types. The `value` is what's stored on
 * the backend and must stay stable. The `key` resolves to the user-facing
 * label via the active locale.
 */
export const TARGET_TYPES: { value: string; key: keyof TranslationKeys; label: string }[] = [
  { value: '40cm', key: 'target.size40cm', label: '40 cm' },
  { value: '60cm', key: 'target.size60cm', label: '60 cm' },
  { value: '80cm', key: 'target.size80cm', label: '80 cm' },
  { value: '122cm', key: 'target.size122cm', label: '122 cm' },
  { value: '3d', key: 'target.figure3D', label: '3D figur' },
  { value: '24cm_felt', key: 'target.field24cm', label: 'Felt 24 cm' },
  { value: '60cm_felt', key: 'target.field60cm', label: 'Felt 60 cm' },
  { value: 'other', key: 'target.other', label: 'Annet' },
];

/**
 * Untranslated target options. Kept for code paths that only need the value
 * list (validation) or where no locale context is available.
 */
export const TARGET_TYPE_OPTIONS = TARGET_TYPES.map(({ value, label }) => ({ value, label }));

/** Translated target options for UI consumers — call from inside a render. */
export const getTargetTypeOptions = (t: TranslationKeys) => TARGET_TYPES.map(({ value, key }) => ({ value, label: t[key] }));

/**
 * Standard values for Ballistics calculations. These values are used to calculate the aim distance marks.
 * The user can change these values in the app.
 */
export const Ballistics: AimDistanceMark = {
  new_given_mark: 0,
  new_given_distance: 0,
  given_marks: [],
  given_distances: [],
  bow_category: 'recurve',
  interval_sight_measured: 4.7,
  interval_sight_real: 5.0,
  direction_of_sight_scale: 'down',
  arrow_diameter_mm: 5.69,
  arrow_mass_gram: 21.2,
  length_eye_sight_cm: 97.0,
  length_nock_eye_cm: 12.0,
  feet_behind_or_center: 'behind',
};
