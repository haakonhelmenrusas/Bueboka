import { Environment, PracticeCategory, WeatherCondition } from '@/types';

// ─── Shared option lists ──────────────────────────────────────────────────────
export const PRACTICE_CATEGORY_OPTIONS = [
  { label: 'Skive innendørs', value: PracticeCategory.SKIVE_INDOOR },
  { label: 'Skive utendørs', value: PracticeCategory.SKIVE_OUTDOOR },
  { label: 'Jakt 3D', value: PracticeCategory.JAKT_3D },
  { label: 'Felt', value: PracticeCategory.FELT },
];

export const ENVIRONMENT_OPTIONS = [
  { label: 'Innendørs', value: Environment.INDOOR },
  { label: 'Utendørs', value: Environment.OUTDOOR },
];

export const WEATHER_OPTIONS: { value: WeatherCondition; label: string }[] = [
  { value: WeatherCondition.SUN, label: '☀️ Sol' },
  { value: WeatherCondition.CLOUDED, label: '⛅ Skyet' },
  { value: WeatherCondition.CLEAR, label: '🌤 Klart' },
  { value: WeatherCondition.RAIN, label: '🌧 Regn' },
  { value: WeatherCondition.WIND, label: '💨 Vind' },
  { value: WeatherCondition.SNOW, label: '❄️ Snø' },
  { value: WeatherCondition.FOG, label: '🌫 Tåke' },
  { value: WeatherCondition.THUNDER, label: '⛈ Torden' },
  { value: WeatherCondition.CHANGING_CONDITIONS, label: '🔄 Skiftende' },
  { value: WeatherCondition.OTHER, label: '🌡 Annet' },
];

export const ARROW_SCORE_OPTIONS = [
  { label: 'X', value: 10 },
  { label: '10', value: 10 },
  { label: '9', value: 9 },
  { label: '8', value: 8 },
  { label: '7', value: 7 },
  { label: '6', value: 6 },
  { label: '5', value: 5 },
  { label: '4', value: 4 },
  { label: '3', value: 3 },
  { label: '2', value: 2 },
  { label: '1', value: 1 },
  { label: 'M', value: 0 },
];
