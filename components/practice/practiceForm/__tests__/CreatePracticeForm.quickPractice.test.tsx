import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import CreatePracticeForm from '../CreatePracticeForm';
import { consumeQuickPracticeLaunched } from '@/utils/quickPractice';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  multiGet: jest.fn().mockResolvedValue([
    ['bueboka_last_distance', '18'],
    ['bueboka_last_target', '80cm'],
  ]),
  multiSet: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/contexts', () => ({
  useTranslation: () => ({ t: new Proxy({}, { get: (_target, key) => String(key) }), locale: 'en' }),
}));

jest.mock('@/services/repositories', () => ({
  practiceRepository: { create: jest.fn(), update: jest.fn(), delete: jest.fn() },
}));

jest.mock('@/utils/helpers/practiceHelpers', () => ({
  buildEndData: (rounds: unknown[]) => rounds,
}));

jest.mock('@/components/common', () => {
  const React = jest.requireActual('react');
  return {
    ModalWrapper: ({ visible, children }: any) => (visible ? React.createElement(React.Fragment, null, children) : null),
    ModalHeader: () => null,
    Button: (props: any) => React.createElement('Text', { testID: props.testID ?? 'button', onPress: props.onPress }, props.label),
  };
});

jest.mock('@/components/home/DeleteArrowSetModal/ConfirmModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/practice/shared/StepIndicator', () => ({ StepIndicator: () => null }));
jest.mock('@/components/practice/shared/NavigationFooter', () => ({ NavigationFooter: () => null }));
// Start directly on the rounds step, where the quick-practice button lives
jest.mock('@/components/practice/shared/useStepNavigation', () => ({
  useStepNavigation: () => ({ step: 1, setStep: jest.fn(), goNext: jest.fn(), goPrev: jest.fn(), resetStep: jest.fn() }),
}));
jest.mock('../InfoStep', () => ({ InfoStep: () => null }));
jest.mock('../ReflectionStep', () => ({ ReflectionStep: () => null }));
jest.mock('../ScoringModal', () => ({ ScoringModal: () => null }));

// Capture the rounds prop and expose a button that starts quick practice on round 0
let mockRoundsStepProps: any = null;
jest.mock('../RoundsStep', () => ({
  RoundsStep: (props: any) => {
    mockRoundsStepProps = props;
    const React = jest.requireActual('react');
    const { Pressable, Text } = jest.requireActual('react-native');
    return React.createElement(
      Pressable,
      { testID: 'start-quick-practice', onPress: () => props.onStartQuickPractice(0) },
      React.createElement(Text, null, 'quick'),
    );
  },
}));

const renderForm = async (visible: boolean, onClose = jest.fn(), onHide = jest.fn()) => {
  const screen = await render(<CreatePracticeForm visible={visible} onClose={onClose} onHide={onHide} bows={[]} arrowSets={[]} />);
  return { onClose, onHide, ...screen };
};

describe('CreatePracticeForm quick practice handoff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRoundsStepProps = null;
    // drain any launched flag from previous tests
    consumeQuickPracticeLaunched();
  });

  it('hides the form modal before pushing /hurtigtrening (pushed screen must not open behind the RN Modal)', async () => {
    const onClose = jest.fn();
    const onHide = jest.fn();
    const { getByTestId } = await renderForm(true, onClose, onHide);

    await waitFor(() => expect(mockRoundsStepProps?.rounds?.[0]?.distanceMeters).toBe(18));
    await waitFor(() => expect(mockRoundsStepProps?.rounds?.[0]?.targetType).toBe('80cm'));

    await act(async () => {
      fireEvent.press(getByTestId('start-quick-practice'));
    });

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/hurtigtrening' }));
    expect(consumeQuickPracticeLaunched()).toBe(true);
  });

  it('preserves the form state when the modal is hidden and re-opened after quick practice', async () => {
    const onHide = jest.fn();
    const { getByTestId, rerender } = await renderForm(true, jest.fn(), onHide);

    await waitFor(() => expect(mockRoundsStepProps?.rounds?.[0]?.targetType).toBe('80cm'));

    await act(async () => {
      fireEvent.press(getByTestId('start-quick-practice'));
    });

    const props = (visible: boolean) => (
      <CreatePracticeForm visible={visible} onClose={jest.fn()} onHide={onHide} bows={[]} arrowSets={[]} />
    );

    await act(async () => {
      rerender(props(false));
    });
    await act(async () => {
      rerender(props(true));
    });

    // The round configured before the handoff is still there — not reset
    expect(mockRoundsStepProps?.rounds?.[0]?.distanceMeters).toBe(18);
    expect(mockRoundsStepProps?.rounds?.[0]?.targetType).toBe('80cm');
  });
});
