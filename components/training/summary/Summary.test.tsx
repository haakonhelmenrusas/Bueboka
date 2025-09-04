import React from 'react';
import { render } from '@testing-library/react-native';
import Summary from './Summary';
import { Training } from '@/types';
import * as helpers from '../helpers/sumArrows';

describe('Summary', () => {
  const trainings: Training[] = [
    // Add mock training objects as needed for your tests
    { date: new Date('2024-07-01'), arrows: 10 },
    { date: new Date('2024-07-28'), arrows: 15 },
    { date: new Date('2024-06-05'), arrows: 20 },
    { date: new Date('2024-05-20'), arrows: 5 },
  ];

  beforeEach(() => {
    jest.spyOn(helpers, 'sumArrows').mockImplementation((trainings, period) => {
      if (period === '7days') return 15;
      if (period === 'month') return 25;
      return 35;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the summary title', () => {
    const { getByText } = render(<Summary trainings={trainings} />);
    expect(getByText('Oppsummering')).toBeTruthy();
  });

  it('renders arrow counts for last 7 days', () => {
    const { getByText } = render(<Summary trainings={trainings} />);
    expect(getByText('Siste 7 dagene')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
  });

  it('renders arrow counts for this month', () => {
    const { getByText } = render(<Summary trainings={trainings} />);
    expect(getByText('Denne måneden')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
  });

  it('renders total arrow count', () => {
    const { getByText } = render(<Summary trainings={trainings} />);
    expect(getByText('Totalt')).toBeTruthy();
    expect(getByText('35')).toBeTruthy();
  });

  it('calls sumArrows with correct arguments', () => {
    render(<Summary trainings={trainings} />);
    expect(helpers.sumArrows).toHaveBeenCalledWith(trainings, '7days');
    expect(helpers.sumArrows).toHaveBeenCalledWith(trainings, 'month');
    expect(helpers.sumArrows).toHaveBeenCalledWith(trainings);
  });

  it('renders correctly with empty trainings array', () => {
    jest.spyOn(helpers, 'sumArrows').mockImplementation(() => 0);
    const { getAllByText } = render(<Summary trainings={[]} />);
    expect(getAllByText('0')).toHaveLength(3);
  });
});
