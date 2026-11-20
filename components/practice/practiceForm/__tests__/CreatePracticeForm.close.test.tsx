import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import CreatePracticeForm from '../CreatePracticeForm';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }));
jest.mock('expo-observe', () => ({ Observe: { reportError: jest.fn() } }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/contexts', () => ({
  useTranslation: () => ({ t: new Proxy({}, { get: (_target, key) => String(key) }), locale: 'en' }),
}));

const mockRepoDelete = jest.fn();
jest.mock('@/services/repositories', () => ({
  practiceRepository: {
    create: jest.fn(),
    update: jest.fn(),
    delete: (...args: any[]) => mockRepoDelete(...args),
  },
}));

jest.mock('@/utils/helpers/practiceHelpers', () => ({
  buildEndData: (rounds: unknown[]) => rounds,
}));

jest.mock('@/components/common', () => {
  const React = jest.requireActual('react');
  const { Pressable, Text } = jest.requireActual('react-native');
  return {
    ModalWrapper: ({ visible, children }: any) => (visible ? React.createElement(React.Fragment, null, children) : null),
    ModalHeader: ({ onPress }: any) =>
      React.createElement(Pressable, { testID: 'modal-header-close', onPress }, React.createElement(Text, null, 'close')),
    Button: (props: any) => React.createElement(Text, { testID: props.testID ?? 'button', onPress: props.onPress }, props.label),
  };
});

// Capture ConfirmModal props so tests can see visibility and trigger confirm/cancel
let mockConfirmModalProps: any = null;
let mockCloseConfirmProps: any = null;
jest.mock('@/components/home/DeleteArrowSetModal/ConfirmModal', () => ({
  __esModule: true,
  default: (props: any) => {
    const React = jest.requireActual('react');
    const { Pressable } = jest.requireActual('react-native');
    if (props.title === 'practiceForm.discardTitle') mockCloseConfirmProps = props;
    else mockConfirmModalProps = props;
    if (!props.visible) return null;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Pressable, { testID: 'confirm-cancel', onPress: props.onCancel }),
      React.createElement(Pressable, { testID: 'confirm-confirm', onPress: props.onConfirm }),
    );
  },
}));

jest.mock('@/components/practice/shared/StepIndicator', () => ({ StepIndicator: () => null }));
jest.mock('@/components/practice/shared/NavigationFooter', () => ({
  NavigationFooter: (props: any) => {
    const React = jest.requireActual('react');
    const { Pressable } = jest.requireActual('react-native');
    return React.createElement(Pressable, { testID: 'nav-delete', onPress: props.onDelete });
  },
}));
jest.mock('@/components/practice/shared/useStepNavigation', () => ({
  useStepNavigation: () => ({ step: 0, setStep: jest.fn(), goNext: jest.fn(), goPrev: jest.fn(), resetStep: jest.fn() }),
}));
jest.mock('../ScoringModal', () => ({ ScoringModal: () => null }));
jest.mock('../RoundsStep', () => ({ RoundsStep: () => null }));
jest.mock('../ReflectionStep', () => ({ ReflectionStep: () => null }));
jest.mock('../InfoStep', () => ({
  InfoStep: (props: any) => {
    const React = jest.requireActual('react');
    const { Pressable } = jest.requireActual('react-native');
    return React.createElement(Pressable, { testID: 'set-location', onPress: () => props.onLocationChange('Oslo') });
  },
}));

const renderForm = async (props: Partial<React.ComponentProps<typeof CreatePracticeForm>> = {}) => {
  const onClose = jest.fn();
  const screen = await render(<CreatePracticeForm visible onClose={onClose} bows={[]} arrowSets={[]} {...props} />);
  return { onClose, ...screen };
};

describe('CreatePracticeForm close (X button)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirmModalProps = null;
    mockCloseConfirmProps = null;
    mockRepoDelete.mockResolvedValue(undefined);
  });

  it('closes directly via onClose when the form has no changes', async () => {
    const { getByTestId, onClose } = await renderForm();

    await act(async () => {
      fireEvent.press(getByTestId('modal-header-close'));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockCloseConfirmProps?.visible).toBeFalsy();
  });

  it('shows the discard confirmation when there are unsaved changes, and closes on confirm', async () => {
    const { getByTestId, onClose } = await renderForm();

    // Make the form dirty
    await act(async () => {
      fireEvent.press(getByTestId('set-location'));
    });

    await act(async () => {
      fireEvent.press(getByTestId('modal-header-close'));
    });

    // Confirm dialog shown, form not closed yet
    expect(onClose).not.toHaveBeenCalled();
    await waitFor(() => expect(mockCloseConfirmProps?.visible).toBe(true));

    await act(async () => {
      fireEvent.press(getByTestId('confirm-confirm'));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stays open when the discard confirmation is cancelled', async () => {
    const { getByTestId, onClose } = await renderForm();

    await act(async () => {
      fireEvent.press(getByTestId('set-location'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('modal-header-close'));
    });
    await waitFor(() => expect(mockCloseConfirmProps?.visible).toBe(true));

    await act(async () => {
      fireEvent.press(getByTestId('confirm-cancel'));
    });

    expect(onClose).not.toHaveBeenCalled();
    await waitFor(() => expect(mockCloseConfirmProps?.visible).toBe(false));
  });

  it('renders the discard confirmation embedded in the form modal (no second native Modal)', async () => {
    const { getByTestId } = await renderForm();

    await act(async () => {
      fireEvent.press(getByTestId('set-location'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('modal-header-close'));
    });

    await waitFor(() => expect(mockCloseConfirmProps?.visible).toBe(true));
    expect(mockCloseConfirmProps?.embedded).toBe(true);
  });

  it('shows the discard confirmation even when favorites auto-select on a fresh form', async () => {
    const favBow = { id: 'bow-1', name: 'Min bue', isFavorite: true } as any;
    const { getByTestId, onClose } = await renderForm({ bows: [favBow] });

    // A favorite bow auto-selects, so the form counts as changed
    await act(async () => {
      fireEvent.press(getByTestId('modal-header-close'));
    });

    await waitFor(() => expect(mockCloseConfirmProps?.visible).toBe(true));
    expect(onClose).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(getByTestId('confirm-confirm'));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deletes the practice and notifies onPracticeSaved when the delete is confirmed (edit mode)', async () => {
    const editingPractice = {
      id: 'p-1',
      date: '2026-11-20T10:00:00.000Z',
      practiceCategory: 'SKIVE_INDOOR',
      environment: 'INDOOR',
      weather: [],
      location: '',
      bowId: '',
      arrowsId: '',
      rating: null,
      notes: '',
      ends: [],
    } as any;
    const onPracticeSaved = jest.fn();
    const { getByTestId, onClose } = await renderForm({ editingPractice, onPracticeSaved });

    await act(async () => {
      fireEvent.press(getByTestId('nav-delete'));
    });
    await waitFor(() => expect(mockConfirmModalProps?.visible).toBe(true));
    expect(mockConfirmModalProps?.embedded).toBe(true);

    await act(async () => {
      fireEvent.press(getByTestId('confirm-confirm'));
    });

    await waitFor(() => expect(mockRepoDelete).toHaveBeenCalledWith('p-1'));
    await waitFor(() => expect(onPracticeSaved).toHaveBeenCalledTimes(1));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
