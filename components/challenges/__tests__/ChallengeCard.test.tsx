import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ChallengeCard from '../ChallengeCard';
import { ChallengeListItem, ChallengeStatus } from '@/types';

// Mock useTranslation
jest.mock('@/contexts', () => ({
  useTranslation: () => ({
    t: {
      'challenge.opponent': 'Opponent',
      'challenge.created': 'Created',
      'challenge.unknownOpponent': 'Unknown opponent',
      'challenge.statusPending': 'Pending',
      'challenge.statusAccepted': 'Accepted',
      'challenge.statusDeclined': 'Declined',
      'challenge.statusCompleted': 'Completed',
      'challenge.statusCancelled': 'Cancelled',
    },
    locale: 'en',
  }),
}));

// Mock colors
jest.mock('@/styles/colors', () => ({
  colors: {
    primary: '#007AFF',
    white: '#FFFFFF',
    background: '#F8F9FA',
    text: '#212529',
    textSecondary: '#6C757D',
    error: '#DC3545',
    warning: '#FFC107',
    success: '#28A745',
    black: '#000000',
  },
}));

// Mock FontAwesomeIcon
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, size, color }: any) => <></>,
}));

// Mock icons
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faUser: 'faUser',
  faCalendar: 'faCalendar',
  faClock: 'faClock',
  faCheckCircle: 'faCheckCircle',
  faTimesCircle: 'faTimesCircle',
  faExclamationCircle: 'faExclamationCircle',
  faTrophy: 'faTrophy',
  faBan: 'faBan',
}));

describe('ChallengeCard', () => {
  const mockChallenge: ChallengeListItem = {
    id: '1',
    challengerId: 'user1',
    challengedId: 'user2',
    name: 'Test Challenge',
    status: ChallengeStatus.PENDING,
    challengerName: 'User One',
    challengedName: 'User Two',
    challengerScore: null,
    challengedScore: null,
    winnerId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockOnPress = jest.fn();

  it('renders challenge name', async () => {
    const { getByText } = await render(<ChallengeCard challenge={mockChallenge} onPress={mockOnPress} />);

    expect(getByText('Test Challenge')).toBeTruthy();
  });

  it('renders opponent name', async () => {
    const { getByText } = await render(<ChallengeCard challenge={mockChallenge} onPress={mockOnPress} />);

    expect(getByText('Opponent: User One')).toBeTruthy();
  });

  it('shows the challenged user as opponent when current user is the challenger', async () => {
    const { getByText } = await render(<ChallengeCard challenge={mockChallenge} onPress={mockOnPress} currentUserId="user1" />);

    expect(getByText('Opponent: User Two')).toBeTruthy();
  });

  it('shows the challenger as opponent when current user is the challenged', async () => {
    const { getByText } = await render(<ChallengeCard challenge={mockChallenge} onPress={mockOnPress} currentUserId="user2" />);

    expect(getByText('Opponent: User One')).toBeTruthy();
  });

  it('falls back to whichever name is available instead of Unknown opponent', async () => {
    const partial = { ...mockChallenge, challengerName: null, challengedName: 'User Two' };
    const { getByText, queryByText } = await render(<ChallengeCard challenge={partial} onPress={mockOnPress} currentUserId="user2" />);

    expect(getByText('Opponent: User Two')).toBeTruthy();
    expect(queryByText(/Unknown opponent/)).toBeNull();
  });

  it('shows Unknown opponent only when no names are present at all', async () => {
    const noNames = { ...mockChallenge, challengerName: null, challengedName: null };
    const { getByText } = await render(<ChallengeCard challenge={noNames} onPress={mockOnPress} currentUserId="user1" />);

    expect(getByText('Opponent: Unknown opponent')).toBeTruthy();
  });

  it('renders status badge', async () => {
    const { getByText } = await render(<ChallengeCard challenge={mockChallenge} onPress={mockOnPress} />);

    expect(getByText('Pending')).toBeTruthy();
  });

  it('renders created date', async () => {
    const { getByText } = await render(<ChallengeCard challenge={mockChallenge} onPress={mockOnPress} />);

    expect(getByText(/Created:/)).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const { getByTestId } = await render(<ChallengeCard challenge={mockChallenge} onPress={mockOnPress} />);

    await fireEvent.press(getByTestId('challenge-card'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(mockChallenge);
  });

  it('renders score when available', async () => {
    const completedChallenge: ChallengeListItem = {
      ...mockChallenge,
      status: ChallengeStatus.COMPLETED,
      challengerScore: 100,
      challengedScore: 90,
    };

    const { getByText } = await render(<ChallengeCard challenge={completedChallenge} onPress={mockOnPress} />);

    expect(getByText('100 - 90')).toBeTruthy();
  });
});
