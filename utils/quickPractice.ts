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
