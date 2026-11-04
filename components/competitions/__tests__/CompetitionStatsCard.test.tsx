import React from 'react';
import { render } from '@testing-library/react-native';
import { CompetitionStatsCard } from '../CompetitionStatsCard';
import type { CompetitionStats } from '@/types';

// jestSetup mocks LanguageContext with the real Norwegian translations (t = no)

const stats: CompetitionStats = {
  total: 12,
  active: 2,
  podiums: 5,
  personalBests: 3,
  bestPlacement: 1,
  averageScore: 587.5,
};

describe('CompetitionStatsCard', () => {
  it('renders the overview title and all stat labels with values', async () => {
    const { getByText } = await render(<CompetitionStatsCard stats={stats} />);

    expect(getByText('Oversikt')).toBeTruthy();
    expect(getByText('Totalt')).toBeTruthy();
    expect(getByText('12')).toBeTruthy();
    expect(getByText('Aktive')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('Pallplasser')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('Personlige rekorder')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('Beste plassering')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
    expect(getByText('Snittpoeng')).toBeTruthy();
    expect(getByText('587.5')).toBeTruthy();
  });

  it('renders a dash for missing bestPlacement and averageScore', async () => {
    const empty: CompetitionStats = {
      total: 0,
      active: 0,
      podiums: 0,
      personalBests: 0,
      bestPlacement: null,
      averageScore: null,
    };
    const { getAllByText } = await render(<CompetitionStatsCard stats={empty} />);
    expect(getAllByText('–')).toHaveLength(2);
  });
});
