import { AimDistanceMark } from '@/types';
import type { TranslationKeys } from '@/lib/i18n';

/**
 * Source of truth for archery target types. The `value` is what's stored on
 * the backend and must stay stable. The `key` resolves to the user-facing
 * label via the active locale.
 */
export const TARGET_TYPES: { value: string; key: keyof TranslationKeys; label: string }[] = [
  { value: '40cm', key: 'target.size40cm', label: '40 cm' },
  { value: '40cm-trippel-vegas', key: 'target.size40Triple', label: '40cm Trippel/Vegas' },
  { value: '60cm', key: 'target.size60cm', label: '60 cm' },
  { value: '60cm-trippel', key: 'target.size60Triple', label: '60cm Trippel' },
  { value: '80cm', key: 'target.size80cm', label: '80 cm' },
  { value: '80cm-centre-6', key: 'target.size80Centre6', label: '80 cm Centre 6' },
  { value: '122cm', key: 'target.size122cm', label: '122 cm' },
  { value: 'felt-20-trippel', key: 'target.field20Triple', label: 'Felt 20 cm Trippel' },
  { value: 'felt-40', key: 'target.field40', label: 'Felt 40 cm' },
  { value: 'felt-60', key: 'target.field60', label: 'Felt 60 cm' },
  { value: 'felt-80', key: 'target.field80', label: 'Felt 80 cm' },
  { value: 'bar', key: 'target.bareMat', label: 'Barmatte uten blink' },
  { value: 'historisk-nl-inne', key: 'target.historicNLIndoor', label: 'Historisk NL Inne' },
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
