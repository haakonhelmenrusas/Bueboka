import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import CreateChallengeModal from '../CreateChallengeModal';
import { publicProfilesApi } from '@/services';

jest.mock('@/services', () => ({
  publicProfilesApi: { search: jest.fn() },
}));

const mockCreateChallenge = jest.fn();
jest.mock('@/hooks/useChallenge', () => ({
  useChallenge: () => ({ createChallenge: mockCreateChallenge }),
}));

jest.mock('@/hooks', () => ({
  useAuth: () => ({ user: { id: 'me', name: 'Me' }, isAuthenticated: true }),
}));

// Stub the form: exposes a submit button that forwards a valid payload
jest.mock('../ChallengeForm', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { TouchableOpacity, Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    __esModule: true,
    default: ({ opponent, onSubmit }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: 'challenge-form-submit', onPress: () => onSubmit({ challengedId: opponent.id, name: 'Kamp' }) },
        React.createElement(Text, null, 'Send'),
      ),
  };
});

const mockSearch = publicProfilesApi.search as jest.Mock;

const opponent = { id: 'opp-1', name: 'Ola Nordmann', club: 'Oslo BS' } as any;

describe('CreateChallengeModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearch.mockResolvedValue([opponent]);
    mockCreateChallenge.mockResolvedValue({ id: 'ch-1' });
  });

  it('searches for an opponent, selects them, and submits the form', async () => {
    const onClose = jest.fn();
    const onSaved = jest.fn();
    const { getByTestId, findByTestId } = await render(<CreateChallengeModal visible={true} onClose={onClose} onSaved={onSaved} />);

    await fireEvent.changeText(getByTestId('challenge-opponent-search'), 'ola');

    const item = await findByTestId('challenge-opponent-opp-1');
    await fireEvent.press(item);

    // Form step shown after selecting the opponent
    const submit = await findByTestId('challenge-form-submit');
    await fireEvent.press(submit);

    await waitFor(() => {
      expect(mockCreateChallenge).toHaveBeenCalledWith({ challengedId: 'opp-1', name: 'Kamp' });
    });
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('filters out the current user from search results', async () => {
    mockSearch.mockResolvedValue([opponent, { id: 'me', name: 'Me' } as any]);
    const { getByTestId, findByTestId, queryByTestId } = await render(<CreateChallengeModal visible={true} onClose={jest.fn()} />);

    await fireEvent.changeText(getByTestId('challenge-opponent-search'), 'a');

    await findByTestId('challenge-opponent-opp-1');
    expect(queryByTestId('challenge-opponent-me')).toBeNull();
  });
});
