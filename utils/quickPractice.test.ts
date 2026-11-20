import {
  clearQuickPracticeCounts,
  consumePendingQuickPracticeResult,
  consumeQuickPracticeLaunched,
  getQuickPracticeCount,
  markQuickPracticeLaunched,
  QUICK_COUNT_KEY_PREFIX,
  quickCountKey,
  saveQuickPracticeCount,
  setPendingQuickPracticeResult,
} from './quickPractice';

const mockStore: Record<string, string> = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((k: string) => Promise.resolve(mockStore[k] ?? null)),
  setItem: jest.fn((k: string, v: string) => {
    mockStore[k] = v;
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(mockStore))),
  multiRemove: jest.fn((keys: string[]) => {
    keys.forEach((k) => delete mockStore[k]);
    return Promise.resolve();
  }),
}));

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

describe('quickPractice per-round counts', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach((k) => delete mockStore[k]);
    jest.clearAllMocks();
  });

  it('saves and reads back the count per round', async () => {
    expect(await getQuickPracticeCount(0)).toBe(0);
    await saveQuickPracticeCount(0, 6);
    await saveQuickPracticeCount(1, 3);
    expect(await getQuickPracticeCount(0)).toBe(6);
    expect(await getQuickPracticeCount(1)).toBe(3);
    expect(mockStore[quickCountKey(0)]).toBe('6');
    expect(quickCountKey(0).startsWith(QUICK_COUNT_KEY_PREFIX)).toBe(true);
  });

  it('clearQuickPracticeCounts removes only the quick-count keys', async () => {
    await saveQuickPracticeCount(0, 6);
    await saveQuickPracticeCount(2, 4);
    mockStore['bueboka_last_distance'] = '18';
    await clearQuickPracticeCounts();
    expect(await getQuickPracticeCount(0)).toBe(0);
    expect(await getQuickPracticeCount(2)).toBe(0);
    expect(mockStore['bueboka_last_distance']).toBe('18');
  });
});
