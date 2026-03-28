import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileBox from '../ProfileBox';
import { Button, Badge } from '@/components/common';
import { User } from '@/types';

// ── Mocks ────────────────────────────────────────────────────────────────────

// Factory only uses jest.fn() (a global) – no require() or out-of-scope variables.
jest.mock('@/components/common', () => ({
  Button: jest.fn(),
  Badge: jest.fn(),
}));

jest.mock('../ProfileImageManager', () => () => null);

// Provide JSX implementations here, where imports are already resolved.
beforeEach(() => {
  jest.mocked(Button).mockImplementation(({ label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} testID={`btn-${label}`}>
      <Text>{label}</Text>
    </TouchableOpacity>
  ));

  jest.mocked(Badge).mockImplementation(({ children }: any) => <Text testID="badge">{children}</Text>);
});

// ── Fixtures ──────────────────────────────────────────────────────────────────

const baseUser: User = {
  id: 'user-1',
  email: 'archer@bueboka.no',
  emailVerified: true,
  name: 'Ola Nordmann',
  club: 'Oslo Bueskyttere',
  image: null,
  skytternr: '99001',
  isPublic: false,
  publicName: true,
  publicClub: true,
  publicStats: false,
  publicSkytternr: false,
  publicAchievements: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

function renderProfileBox(overrides: Partial<User> = {}, onEdit = jest.fn()) {
  const user = { ...baseUser, ...overrides };
  const onAvatarUpload = jest.fn().mockResolvedValue(undefined);
  const onAvatarRemove = jest.fn().mockResolvedValue(undefined);
  return {
    ...render(<ProfileBox user={user} onEdit={onEdit} onAvatarUpload={onAvatarUpload} onAvatarRemove={onAvatarRemove} />),
    onEdit,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProfileBox – display', () => {
  it('renders the user name', () => {
    const { getByText } = renderProfileBox();
    expect(getByText('Ola Nordmann')).toBeTruthy();
  });

  it('falls back to email when name is null', () => {
    const { getByText } = renderProfileBox({ name: null });
    expect(getByText('archer@bueboka.no')).toBeTruthy();
  });

  it('falls back to "Bruker" when both name and email are empty', () => {
    const { getByText } = renderProfileBox({ name: null, email: '' });
    expect(getByText('Bruker')).toBeTruthy();
  });

  it('renders the club name', () => {
    const { getByText } = renderProfileBox();
    expect(getByText('Oslo Bueskyttere')).toBeTruthy();
  });

  it('does not render club when it is null', () => {
    const { queryByText } = renderProfileBox({ club: null });
    expect(queryByText('Oslo Bueskyttere')).toBeNull();
  });

  it('renders the skytternr inside a Badge', () => {
    const { getByText } = renderProfileBox();
    expect(getByText('#99001')).toBeTruthy();
  });

  it('does not render a Badge when skytternr is null', () => {
    const { queryByTestId } = renderProfileBox({ skytternr: null });
    expect(queryByTestId('badge')).toBeNull();
  });

  it('renders the edit button label', () => {
    const { getByText } = renderProfileBox();
    expect(getByText('Rediger profil')).toBeTruthy();
  });
});

describe('ProfileBox – interactions', () => {
  it('calls onEdit when the edit button is pressed', () => {
    const onEdit = jest.fn();
    const { getByTestId } = renderProfileBox({}, onEdit);
    fireEvent.press(getByTestId('btn-Rediger profil'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
