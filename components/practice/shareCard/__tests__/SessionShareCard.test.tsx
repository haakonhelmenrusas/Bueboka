import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SessionShareCard } from '../SessionShareCard';
import type { SessionShareData } from '../SessionShareCard';

const baseData: SessionShareData = {
  date: '2026-03-15',
  practiceType: 'TRENING',
  totalScore: 245,
  arrowsShot: 30,
  arrowsWithoutScore: 0,
  bowName: null,
  bowType: null,
  distanceMeters: null,
  category: null,
  environment: null,
  location: null,
};

describe('SessionShareCard', () => {
  it('renders the brand name and footer', () => {
    render(<SessionShareCard data={baseData} />);
    expect(screen.getByText('Bueboka')).toBeTruthy();
    expect(screen.getByText('bueboka.no')).toBeTruthy();
  });

  it('shows training badge for practice type TRENING', () => {
    render(<SessionShareCard data={baseData} />);
    expect(screen.getByText('TRENING')).toBeTruthy();
  });

  it('shows competition badge for practice type KONKURRANSE', () => {
    render(<SessionShareCard data={{ ...baseData, practiceType: 'KONKURRANSE' }} />);
    expect(screen.getByText('KONKURRANSE')).toBeTruthy();
  });

  it('shows total score and scored arrows when totalScore > 0', () => {
    render(<SessionShareCard data={{ ...baseData, totalScore: 245, arrowsShot: 30, arrowsWithoutScore: 0 }} />);
    expect(screen.getByText('TOTALSCORE')).toBeTruthy();
    expect(screen.getByText('245')).toBeTruthy();
    expect(screen.getByText('30 med scoring')).toBeTruthy();
  });

  it('shows unscored chip when there are arrows without score', () => {
    render(<SessionShareCard data={{ ...baseData, totalScore: 100, arrowsShot: 30, arrowsWithoutScore: 6 }} />);
    expect(screen.getByText('24 med scoring')).toBeTruthy();
    expect(screen.getByText('6 uten scoring')).toBeTruthy();
  });

  it('hides unscored chip when arrowsWithoutScore is 0', () => {
    render(<SessionShareCard data={{ ...baseData, totalScore: 100, arrowsShot: 30, arrowsWithoutScore: 0 }} />);
    expect(screen.getByText('30 med scoring')).toBeTruthy();
    expect(screen.queryByText(/uten scoring/)).toBeNull();
  });

  it('shows arrows shot instead of score when totalScore is 0', () => {
    render(<SessionShareCard data={{ ...baseData, totalScore: 0, arrowsShot: 50, arrowsWithoutScore: 0 }} />);
    expect(screen.getByText('PILER SKUTT')).toBeTruthy();
    expect(screen.getByText('50')).toBeTruthy();
    expect(screen.getByText('Treningsøkt')).toBeTruthy();
  });

  it('shows scored/unscored breakdown when totalScore is 0 but there are mixed arrows', () => {
    render(<SessionShareCard data={{ ...baseData, totalScore: 0, arrowsShot: 40, arrowsWithoutScore: 15 }} />);
    expect(screen.getByText('25 med scoring')).toBeTruthy();
    expect(screen.getByText('15 uten scoring')).toBeTruthy();
    expect(screen.queryByText('Treningsøkt')).toBeNull();
  });

  it('always renders the date stat', () => {
    render(<SessionShareCard data={baseData} />);
    expect(screen.getByText('DATO')).toBeTruthy();
  });

  it('renders category when provided', () => {
    render(<SessionShareCard data={{ ...baseData, category: 'Skive innendørs' }} />);
    expect(screen.getByText('KATEGORI')).toBeTruthy();
    expect(screen.getByText('Skive innendørs')).toBeTruthy();
  });

  it('does not render category when null', () => {
    render(<SessionShareCard data={{ ...baseData, category: null }} />);
    expect(screen.queryByText('KATEGORI')).toBeNull();
  });

  it('renders bow with type when both are provided', () => {
    render(<SessionShareCard data={{ ...baseData, bowName: 'Hoyt Xceed', bowType: 'Recurve' }} />);
    expect(screen.getByText('BUE')).toBeTruthy();
    expect(screen.getByText('Hoyt Xceed (Recurve)')).toBeTruthy();
  });

  it('renders bow name only when bowType is null', () => {
    render(<SessionShareCard data={{ ...baseData, bowName: 'Hoyt Xceed', bowType: null }} />);
    expect(screen.getByText('Hoyt Xceed')).toBeTruthy();
  });

  it('does not render bow when bowName is null', () => {
    render(<SessionShareCard data={{ ...baseData, bowName: null }} />);
    expect(screen.queryByText('BUE')).toBeNull();
  });

  it('renders distance when provided', () => {
    render(<SessionShareCard data={{ ...baseData, distanceMeters: 18 }} />);
    expect(screen.getByText('AVSTAND')).toBeTruthy();
    expect(screen.getByText('18 m')).toBeTruthy();
  });

  it('does not render distance when null', () => {
    render(<SessionShareCard data={{ ...baseData, distanceMeters: null }} />);
    expect(screen.queryByText('AVSTAND')).toBeNull();
  });

  it('renders environment when provided', () => {
    render(<SessionShareCard data={{ ...baseData, environment: 'Innendørs' }} />);
    expect(screen.getByText('MILJØ')).toBeTruthy();
    expect(screen.getByText('Innendørs')).toBeTruthy();
  });

  it('renders location when provided', () => {
    render(<SessionShareCard data={{ ...baseData, location: 'Oslo Bueskytterklubb' }} />);
    expect(screen.getByText('STED')).toBeTruthy();
    expect(screen.getByText('Oslo Bueskytterklubb')).toBeTruthy();
  });

  it('renders all optional stats together', () => {
    const fullData: SessionShareData = {
      ...baseData,
      category: 'Felt',
      bowName: 'Win&Win',
      bowType: 'Barebow',
      distanceMeters: 70,
      environment: 'Utendørs',
      location: 'Bærums Verk',
    };
    render(<SessionShareCard data={fullData} />);

    expect(screen.getByText('DATO')).toBeTruthy();
    expect(screen.getByText('KATEGORI')).toBeTruthy();
    expect(screen.getByText('BUE')).toBeTruthy();
    expect(screen.getByText('AVSTAND')).toBeTruthy();
    expect(screen.getByText('MILJØ')).toBeTruthy();
    expect(screen.getByText('STED')).toBeTruthy();
  });
});
