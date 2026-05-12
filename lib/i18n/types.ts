export type Locale = 'no' | 'en';

// Phase 1 seeds the type with the keys actually consumed by the
// LanguageProvider's UI (the settings language section). Subsequent phases
// will mirror the web app's TranslationKeys interface as each screen is
// migrated. Keep key names aligned with the web app so the translations can
// eventually be shared.
export interface TranslationKeys {
  // Language switcher (in Settings)
  'language.sectionTitle': string;
  'language.helpText': string;
  'language.norwegian': string;
  'language.english': string;
  'language.current': string;
  'language.switchTo': string;
}
