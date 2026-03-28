import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProfileImageManager from '../ProfileImageManager';
import { Button } from '@/components/common';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockLaunchImageLibraryAsync = jest.fn();
const mockGetMediaLibraryPermissionsAsync = jest.fn();
const mockRequestMediaLibraryPermissionsAsync = jest.fn();

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: (...args: any[]) => mockLaunchImageLibraryAsync(...args),
  getMediaLibraryPermissionsAsync: (...args: any[]) => mockGetMediaLibraryPermissionsAsync(...args),
  requestMediaLibraryPermissionsAsync: (...args: any[]) => mockRequestMediaLibraryPermissionsAsync(...args),
  MediaTypeOptions: { Images: 'Images' },
}));

const mockGetInfoAsync = jest.fn();
jest.mock('expo-file-system', () => ({
  getInfoAsync: (...args: any[]) => mockGetInfoAsync(...args),
}));

// Factory only uses jest.fn() – no require() or out-of-scope variables.
jest.mock('@/components/common', () => ({
  Button: jest.fn(),
}));

// Provide JSX implementation here, where imports are already resolved.
beforeEach(() => {
  jest.mocked(Button).mockImplementation(({ label, onPress, disabled }: any) => (
    <TouchableOpacity onPress={onPress} disabled={disabled} testID={`btn-${label}`}>
      <Text>{label}</Text>
    </TouchableOpacity>
  ));
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function grantedPermission() {
  mockGetMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
}

function cancelledPicker() {
  mockLaunchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: [] });
}

function pickedImage(uri = 'file:///photo.jpg', fileSize = 1_000_000) {
  mockLaunchImageLibraryAsync.mockResolvedValue({
    canceled: false,
    assets: [{ uri, fileSize }],
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProfileImageManager – avatar display', () => {
  it('shows the first letter of the userName when there is no avatar', () => {
    const { getByText } = render(<ProfileImageManager userName="Ola Nordmann" onUpload={jest.fn()} onRemove={jest.fn()} />);
    expect(getByText('O')).toBeTruthy();
  });

  it('uppercases the initial letter', () => {
    const { getByText } = render(<ProfileImageManager userName="kari" onUpload={jest.fn()} onRemove={jest.fn()} />);
    expect(getByText('K')).toBeTruthy();
  });

  it('shows "?" when userName is empty', () => {
    const { getByText } = render(<ProfileImageManager userName="" onUpload={jest.fn()} onRemove={jest.fn()} />);
    expect(getByText('?')).toBeTruthy();
  });

  it('renders an Image when avatarUrl is provided', () => {
    const { UNSAFE_getByType } = render(
      <ProfileImageManager userName="Ola" avatarUrl="https://cdn.example.com/avatar.jpg" onUpload={jest.fn()} onRemove={jest.fn()} />,
    );
    const img = UNSAFE_getByType(Image);
    expect(img.props.source).toEqual({ uri: 'https://cdn.example.com/avatar.jpg' });
  });
});

describe('ProfileImageManager – menu modal', () => {
  it('menu is closed by default', () => {
    const { queryByText } = render(<ProfileImageManager userName="Ola" onUpload={jest.fn()} onRemove={jest.fn()} />);
    // The menu title only renders when the modal is open
    expect(queryByText('Profilbilde')).toBeNull();
  });

  it('opens the menu when the avatar is pressed', async () => {
    const { getByText, queryByText } = render(<ProfileImageManager userName="Ola" onUpload={jest.fn()} onRemove={jest.fn()} />);
    // Avatar TouchableOpacity wraps the initial letter
    fireEvent.press(getByText('O'));
    await waitFor(() => expect(queryByText('Profilbilde')).toBeTruthy());
  });

  it('closes the menu when "Avbryt" is pressed', async () => {
    const { getByText, queryByText, getByTestId } = render(
      <ProfileImageManager userName="Ola" onUpload={jest.fn()} onRemove={jest.fn()} />,
    );
    fireEvent.press(getByText('O'));
    await waitFor(() => expect(queryByText('Profilbilde')).toBeTruthy());

    fireEvent.press(getByTestId('btn-Avbryt'));
    await waitFor(() => expect(queryByText('Profilbilde')).toBeNull());
  });

  it('does NOT show "Fjern bilde" when there is no avatarUrl', async () => {
    const { getByText, queryByTestId } = render(<ProfileImageManager userName="Ola" onUpload={jest.fn()} onRemove={jest.fn()} />);
    fireEvent.press(getByText('O'));
    await waitFor(() => expect(queryByTestId('btn-Fjern bilde')).toBeNull());
  });

  it('shows "Fjern bilde" when avatarUrl is set', async () => {
    const { UNSAFE_getAllByType, getByTestId } = render(
      <ProfileImageManager userName="Ola" avatarUrl="https://cdn.example.com/avatar.jpg" onUpload={jest.fn()} onRemove={jest.fn()} />,
    );
    // The first TouchableOpacity in the tree is the avatar press area
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[0]);
    await waitFor(() => expect(getByTestId('btn-Fjern bilde')).toBeTruthy());
  });
});

describe('ProfileImageManager – image upload', () => {
  beforeEach(() => {
    grantedPermission();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('calls onUpload with the selected image URI', async () => {
    const onUpload = jest.fn().mockResolvedValue(undefined);
    pickedImage('file:///selected.jpg', 500_000);

    const { getByText, getByTestId } = render(<ProfileImageManager userName="Ola" onUpload={onUpload} onRemove={jest.fn()} />);

    // Open menu
    fireEvent.press(getByText('O'));
    await waitFor(() => getByTestId('btn-Velg bilde'));

    // Pick image
    await act(async () => {
      fireEvent.press(getByTestId('btn-Velg bilde'));
    });

    await waitFor(() => expect(onUpload).toHaveBeenCalledWith('file:///selected.jpg'));
  });

  it('shows an Alert and does NOT call onUpload when image exceeds 5 MB', async () => {
    const onUpload = jest.fn();
    // fileSize > 5 * 1024 * 1024
    pickedImage('file:///huge.jpg', 6 * 1024 * 1024);

    const { getByText, getByTestId } = render(<ProfileImageManager userName="Ola" onUpload={onUpload} onRemove={jest.fn()} />);

    fireEvent.press(getByText('O'));
    await waitFor(() => getByTestId('btn-Velg bilde'));

    await act(async () => {
      fireEvent.press(getByTestId('btn-Velg bilde'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('For stor fil', expect.any(String));
      expect(onUpload).not.toHaveBeenCalled();
    });
  });

  it('does nothing when the picker is cancelled', async () => {
    const onUpload = jest.fn();
    cancelledPicker();

    const { getByText, getByTestId } = render(<ProfileImageManager userName="Ola" onUpload={onUpload} onRemove={jest.fn()} />);

    fireEvent.press(getByText('O'));
    await waitFor(() => getByTestId('btn-Velg bilde'));

    await act(async () => {
      fireEvent.press(getByTestId('btn-Velg bilde'));
    });

    await waitFor(() => expect(onUpload).not.toHaveBeenCalled());
  });

  it('shows an Alert when permission is denied', async () => {
    mockGetMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });

    const { getByText, getByTestId } = render(<ProfileImageManager userName="Ola" onUpload={jest.fn()} onRemove={jest.fn()} />);

    fireEvent.press(getByText('O'));
    await waitFor(() => getByTestId('btn-Velg bilde'));

    await act(async () => {
      fireEvent.press(getByTestId('btn-Velg bilde'));
    });

    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Ingen tilgang', expect.any(String)));
  });
});
