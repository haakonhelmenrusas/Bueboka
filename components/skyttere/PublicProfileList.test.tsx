import React from 'react';
import { render } from '@testing-library/react-native';
import { PublicProfileList } from './PublicProfileList';

const alice = { id: '1', name: 'Alice Archer', club: 'Sarpsborg Bueskyttere' };
const bob = { id: '2', name: 'Bob Bowman', club: 'Oslo Bueskyttere' };
const noClub = { id: '3', name: 'Charlie' };

describe('PublicProfileList', () => {
  describe('loading state', () => {
    it('shows a loading spinner and text', () => {
      const { getByText } = render(<PublicProfileList profiles={[]} loading={true} searched={false} query="" />);
      expect(getByText('Søker...')).toBeTruthy();
    });

    it('does not show results while loading', () => {
      const { queryByText } = render(<PublicProfileList profiles={[alice]} loading={true} searched={false} query="" />);
      expect(queryByText('Alice Archer')).toBeNull();
    });
  });

  describe('idle state (before first search)', () => {
    it('renders nothing when not yet searched', () => {
      const { toJSON } = render(<PublicProfileList profiles={[]} loading={false} searched={false} query="" />);
      expect(toJSON()).toBeNull();
    });
  });

  describe('empty results', () => {
    it('shows "Ingen resultater" heading', () => {
      const { getByText } = render(<PublicProfileList profiles={[]} loading={false} searched={true} query="xyz" />);
      expect(getByText('Ingen resultater')).toBeTruthy();
    });

    it('includes the search query in the sub-message', () => {
      const { getByText } = render(<PublicProfileList profiles={[]} loading={false} searched={true} query="xyz" />);
      expect(getByText(/xyz/)).toBeTruthy();
    });
  });

  describe('results', () => {
    it('renders a profile card with name and club', () => {
      const { getByText } = render(<PublicProfileList profiles={[alice]} loading={false} searched={true} query="alice" />);
      expect(getByText('Alice Archer')).toBeTruthy();
      expect(getByText('Sarpsborg Bueskyttere')).toBeTruthy();
    });

    it('renders all profiles when multiple are returned', () => {
      const { getByText } = render(<PublicProfileList profiles={[alice, bob]} loading={false} searched={true} query="bue" />);
      expect(getByText('Alice Archer')).toBeTruthy();
      expect(getByText('Bob Bowman')).toBeTruthy();
    });

    it('does not crash when a profile has no club', () => {
      const { getByText, queryByText } = render(<PublicProfileList profiles={[noClub]} loading={false} searched={true} query="charlie" />);
      expect(getByText('Charlie')).toBeTruthy();
      expect(queryByText('undefined')).toBeNull();
    });

    it('does not render the club row when club is absent', () => {
      const { queryByText } = render(<PublicProfileList profiles={[noClub]} loading={false} searched={true} query="charlie" />);
      // No club text should appear at all
      expect(queryByText('Sarpsborg Bueskyttere')).toBeNull();
    });
  });
});
