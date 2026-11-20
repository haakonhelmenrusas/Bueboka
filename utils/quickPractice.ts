import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Handoff between the quick-practice screen and the practice form.
 * When a quick practice is saved, the arrow count is stored here so the
 * form can write it back into the round's "Piler u/score" field on focus.
 */
export interface QuickPracticeResult {
  roundIndex: number;
  count: number;
}

/**
 * Last arrow count per round, persisted so re-opening the quick practice for
 * the same round starts where the user left off. Counts live only for the
 * duration of one practice form session — clearQuickPracticeCounts() removes
 * them when the form is closed or a new session starts.
 */
export const QUICK_COUNT_KEY_PREFIX = 'bueboka_quick_count_round_';

export const quickCountKey = (roundIndex: number | string): string => `${QUICK_COUNT_KEY_PREFIX}${roundIndex}`;

export const getQuickPracticeCount = async (roundIndex: number | string): Promise<number> => {
  try {
    const v = await AsyncStorage.getItem(quickCountKey(roundIndex));
    const n = v ? parseInt(v, 10) : 0;
    return isNaN(n) || n < 0 ? 0 : n;
  } catch {
    return 0;
  }
};

export const saveQuickPracticeCount = async (roundIndex: number | string, count: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(quickCountKey(roundIndex), String(count));
  } catch {}
};

/** Remove all stored per-round counts (call when the practice form closes) */
export const clearQuickPracticeCounts = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ours = keys.filter((k) => k.startsWith(QUICK_COUNT_KEY_PREFIX));
    if (ours.length > 0) await AsyncStorage.multiRemove(ours);
  } catch {}
};

let pending: QuickPracticeResult | null = null;

export const setPendingQuickPracticeResult = (result: QuickPracticeResult): void => {
  pending = result;
};

export const consumePendingQuickPracticeResult = (): QuickPracticeResult | null => {
  const result = pending;
  pending = null;
  return result;
};

/**
 * Set when the quick-practice screen is pushed from the practice form (the
 * form modal must be hidden first — a RN Modal sits above the navigation
 * stack on iOS, so a pushed screen would otherwise open behind it). The
 * hosting screen consumes this on focus to re-open the form modal when the
 * user returns.
 */
let launched = false;

export const markQuickPracticeLaunched = (): void => {
  launched = true;
};

export const consumeQuickPracticeLaunched = (): boolean => {
  const value = launched;
  launched = false;
  return value;
};
