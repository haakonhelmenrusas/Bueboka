import React from 'react';
import { render } from '@testing-library/react-native';
import Summary from './Summary';
import { End, Environment, Practice, PracticeCategory } from '@/types';
import * as helpers from '../helpers/sumArrows';

describe('Summary', () => {
  const makeEnd = (id: string, practiceId: string, arrows: number | null, scores: number[]): End => ({
    id,
    practiceId,
    arrows,
    arrowsWithoutScore: 0,
    scores,
    roundScore: null,
    distanceMeters: null,
    distanceFrom: null,
    distanceTo: null,
    targetSizeCm: null,
    targetType: null,
    arrowsPerEnd: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  });

  const makePractice = (id: string, date: string, totalScore: number, environment: Environment, end: End): Practice => ({
    id,
    userId: 'user-1',
    date,
    notes: null,
    totalScore,
    rating: null,
    location: null,
    environment,
    weather: [],
    practiceCategory: PracticeCategory.SKIVE_INDOOR,
    roundTypeId: null,
    bowId: null,
    arrowsId: null,
    ends: [end],
    createdAt: date,
    updatedAt: date,
  });

  const practices: Practice[] = [
    makePractice('1', '2024-07-01', 100, Environment.OUTDOOR, makeEnd('1', '1', 10, [9, 10, 9, 9, 10, 9, 9, 10, 9, 10])),
    makePractice('2', '2024-07-28', 150, Environment.OUTDOOR, makeEnd('2', '2', 15, Array(15).fill(10))),
    makePractice('3', '2024-06-05', 200, Environment.OUTDOOR, makeEnd('3', '3', 20, [])),
    makePractice('4', '2024-05-20', 50, Environment.INDOOR, makeEnd('4', '4', 5, [10, 9, 10, 9, 10])),
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

  it('renders the summary title', async () => {
    const { getByText } = await render(<Summary practices={practices} />);
    expect(getByText('Oppsummering')).toBeTruthy();
  });

  it('renders arrow counts for last 7 days', async () => {
    const { getByText } = await render(<Summary practices={practices} />);
    expect(getByText('Siste 7 dagene')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
  });

  it('renders arrow counts for this month', async () => {
    const { getByText } = await render(<Summary practices={practices} />);
    expect(getByText('Denne måneden')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
  });

  it('renders total arrow count', async () => {
    const { getByText } = await render(<Summary practices={practices} />);
    expect(getByText('Totalt')).toBeTruthy();
    expect(getByText('35')).toBeTruthy();
  });

  it('calls sumArrows with correct arguments', async () => {
    await render(<Summary practices={practices} />);
    expect(helpers.sumArrows).toHaveBeenCalledWith(practices, '7days');
    expect(helpers.sumArrows).toHaveBeenCalledWith(practices, 'month');
    expect(helpers.sumArrows).toHaveBeenCalledWith(practices);
  });

  it('renders correctly with empty trainings array', async () => {
    jest.spyOn(helpers, 'sumArrows').mockImplementation(() => 0);
    const { getAllByText } = await render(<Summary practices={[]} />);
    expect(getAllByText('0')).toHaveLength(3);
  });
});
