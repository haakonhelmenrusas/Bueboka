import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { MobileActionButton } from '../MobileActionButton/MobileActionButton';

// jestSetup mocks LanguageContext with the real Norwegian translations (t = no)

const handlers = {
  onCreatePractice: jest.fn(),
  onCreateChallenge: jest.fn(),
  onCreateCompetition: jest.fn(),
  onCreateBow: jest.fn(),
  onCreateArrows: jest.fn(),
};

describe('MobileActionButton', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows "Ny utfordring" directly after "Ny trening" and calls onCreateChallenge', async () => {
    const { getByTestId, getByText } = await render(<MobileActionButton {...handlers} />);

    await fireEvent.press(getByTestId('fab-toggle'));

    expect(getByText('Ny trening')).toBeTruthy();
    expect(getByText('Ny utfordring')).toBeTruthy();

    await fireEvent.press(getByTestId('fab-action-challenge'));
    expect(handlers.onCreateChallenge).toHaveBeenCalledTimes(1);
    expect(handlers.onCreatePractice).not.toHaveBeenCalled();
  });

  it('calls onCreatePractice for the practice action', async () => {
    const { getByTestId } = await render(<MobileActionButton {...handlers} />);

    await fireEvent.press(getByTestId('fab-toggle'));
    await fireEvent.press(getByTestId('fab-action-practice'));

    expect(handlers.onCreatePractice).toHaveBeenCalledTimes(1);
  });
});
