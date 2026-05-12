import type { Locale, TranslationKeys } from './types';
import { no } from './translations/no';
import { en } from './translations/en';

const TRANSLATIONS: Record<Locale, TranslationKeys> = { no, en };

export const DEFAULT_LOCALE: Locale = 'no';

export function isLocale(value: unknown): value is Locale {
  return value === 'no' || value === 'en';
}

export function getTranslations(locale: Locale): TranslationKeys {
  return TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE];
}

export type { Locale, TranslationKeys };
