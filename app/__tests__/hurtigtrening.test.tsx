import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import QuickPracticeScreen from '../hurtigtrening';
import { practiceRepository } from '@/services/repositories';

const mockBack = jest.fn();
const mockParams = {
  distanceMeters: '18',
  targetType: '122cm',
  environment: 'INDOOR',
  practiceCategory: 'SKIVE_INDOOR',
};
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn() }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@/services/repositories', () => ({
  practiceRepository: { create: jest.fn() },
}));

const mockCreate = jest.mocked(practiceRepository.create);

describe('QuickPracticeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({} as any);
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

  it('saves a quick practice with the counted arrows as unscored and navigates back', async () => {
    const { getByTestId } = await render(<QuickPracticeScreen />);

    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-plus'));
    await fireEvent.press(getByTestId('quick-save'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    const payload = mockCreate.mock.calls[0][0];
    expect(payload.rounds[0]).toMatchObject({
      distanceMeters: 18,
      targetType: '122cm',
      roundScore: 0,
      arrowsWithoutScore: 3,
    });
    expect(payload.rounds[0].scores).toEqual([]);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('does not save with zero arrows', async () => {
    const { getByTestId } = await render(<QuickPracticeScreen />);

    await fireEvent.press(getByTestId('quick-save'));

    expect(mockCreate).not.toHaveBeenCalled();
  });
});
