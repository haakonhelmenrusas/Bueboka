import React from 'react';
import { fireEvent, render, within } from '@testing-library/react-native';
import { AchievementUnlockModal } from '../AchievementUnlockModal';
import type { Achievement } from '@/types/Achievement';

jest.mock('@/contexts', () => ({
  useTranslation: () => ({
    t: {
      'achievementUnlock.titleSingle': 'Achievement unlocked!',
      'achievementUnlock.titleMultiple': 'achievements unlocked!',
      'achievementUnlock.subtitleSingle': 'Keep it up',
      'achievementUnlock.subtitleMultiple': 'Amazing session',
      'achievementUnlock.points': 'points',
      'achievementUnlock.totalPoints': 'Total',
      'achievementUnlock.viewAll': 'View all',
      'common.close': 'Close',
    },
    locale: 'en',
  }),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => <></>,
}));

const makeAchievement = (n: number): Achievement => ({
  id: `ach-${n}`,
  name: `Achievement ${n}`,
  description: `Description ${n}`,
  category: 'MILESTONE',
  rarity: 'COMMON',
  icon: 'Trophy',
  points: 10,
  requirements: { type: 'PRACTICE_COUNT', value: n },
});

describe('AchievementUnlockModal', () => {
  it('renders many achievements inside a scrollable list with the close button visible', async () => {
    const achievements = Array.from({ length: 12 }, (_, i) => makeAchievement(i + 1));
    const onClose = jest.fn();

    const { getByText, getByTestId } = await render(<AchievementUnlockModal achievements={achievements} onClose={onClose} />);

    // The list must be a ScrollView so long lists can scroll
    const list = getByTestId('achievement-list');
    expect(list.type).toBe('RCTScrollView');

    // All achievements render inside the scrollable list, not just the first few
    const listQueries = within(list);
    expect(listQueries.getByText('Achievement 1')).toBeTruthy();
    expect(listQueries.getByText('Achievement 12')).toBeTruthy();

    // Footer with total points and close button stays reachable
    expect(getByText(/Total/)).toBeTruthy();
    const close = getByText('Close');
    expect(close).toBeTruthy();
    await fireEvent.press(close);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows the single-achievement title for one unlock', async () => {
    const { getByText, queryByText } = await render(<AchievementUnlockModal achievements={[makeAchievement(1)]} onClose={jest.fn()} />);
    expect(getByText('Achievement unlocked!')).toBeTruthy();
    expect(queryByText(/achievements unlocked!/)).toBeNull();
  });
});
