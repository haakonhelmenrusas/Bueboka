/**
 * Handoff between the quick-practice screen and the practice form.
 * When a quick practice is saved, the arrow count is stored here so the
 * form can write it back into the round's "Piler u/score" field on focus.
 */
export interface QuickPracticeResult {
  roundIndex: number;
  count: number;
}

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
