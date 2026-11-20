import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { RoundCard } from '../RoundCard';
import { PracticeCategory } from '@/types';
import type { RoundInput } from '../CreatePracticeForm';

jest.mock('@/contexts', () => ({
  useTranslation: () => ({
    t: {
      'round.title': 'Round',
      'round.remove': 'Remove',
      'form.distance': 'Distance (m)',
      'form.target': 'Target',
      'form.choose': 'Choose',
      'form.arrowsWithScore': 'Arrows with score',
      'form.arrowsPerEnd': 'Arrows per end',
      'form.score': 'Score',
      'form.arrowsWithoutScore': 'Arrows w/o score',
      'scoring.scoreNow': 'Score now',
      'scoring.continueScoring': 'Continue',
      'scoring.editScores': 'Edit',
      'quickPractice.startButton': 'Skyt og klikk',
    },
    locale: 'en',
  }),
}));

jest.mock('@/utils/Constants', () => ({
  getTargetTypeOptions: () => [{ label: '122cm', value: '122cm' }],
}));

// Stub the common form components; Button renders its label and marks icon presence
jest.mock('@/components/common', () => {
  const React = jest.requireActual('react');
  const { Text } = jest.requireActual('react-native');
  return {
    Input: () => null,
    Select: () => null,
    Button: (props: any) =>
      React.createElement(
        Text,
        { testID: props.testID ?? 'form-button', onPress: props.onPress },
        `${props.label}${props.icon ? '|icon' : ''}:${props.type ?? ''}`,
      ),
  };
});

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

const baseRound: RoundInput = {
  targetType: '',
  roundScore: 0,
};

const defaultProps = {
  roundIndex: 0,
  roundCount: 1,
  practiceCategory: PracticeCategory.SKIVE_INDOOR,
  onRemoveRound: jest.fn(),
  onUpdateRound: jest.fn(),
  onOpenScoring: jest.fn(),
  onStartQuickPractice: jest.fn(),
};

describe('RoundCard quick practice button', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the quick-practice button as outline with an icon inside the card when distance and target are set', async () => {
    const onStartQuickPractice = jest.fn();
    const { getByTestId } = await render(
      <RoundCard
        {...defaultProps}
        round={{ ...baseRound, distanceMeters: 18, targetType: '122cm' }}
        onStartQuickPractice={onStartQuickPractice}
      />,
    );

    const btn = getByTestId('start-quick-practice-0');
    expect(btn.props.children).toContain('Skyt og klikk');
    expect(btn.props.children).toContain('|icon'); // bolt icon
    expect(btn.props.children).toContain(':outline');

    await fireEvent.press(btn);
    expect(onStartQuickPractice).toHaveBeenCalledTimes(1);
  });

  it('hides the quick-practice button when target is missing', async () => {
    const { queryByTestId } = await render(<RoundCard {...defaultProps} round={{ ...baseRound, distanceMeters: 18 }} />);
    expect(queryByTestId('start-quick-practice-0')).toBeNull();
  });

  it('adds an aim icon to the scoring button when arrows are configured', async () => {
    const { getByTestId } = await render(
      <RoundCard {...defaultProps} round={{ ...baseRound, distanceMeters: 18, targetType: '122cm', numberArrows: 6 }} />,
    );

    const scoreBtn = getByTestId('form-button');
    expect(scoreBtn.props.children).toContain('|icon'); // bullseye icon
  });
});
