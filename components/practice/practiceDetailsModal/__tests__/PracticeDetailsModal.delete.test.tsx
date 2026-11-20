import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { PracticeDetailsModal } from '../PracticeDetailsModal';

const mockDeletePractice = jest.fn();
const mockDeleteCompetition = jest.fn();
jest.mock('@/services/repositories', () => ({
  practiceRepository: { delete: (...args: any[]) => mockDeletePractice(...args) },
  competitionRepository: { delete: (...args: any[]) => mockDeleteCompetition(...args) },
}));

jest.mock('@/contexts', () => ({
  useTranslation: () => ({ t: new Proxy({}, { get: (_t, key) => String(key) }), locale: 'no' }),
}));

jest.mock('@/components/common', () => {
  const React = jest.requireActual('react');
  const { Pressable, Text } = jest.requireActual('react-native');
  return {
    ModalWrapper: ({ visible, children }: any) => (visible ? React.createElement(React.Fragment, null, children) : null),
    ModalHeader: () => null,
    Button: (props: any) =>
      React.createElement(
        Pressable,
        { testID: `btn-${props.label}`, onPress: props.onPress },
        React.createElement(Text, null, props.label),
      ),
  };
});

jest.mock('@/components/practice/shareCard', () => ({ ShareSessionModal: () => null }));
jest.mock('../Badges', () => ({ PracticeTypeBadge: () => null, EnvironmentBadge: () => null }));
jest.mock('../StatCard', () => ({ StatCard: () => null }));
jest.mock('../RoundCard', () => ({ RoundCard: () => null }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: ({ children }: any) => children }));
jest.mock('@fortawesome/react-native-fontawesome', () => ({ FontAwesomeIcon: () => null }));

const practice = {
  id: 'p-1',
  date: '2026-11-20T10:00:00.000Z',
  practiceCategory: 'SKIVE_INDOOR',
  environment: 'INDOOR',
  ends: [],
} as any;

const competition = {
  id: 'c-1',
  date: '2026-11-20T10:00:00.000Z',
  name: 'NM',
  rounds: [],
} as any;

// Capture the Alert.alert buttons so the test can press "delete"
let alertButtons: any[] = [];

describe('PracticeDetailsModal delete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    alertButtons = [];
    jest.spyOn(Alert, 'alert').mockImplementation((_title: any, _msg: any, buttons?: any[]) => {
      alertButtons = buttons ?? [];
      return undefined as any;
    });
    mockDeletePractice.mockResolvedValue(undefined);
    mockDeleteCompetition.mockResolvedValue(undefined);
  });

  it('deletes a practice and calls onDeleted (which triggers the list refetch) + onClose', async () => {
    const onDeleted = jest.fn();
    const onClose = jest.fn();
    const screen = await render(<PracticeDetailsModal visible practice={practice} onClose={onClose} onDeleted={onDeleted} />);

    await act(async () => {
      fireEvent.press(screen.getByTestId('btn-common.delete'));
    });
    expect(Alert.alert).toHaveBeenCalledTimes(1);

    const destructive = alertButtons.find((b) => b.style === 'destructive');
    await act(async () => {
      await destructive.onPress();
    });

    await waitFor(() => expect(mockDeletePractice).toHaveBeenCalledWith('p-1'));
    await waitFor(() => expect(onDeleted).toHaveBeenCalledWith('p-1'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockDeleteCompetition).not.toHaveBeenCalled();
  });

  it('deletes a competition via the competition repository and calls onDeleted', async () => {
    const onDeleted = jest.fn();
    const onClose = jest.fn();
    const screen = await render(<PracticeDetailsModal visible practice={competition} onClose={onClose} onDeleted={onDeleted} />);

    await act(async () => {
      fireEvent.press(screen.getByTestId('btn-common.delete'));
    });
    const destructive = alertButtons.find((b) => b.style === 'destructive');
    await act(async () => {
      await destructive.onPress();
    });

    await waitFor(() => expect(mockDeleteCompetition).toHaveBeenCalledWith('c-1'));
    await waitFor(() => expect(onDeleted).toHaveBeenCalledWith('c-1'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockDeletePractice).not.toHaveBeenCalled();
  });

  it('does not call onDeleted when the delete fails', async () => {
    mockDeletePractice.mockRejectedValue(new Error('API request failed'));
    const onDeleted = jest.fn();
    const onClose = jest.fn();
    const screen = await render(<PracticeDetailsModal visible practice={practice} onClose={onClose} onDeleted={onDeleted} />);

    await act(async () => {
      fireEvent.press(screen.getByTestId('btn-common.delete'));
    });
    const destructive = alertButtons.find((b) => b.style === 'destructive');
    await act(async () => {
      await destructive.onPress();
    });

    await waitFor(() => expect(mockDeletePractice).toHaveBeenCalledWith('p-1'));
    expect(onDeleted).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
