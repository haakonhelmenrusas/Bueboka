import {
  consumePendingQuickPracticeResult,
  consumeQuickPracticeLaunched,
  markQuickPracticeLaunched,
  setPendingQuickPracticeResult,
} from './quickPractice';

describe('quickPractice handoff', () => {
  it('returns the pending result once, then null', () => {
    expect(consumePendingQuickPracticeResult()).toBeNull();
    setPendingQuickPracticeResult({ roundIndex: 2, count: 6 });
    expect(consumePendingQuickPracticeResult()).toEqual({ roundIndex: 2, count: 6 });
    expect(consumePendingQuickPracticeResult()).toBeNull();
  });

  it('tracks whether the quick-practice screen was launched, consumed once', () => {
    expect(consumeQuickPracticeLaunched()).toBe(false);
    markQuickPracticeLaunched();
    expect(consumeQuickPracticeLaunched()).toBe(true);
    expect(consumeQuickPracticeLaunched()).toBe(false);
  });
});
