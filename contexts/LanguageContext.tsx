import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { DEFAULT_LOCALE, getTranslations, isLocale, type Locale, type TranslationKeys } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import { userRepository } from '@/services/repositories';

const STORAGE_KEY = 'bueboka_language';

interface LanguageContextValue {
  locale: Locale;
  t: TranslationKeys;
  setLanguage: (next: Locale) => Promise<void>;
  /** True once we've finished reading the initial value from storage. */
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Resolve the initial locale from the device OS, falling back to the default.
 * Only invoked when no value is stored locally.
 */
function detectOSLocale(): Locale {
  try {
    const locales = Localization.getLocales();
    const code = locales?.[0]?.languageCode?.toLowerCase();
    if (code === 'no' || code === 'nb' || code === 'nn') return 'no';
    if (code === 'en') return 'en';
  } catch {
    // expo-localization can throw in some test environments; fall through.
  }
  return DEFAULT_LOCALE;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  // Track which user we've already reconciled with the server so we don't
  // repeatedly fetch /profile on every render.
  const syncedForUserRef = useRef<string | null>(null);

  // Initial load: prefer stored value, otherwise infer from OS locale.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (isLocale(stored)) {
          setLocale(stored);
        } else {
          setLocale(detectOSLocale());
        }
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Once the session resolves, reconcile with the server. DB wins when set;
  // otherwise back-fill the server with whatever the client picked. Mirrors
  // the web client's `useLanguage` behavior (see docs/API.md "Locale and
  // language sync" in the website repo).
  useEffect(() => {
    if (!isLoaded || authLoading) return;
    const userId = user?.id ?? null;
    if (!userId) return;
    if (syncedForUserRef.current === userId) return;
    syncedForUserRef.current = userId;

    const serverLocale = isLocale(user?.locale) ? (user!.locale as Locale) : null;
    if (serverLocale) {
      if (serverLocale !== locale) {
        setLocale(serverLocale);
        void AsyncStorage.setItem(STORAGE_KEY, serverLocale);
      }
    } else {
      // No server preference yet — back-fill with the current local value
      // so the choice persists across devices going forward.
      void userRepository.updateLocale(locale).catch(() => {
        // Non-fatal: local value remains authoritative for this device.
      });
    }
    // We intentionally only re-run when the auth identity changes; the
    // syncedForUserRef guard prevents loops if `locale` updates as a side
    // effect of this same effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, authLoading, user?.id, user?.locale]);

  const setLanguage = useCallback(
    async (next: Locale) => {
      setLocale(next);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage failure is non-fatal; in-memory state still updates.
      }
      if (user?.id) {
        userRepository.updateLocale(next).catch(() => {
          // Fire-and-forget: localStorage-equivalent remains the source of
          // truth for the current device until the next successful sync.
        });
      }
    },
    [user?.id]
  );

  const value: LanguageContextValue = {
    locale,
    t: getTranslations(locale),
    setLanguage,
    isLoaded,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}
