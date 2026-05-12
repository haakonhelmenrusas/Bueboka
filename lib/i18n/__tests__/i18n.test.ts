import { getTranslations, isLocale, DEFAULT_LOCALE } from '@/lib/i18n';

describe('isLocale', () => {
  it('accepts the two supported locales', () => {
    expect(isLocale('no')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it('rejects everything else', () => {
    expect(isLocale('sv')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(42)).toBe(false);
  });
});

describe('getTranslations', () => {
  it('returns Norwegian for the "no" locale', () => {
    const t = getTranslations('no');
    expect(t['language.norwegian']).toBe('Norsk');
    expect(t['language.english']).toBe('Engelsk');
  });

  it('returns English for the "en" locale', () => {
    const t = getTranslations('en');
    expect(t['language.norwegian']).toBe('Norwegian');
    expect(t['language.english']).toBe('English');
  });

  it('falls back to the default locale when given garbage at runtime', () => {
    // Cast through `unknown` so we can simulate a stale/wrong value reaching
    // the resolver — defensive behavior, not a typed code path.
    const t = getTranslations('xx' as unknown as 'no');
    expect(t).toEqual(getTranslations(DEFAULT_LOCALE));
  });
});
