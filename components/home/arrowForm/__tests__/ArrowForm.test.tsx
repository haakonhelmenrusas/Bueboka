import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import ArrowForm from '../ArrowForm';
import { AppError } from '@/services/api/errors';
import { Material } from '@/types';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
jest.mock('@/services/repositories', () => ({
  arrowsRepository: {
    create: (...args: any[]) => mockCreate(...args),
    update: (...args: any[]) => mockUpdate(...args),
    delete: (...args: any[]) => mockDelete(...args),
    toggleFavorite: jest.fn(),
  },
}));

jest.mock('@/services', () => ({
  AppError: jest.requireActual('@/services/api/errors').AppError,
}));

const mockReportError = jest.fn();
jest.mock('expo-observe', () => ({
  Observe: { reportError: (...args: any[]) => mockReportError(...args) },
}));

jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }));

jest.mock('@/contexts', () => ({
  useTranslation: () => ({ t: new Proxy({}, { get: (_target, key) => String(key) }), locale: 'en' }),
}));

jest.mock('@/utils', () => ({
  handleNumberChange: (value: string, action: string, dispatch: any) => dispatch({ type: action, payload: value }),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

jest.mock('@/components/common', () => {
  const React = jest.requireActual('react');
  const { Pressable, Text, TextInput } = jest.requireActual('react-native');
  return {
    ModalWrapper: ({ visible, children }: any) => (visible ? React.createElement(React.Fragment, null, children) : null),
    ModalHeader: () => null,
    Button: (props: any) =>
      React.createElement(Text, { testID: `btn-${props.label}`, onPress: props.onPress, disabled: props.disabled }, props.label),
    Input: (props: any) =>
      React.createElement(TextInput, { testID: `input-${props.label}`, value: props.value, onChangeText: props.onChangeText }),
    Textarea: (props: any) =>
      React.createElement(TextInput, { testID: `input-${props.label}`, value: props.value, onChangeText: props.onChangeText }),
    Select: () => null,
    Checkbox: (props: any) => React.createElement(Pressable, { testID: 'checkbox-favorite', onPress: () => props.onChange(!props.value) }),
  };
});

jest.mock('@/components/home/DeleteArrowSetModal/ConfirmModal', () => ({
  __esModule: true,
  default: () => null,
}));

const favoriteSet = {
  id: 'fav-1',
  userId: 'u1',
  name: 'Old favorite',
  material: Material.KARBON,
  arrowsCount: 12,
  diameter: 5.5,
  weight: 400,
  length: 28,
  spine: '500',
  pointType: 'spiss',
  pointWeight: 100,
  vanes: 'plast',
  nock: 'standard',
  notes: null,
  isFavorite: true,
  createdAt: '',
  updatedAt: '',
};

const renderForm = async (overrides: Partial<React.ComponentProps<typeof ArrowForm>> = {}) => {
  const setArrowModalVisible = jest.fn();
  const onSuccess = jest.fn();
  const screen = await render(
    <ArrowForm
      modalVisible
      setArrowModalVisible={setArrowModalVisible}
      arrowSet={null}
      existingArrowSets={[favoriteSet]}
      onSuccess={onSuccess}
      {...overrides}
    />,
  );
  return { setArrowModalVisible, onSuccess, ...screen };
};

const fillNameAndSave = async (screen: Awaited<ReturnType<typeof renderForm>>, name = 'Nytt pilsett') => {
  await act(async () => {
    fireEvent.changeText(screen.getByTestId('input-arrowForm.nameLabel'), name);
  });
  await act(async () => {
    fireEvent.press(screen.getByTestId('btn-form.save'));
  });
};

describe('ArrowForm submit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as any).alert = jest.fn();
    mockCreate.mockResolvedValue({ id: 'new-1' });
    mockUpdate.mockResolvedValue({});
  });

  it('creates the arrow set and calls onSuccess on success', async () => {
    const screen = await renderForm();
    await fillNameAndSave(screen);

    await waitFor(() => expect(screen.onSuccess).toHaveBeenCalledTimes(1));
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ name: 'Nytt pilsett', material: Material.KARBON }));
    expect(screen.setArrowModalVisible).toHaveBeenCalledWith(false);
    expect((globalThis as any).alert).not.toHaveBeenCalled();
  });

  it('alerts with the AppError message when create fails', async () => {
    mockCreate.mockRejectedValue(new AppError('SERVER_ERROR', 'Serverfeil. Vennligst prøv igjen senere.'));
    const screen = await renderForm();
    await fillNameAndSave(screen);

    await waitFor(() => expect((globalThis as any).alert).toHaveBeenCalledWith('Serverfeil. Vennligst prøv igjen senere.'));
    expect(screen.onSuccess).not.toHaveBeenCalled();
  });

  it('still completes the save when un-favoriting an existing favorite fails after a successful create', async () => {
    mockUpdate.mockRejectedValue(new AppError('BAD_REQUEST', 'Ugyldig forespørsel'));
    const screen = await renderForm();

    await act(async () => {
      fireEvent.changeText(screen.getByTestId('input-arrowForm.nameLabel'), 'Nytt pilsett');
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId('checkbox-favorite'));
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId('btn-form.save'));
    });

    // The create succeeded server-side, so the save must complete without an error alert
    await waitFor(() => expect(screen.onSuccess).toHaveBeenCalledTimes(1));
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ name: 'Nytt pilsett', isFavorite: true }));
    // The follow-up un-favorite was attempted with the full payload and its failure only reported
    expect(mockUpdate).toHaveBeenCalledWith('fav-1', expect.objectContaining({ name: 'Old favorite', isFavorite: false }));
    expect(mockReportError).toHaveBeenCalledTimes(1);
    expect((globalThis as any).alert).not.toHaveBeenCalled();
    expect(screen.setArrowModalVisible).toHaveBeenCalledWith(false);
  });
});
