import type { TranslationKeys } from '@/lib/i18n';

/**
 * Achievement names and descriptions come from the backend, but the backend
 * only ships Norwegian text today. These helpers map the stable
 * `achievement.id` to the matching translation key — when the id is known the
 * localized text wins, otherwise we fall back to whatever the server sent so
 * brand-new achievements (added on the backend before the client ships a
 * matching key) still render.
 */

const nameKey = (id: string) => `achievement.${id}.name` as const;
const descriptionKey = (id: string) => `achievement.${id}.description` as const;

function lookup(t: TranslationKeys, key: string, fallback: string): string {
  const value = (t as unknown as Record<string, string | undefined>)[key];
  return value ?? fallback;
}

export function getAchievementName(id: string, fallback: string, t: TranslationKeys): string {
  return lookup(t, nameKey(id), fallback);
}

export function getAchievementDescription(id: string, fallback: string, t: TranslationKeys): string {
  return lookup(t, descriptionKey(id), fallback);
}
