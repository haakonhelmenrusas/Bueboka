import { AimDistanceMark } from '@/types';

/**
 * Target type options for archery practice rounds (value matches the string stored on the backend).
 */
export const TARGET_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: '40 cm', value: '40cm' },
  { label: '60 cm', value: '60cm' },
  { label: '80 cm', value: '80cm' },
  { label: '122 cm', value: '122cm' },
  { label: '3D figur', value: '3d' },
  { label: 'Felt 24 cm', value: '24cm_felt' },
  { label: 'Felt 60 cm', value: '60cm_felt' },
  { label: 'Annet', value: 'other' },
];

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
