import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { CompetitionCard } from '../CompetitionCard';
import type { Competition } from '@/types';
import { Environment, PracticeCategory } from '@/types';

// jestSetup mocks LanguageContext with the real Norwegian translations (t = no)

const base: Competition = {
  id: 'c1',
  userId: 'u1',
  date: '2026-10-04T10:00:00',
  name: 'NM Innendørs 2026',
  location: 'Oslo Spektrum',
  organizerName: 'NSF',
  environment: Environment.INDOOR,
  weather: [],
  practiceCategory: PracticeCategory.SKIVE_INDOOR,
  notes: null,
  placement: 3,
  numberOfParticipants: 120,
  personalBest: true,
  totalScore: 640,
  bowId: null,
  arrowsId: null,
  rounds: [],
  createdAt: '2026-10-04T10:00:00',
  updatedAt: '2026-10-04T10:00:00',
};

describe('CompetitionCard', () => {
  it('renders name, location, placement and score', async () => {
    const { getByText } = await render(<CompetitionCard competition={base} onPress={jest.fn()} />);

    expect(getByText('NM Innendørs 2026')).toBeTruthy();
    expect(getByText('Oslo Spektrum')).toBeTruthy();
    expect(getByText('Plassering: 3')).toBeTruthy();
    expect(getByText('Poeng: 640')).toBeTruthy();
  });

  it('omits placement and location rows when not set', async () => {
    const { queryByText, getByText } = await render(
      <CompetitionCard competition={{ ...base, placement: null, location: null }} onPress={jest.fn()} />,
    );
    expect(queryByText(/Plassering/)).toBeNull();
    expect(queryByText('Oslo Spektrum')).toBeNull();
    expect(getByText('Poeng: 640')).toBeTruthy();
  });

  it('calls onPress with the competition when pressed', async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(<CompetitionCard competition={base} onPress={onPress} />);

    await fireEvent.press(getByTestId('competition-card-c1'));
    expect(onPress).toHaveBeenCalledWith(base);
  });
});
