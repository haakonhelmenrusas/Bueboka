import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ScoreButtonGrid } from '../ScoreButtonGrid';
import { PracticeCategory } from '@/types';
import { resolveScoringScheme } from '@/utils/helpers/scoringHelpers';

describe('ScoreButtonGrid', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders one button per option in the WA 10-ring scheme (outdoor, with X)', async () => {
    const scheme = resolveScoringScheme(PracticeCategory.SKIVE_OUTDOOR, '80cm');
    const onScorePress = jest.fn();
    const { getByTestId, queryByTestId } = await render(<ScoreButtonGrid options={scheme.options} onScorePress={onScorePress} />);

    expect(getByTestId('score-button-X')).toBeTruthy();
    expect(getByTestId('score-button-10')).toBeTruthy();
    expect(getByTestId('score-button-1')).toBeTruthy();
    expect(getByTestId('score-button-M')).toBeTruthy();
    expect(queryByTestId('score-button-11')).toBeNull();

    await fireEvent.press(getByTestId('score-button-9'));
    expect(onScorePress).toHaveBeenCalledWith(9);

    await fireEvent.press(getByTestId('score-button-X'));
    expect(onScorePress).toHaveBeenCalledWith(10);

    await fireEvent.press(getByTestId('score-button-M'));
    expect(onScorePress).toHaveBeenCalledWith(0);
  });

  it('renders the indoor scheme without X', async () => {
    const scheme = resolveScoringScheme(PracticeCategory.SKIVE_INDOOR, '40cm');
    const { queryByTestId, getByTestId } = await render(<ScoreButtonGrid options={scheme.options} onScorePress={jest.fn()} />);

    expect(queryByTestId('score-button-X')).toBeNull();
    expect(getByTestId('score-button-10')).toBeTruthy();
    expect(getByTestId('score-button-M')).toBeTruthy();
  });

  it('renders the field scheme 6-1 + M for FELT', async () => {
    const scheme = resolveScoringScheme(PracticeCategory.FELT, '');
    const onScorePress = jest.fn();
    const { getByTestId, queryByTestId } = await render(<ScoreButtonGrid options={scheme.options} onScorePress={onScorePress} />);

    expect(getByTestId('score-button-6')).toBeTruthy();
    expect(getByTestId('score-button-1')).toBeTruthy();
    expect(queryByTestId('score-button-10')).toBeNull();
    expect(queryByTestId('score-button-X')).toBeNull();

    await fireEvent.press(getByTestId('score-button-6'));
    expect(onScorePress).toHaveBeenCalledWith(6);
  });

  it('renders the 3D scheme 11/10/8/5 + M for JAKT_3D', async () => {
    const scheme = resolveScoringScheme(PracticeCategory.JAKT_3D, '');
    const onScorePress = jest.fn();
    const { getByTestId, queryByTestId } = await render(<ScoreButtonGrid options={scheme.options} onScorePress={onScorePress} />);

    expect(getByTestId('score-button-11')).toBeTruthy();
    expect(getByTestId('score-button-5')).toBeTruthy();
    expect(queryByTestId('score-button-9')).toBeNull();

    await fireEvent.press(getByTestId('score-button-11'));
    expect(onScorePress).toHaveBeenCalledWith(11);
  });

  it('renders the 6-ring centre scheme for 80cm-centre-6', async () => {
    const scheme = resolveScoringScheme(PracticeCategory.SKIVE_OUTDOOR, '80cm-centre-6');
    const { getByTestId, queryByTestId } = await render(<ScoreButtonGrid options={scheme.options} onScorePress={jest.fn()} />);

    expect(getByTestId('score-button-X')).toBeTruthy();
    expect(getByTestId('score-button-6')).toBeTruthy();
    expect(queryByTestId('score-button-5')).toBeNull();
  });

  it('renders nothing for the NONE scheme (bare mat)', async () => {
    const scheme = resolveScoringScheme(PracticeCategory.SKIVE_INDOOR, 'bar');
    const { queryByTestId } = await render(<ScoreButtonGrid options={scheme.options} onScorePress={jest.fn()} />);
    expect(queryByTestId('score-button-M')).toBeNull();
  });
});
