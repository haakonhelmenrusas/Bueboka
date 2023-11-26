import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { CalculatedMarks } from '../../../../types';
import SetModal from './SetModal';

describe('SetModal', () => {
  const closeModalMock = jest.fn();
  const setBallisticsMock = jest.fn();
  const ballisticsMock: CalculatedMarks = {
    initial_arrow_speed: 1,
    cd: 2,
    arrow_mass_gram: 1,
    arrow_diameter_mm: 1,
    length_eye_sight_cm: 2,
    length_nock_eye_cm: 2,
    sight_scaling: 1,
    marks_bias: 1,
    marks_std_deviation: 1,
    given_distances: [10, 20, 30],
    given_marks: [2, 3, 4],
    calculated_marks: [],
    marks_deviation: [],
    arrow_speeds_at_distance: [34, 34, 34],
    relative_arrow_speeds_at_distance: [35, 35, 35],
    times_at_distance: [12, 12, 12],
    ballistics_pars: [23, 23, 23],
  };

  it('should render correctly', () => {
    const { getByText } = render(
      <SetModal
        modalVisible={true}
        closeModal={closeModalMock}
        setBallistics={setBallisticsMock}
        ballistics={ballisticsMock}
      />,
    );

    expect(getByText('Sett navn på settet')).toBeTruthy();
  });

  it('should handle save correctly', async () => {
    const { getByText } = render(
      <SetModal
        modalVisible={true}
        closeModal={closeModalMock}
        setBallistics={setBallisticsMock}
        ballistics={ballisticsMock}
      />,
    );

    const input = getByText('Sett navn på settet');
    fireEvent.changeText(input, 'Test Set');

    const saveButton = getByText('Lagre sett');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(setBallisticsMock).toHaveBeenCalledWith(null);
      expect(closeModalMock).toHaveBeenCalled();
    });
  });
});
