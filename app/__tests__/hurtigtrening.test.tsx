import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import QuickPracticeScreen from '../hurtigtrening';
import { consumePendingQuickPracticeResult } from '@/utils/quickPractice';

const mockBack = jest.fn();
const mockParams = {
  roundIndex: '2',
  distanceMeters: '18',
  targetType: '122cm',
  environment: 'INDOOR',
  practiceCategory: 'SKIVE_INDOOR',
};
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn() }),
  useLocalSearchParams: () => mockParams,
}));

describe('QuickPracticeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consumePendingQuickPracticeResult();
  });

  it('counts arrows up and down, never below zero', async () => {
    const { getByTestId } = await render(<QuickPracticeScreen />);

    expect(getByTestId('quick-counter').props.children).toBe(0);

    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-plus'));
    expect(getByTestId('quick-counter').props.children).toBe(2);

    await fireEvent.press(getByTestId('quick-minus'));
    expect(getByTestId('quick-counter').props.children).toBe(1);

    await fireEvent.press(getByTestId('quick-minus'));
    await fireEvent.press(getByTestId('quick-minus'));
    expect(getByTestId('quick-counter').props.children).toBe(0);
  });

  it('hands the counted arrows back to the form round without creating a session', async () => {
    const { getByTestId } = await render(<QuickPracticeScreen />);

    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-save'));

    expect(mockBack).toHaveBeenCalledTimes(1);
    // The count is pending for the practice form's "Piler u/score" field —
    // the quick practice is a warm-up in the same session, not a new practice
    expect(consumePendingQuickPracticeResult()).toEqual({ roundIndex: 2, count: 3 });
    expect(consumePendingQuickPracticeResult()).toBeNull();
  });

  it('does not go back with zero arrows', async () => {
    const { getByTestId } = await render(<QuickPracticeScreen />);

    await fireEvent.press(getByTestId('quick-save'));

    expect(mockBack).not.toHaveBeenCalled();
    expect(consumePendingQuickPracticeResult()).toBeNull();
  });
});
