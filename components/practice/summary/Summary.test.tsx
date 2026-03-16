import React from 'react';
import { render } from '@testing-library/react-native';
import Summary from './Summary';
import { Environment, Practice } from '@/types';
import * as helpers from '../helpers/sumArrows';

describe('Summary', () => {
  const practices: Practice[] = [
    {
      id: '1',
      date: new Date('2024-07-01'),
      totalScore: 100,
      environment: Environment.OUTDOOR,
      ends: [{ id: '1', practiceId: '1', arrows: 10, scores: [9, 10, 9, 9, 10, 9, 9, 10, 9, 10] }],
    },
    {
      id: '2',
      date: new Date('2024-07-28'),
      totalScore: 150,
      environment: Environment.OUTDOOR,
      ends: [{ id: '2', practiceId: '2', arrows: 15, scores: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10] }],
    },
    {
      id: '3',
      date: new Date('2024-06-05'),
      totalScore: 200,
      environment: Environment.OUTDOOR,
      ends: [{ id: '3', practiceId: '3', arrows: 20, scores: [] }],
    },
    {
      id: '4',
      date: new Date('2024-05-20'),
      totalScore: 50,
      environment: Environment.INDOOR,
      ends: [{ id: '4', practiceId: '4', arrows: 5, scores: [10, 9, 10, 9, 10] }],
    },
  ];

  beforeEach(() => {
    jest.spyOn(helpers, 'sumArrows').mockImplementation((practices, period) => {
      if (period === '7days') return 15;
      if (period === 'month') return 25;
      return 35;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the summary title', () => {
    const { getByText } = render(<Summary practices={practices} />);
    expect(getByText('Oppsummering')).toBeTruthy();
  });

  it('renders arrow counts for last 7 days', () => {
    const { getByText } = render(<Summary practices={practices} />);
    expect(getByText('Siste 7 dagene')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
  });

  it('renders arrow counts for this month', () => {
    const { getByText } = render(<Summary practices={practices} />);
    expect(getByText('Denne måneden')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
  });

  it('renders total arrow count', () => {
    const { getByText } = render(<Summary practices={practices} />);
    expect(getByText('Totalt')).toBeTruthy();
    expect(getByText('35')).toBeTruthy();
  });

  it('calls sumArrows with correct arguments', () => {
    render(<Summary practices={practices} />);
    expect(helpers.sumArrows).toHaveBeenCalledWith(practices, '7days');
    expect(helpers.sumArrows).toHaveBeenCalledWith(practices, 'month');
    expect(helpers.sumArrows).toHaveBeenCalledWith(practices);
  });

  it('renders correctly with empty trainings array', () => {
    jest.spyOn(helpers, 'sumArrows').mockImplementation(() => 0);
    const { getAllByText } = render(<Summary practices={[]} />);
    expect(getAllByText('0')).toHaveLength(3);
  });
});
