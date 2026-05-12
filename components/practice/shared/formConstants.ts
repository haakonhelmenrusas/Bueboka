import { Environment, PracticeCategory, WeatherCondition } from '@/types';
import type { TranslationKeys } from '@/lib/i18n';

// ─── Option factories ─────────────────────────────────────────────────────────
// These accept the translations object so the labels resolve in the active
// locale. The values themselves are stable enum members shipped to the API.

export const getPracticeCategoryOptions = (t: TranslationKeys) => [
  { label: t['practiceCategory.skiveIndoor'], value: PracticeCategory.SKIVE_INDOOR },
  { label: t['practiceCategory.skiveOutdoor'], value: PracticeCategory.SKIVE_OUTDOOR },
  { label: t['practiceCategory.jakt3D'], value: PracticeCategory.JAKT_3D },
  { label: t['practiceCategory.felt'], value: PracticeCategory.FELT },
];

export const getEnvironmentOptions = (t: TranslationKeys) => [
  { label: t['environment.indoor'], value: Environment.INDOOR },
  { label: t['environment.outdoor'], value: Environment.OUTDOOR },
];

export const getWeatherOptions = (t: TranslationKeys): { value: WeatherCondition; label: string }[] => [
  { value: WeatherCondition.SUN, label: t['weather.sun'] },
  { value: WeatherCondition.CLOUDED, label: t['weather.clouded'] },
  { value: WeatherCondition.CLEAR, label: t['weather.clear'] },
  { value: WeatherCondition.RAIN, label: t['weather.rain'] },
  { value: WeatherCondition.WIND, label: t['weather.wind'] },
  { value: WeatherCondition.SNOW, label: t['weather.snow'] },
  { value: WeatherCondition.FOG, label: t['weather.fog'] },
  { value: WeatherCondition.THUNDER, label: t['weather.thunder'] },
  { value: WeatherCondition.CHANGING_CONDITIONS, label: t['weather.changing'] },
  { value: WeatherCondition.OTHER, label: t['weather.other'] },
];

// ─── Arrow score button options ───────────────────────────────────────────────
// These labels are numeric / single-letter ('X', 'M') and don't need
// translation.
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
