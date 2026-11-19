import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import QuickPracticeScreen from '../hurtigtrening';
import { consumePendingQuickPracticeResult } from '@/utils/quickPractice';

const mockBack = jest.fn();
const mockGetItem = jest.fn().mockResolvedValue(null);
const mockSetItem = jest.fn().mockResolvedValue(undefined);
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

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (...args: any[]) => mockGetItem(...args),
  setItem: (...args: any[]) => mockSetItem(...args),
}));

describe('QuickPracticeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
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

  it('starts from the last saved count for this round', async () => {
    mockGetItem.mockResolvedValue('6');
    const { getByTestId } = await render(<QuickPracticeScreen />);

    await waitFor(() => expect(getByTestId('quick-counter').props.children).toBe(6));
    // keyed by the round the arrows are added to (roundIndex=2)
    expect(mockGetItem).toHaveBeenCalledWith('bueboka_quick_count_round_2');
  });

  it('persists the count per round when saving', async () => {
    const { getByTestId } = await render(<QuickPracticeScreen />);

    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-save'));

    expect(mockSetItem).toHaveBeenCalledWith('bueboka_quick_count_round_2', '2');
  });
});
