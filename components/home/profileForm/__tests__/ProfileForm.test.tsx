import React from 'react';
import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileForm from '../ProfileForm';
import { Button, Input, Select, ModalWrapper } from '@/components/common';
import { User } from '@/types';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/utils/NorwegianClubs', () => ({
  NORWEGIAN_ARCHERY_CLUBS: [
    { value: 'Oslo Bueskyttere', label: 'Oslo Bueskyttere' },
    { value: 'Bergen BK', label: 'Bergen BK' },
  ],
}));

// Factory only uses jest.fn() – no require() or out-of-scope variables.
jest.mock('@/components/common', () => ({
  Input: jest.fn(),
  Select: jest.fn(),
  Button: jest.fn(),
  ModalWrapper: jest.fn(),
}));

// Provide JSX implementations here, where imports are already resolved.
beforeEach(() => {
  jest.mocked(Input).mockImplementation(({ label, value, onChangeText, errorMessage }: any) => (
    <View>
      <Text>{label}</Text>
      <TextInput testID={`input-${label}`} value={value} onChangeText={onChangeText} />
      {errorMessage ? <Text testID={`error-${label}`}>{errorMessage}</Text> : null}
    </View>
  ));

  jest.mocked(Select).mockImplementation(({ label, selectedValue, onValueChange }: any) => (
    <View>
      <Text>{label}</Text>
      <TouchableOpacity testID={`select-${label}`} onPress={() => onValueChange('Bergen BK')}>
        <Text>{selectedValue || 'Velg en klubb'}</Text>
      </TouchableOpacity>
    </View>
  ));

  jest.mocked(Button).mockImplementation(({ label, onPress }: any) => (
    <TouchableOpacity testID={`btn-${label}`} onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  ));

  jest.mocked(ModalWrapper).mockImplementation(({ children, visible }: any) =>
    visible ? <View testID="modal">{children}</View> : null,
  );
});

// ── Fixtures ──────────────────────────────────────────────────────────────────

const baseUser: User = {
  id: 'user-1',
  email: 'archer@bueboka.no',
  emailVerified: true,
  name: 'Ola Nordmann',
  club: 'Oslo Bueskyttere',
  image: null,
  skytternr: '12345',
  isPublic: false,
  publicName: true,
  publicClub: true,
  publicStats: false,
  publicSkytternr: false,
  publicAchievements: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

function renderForm(overrides: Partial<User> = {}, onSave = jest.fn(), setModalVisible = jest.fn()) {
  const user = { ...baseUser, ...overrides };
  return {
    ...render(
      <ProfileForm modalVisible={true} setModalVisible={setModalVisible} user={user} onSave={onSave} />,
    ),
    onSave,
    setModalVisible,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProfileForm – rendering', () => {
  it('renders inside the modal', () => {
    const { getByTestId } = renderForm();
    expect(getByTestId('modal')).toBeTruthy();
  });

  it('does not render when modalVisible is false', () => {
    const { queryByTestId } = render(
      <ProfileForm modalVisible={false} setModalVisible={jest.fn()} user={baseUser} onSave={jest.fn()} />,
    );
    expect(queryByTestId('modal')).toBeNull();
  });

  it('pre-fills the name input with the current user name', () => {
    const { getByTestId } = renderForm();
    expect(getByTestId('input-Navn').props.value).toBe('Ola Nordmann');
  });

  it('pre-fills the skytternr input', () => {
    const { getByTestId } = renderForm();
    expect(getByTestId('input-Skytternr').props.value).toBe('12345');
  });

  it('pre-fills the name as empty string when user has no name', () => {
    const { getByTestId } = renderForm({ name: null });
    expect(getByTestId('input-Navn').props.value).toBe('');
  });
});

describe('ProfileForm – validation', () => {
  it('shows a validation error and does NOT call onSave when name is empty', () => {
    const { getByTestId, queryByTestId } = renderForm();

    fireEvent.changeText(getByTestId('input-Navn'), '');
    fireEvent.press(getByTestId('btn-Lagre'));

    expect(queryByTestId('error-Navn')).toBeTruthy();
    expect(queryByTestId('error-Navn')?.props.children).toMatch(/påkrevd/i);
  });

  it('does not call onSave when name is blank (only whitespace)', () => {
    const onSave = jest.fn();
    const { getByTestId } = renderForm({}, onSave);

    fireEvent.changeText(getByTestId('input-Navn'), '   ');
    fireEvent.press(getByTestId('btn-Lagre'));

    expect(onSave).not.toHaveBeenCalled();
  });
});

describe('ProfileForm – saving', () => {
  it('calls onSave with trimmed name, club, and skytternr', () => {
    const onSave = jest.fn();
    const { getByTestId } = renderForm({}, onSave);

    fireEvent.changeText(getByTestId('input-Navn'), '  Kari Nordmann  ');
    fireEvent.changeText(getByTestId('input-Skytternr'), ' 99 ');
    fireEvent.press(getByTestId('btn-Lagre'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Kari Nordmann',
        skytternr: '99',
      }),
    );
  });

  it('omits club from onSave payload when club is cleared', () => {
    const onSave = jest.fn();
    // Render with no club so the Select starts empty
    const { getByTestId } = renderForm({ club: null }, onSave);

    fireEvent.press(getByTestId('btn-Lagre'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ club: undefined }),
    );
  });

  it('calls setModalVisible(false) after a successful save', () => {
    const setModalVisible = jest.fn();
    const { getByTestId } = renderForm({}, jest.fn(), setModalVisible);

    fireEvent.press(getByTestId('btn-Lagre'));

    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});

describe('ProfileForm – cancel', () => {
  it('calls setModalVisible(false) when "Avbryt" is pressed', () => {
    const setModalVisible = jest.fn();
    const { getByTestId } = renderForm({}, jest.fn(), setModalVisible);

    fireEvent.press(getByTestId('btn-Avbryt'));

    expect(setModalVisible).toHaveBeenCalledWith(false);
  });

  it('does NOT call onSave when "Avbryt" is pressed', () => {
    const onSave = jest.fn();
    const { getByTestId } = renderForm({}, onSave);

    fireEvent.press(getByTestId('btn-Avbryt'));

    expect(onSave).not.toHaveBeenCalled();
  });
});
