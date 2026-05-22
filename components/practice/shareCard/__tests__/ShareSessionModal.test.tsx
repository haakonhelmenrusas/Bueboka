import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ShareSessionModal } from '../ShareSessionModal';
import type { SessionShareData } from '../SessionShareCard';

const mockCapture = jest.fn();
jest.mock('react-native-view-shot', () => {
  const React = require('react');
  const { View } = require('react-native');
  const ViewShot = React.forwardRef(({ children }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ capture: mockCapture }));
    return <View>{children}</View>;
  });
  ViewShot.displayName = 'ViewShot';
  return { __esModule: true, default: ViewShot };
});

const mockShareAsync = jest.fn();
jest.mock('expo-sharing', () => ({
  shareAsync: (...args: any[]) => mockShareAsync(...args),
}));

const baseData: SessionShareData = {
  date: '2026-03-15',
  practiceType: 'TRENING',
  totalScore: 245,
  arrowsShot: 30,
  arrowsWithoutScore: 0,
  bowName: null,
  bowType: null,
  distanceMeters: null,
  category: null,
  environment: null,
  location: null,
};

describe('ShareSessionModal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    mockCapture.mockResolvedValue('/tmp/share-card.png');
    mockShareAsync.mockResolvedValue(undefined);
  });

  it('renders modal title and hint text', () => {
    render(<ShareSessionModal visible={true} onClose={onClose} data={baseData} />);
    expect(screen.getByText('Del økt')).toBeTruthy();
    expect(screen.getByText('Forhåndsvis øktkortet ditt og del det.')).toBeTruthy();
  });

  it('renders the share button', () => {
    render(<ShareSessionModal visible={true} onClose={onClose} data={baseData} />);
    expect(screen.getByText('Del')).toBeTruthy();
  });

  it('renders the SessionShareCard inside the modal', () => {
    render(<ShareSessionModal visible={true} onClose={onClose} data={baseData} />);
    expect(screen.getByText('Bueboka')).toBeTruthy();
    expect(screen.getByText('bueboka.no')).toBeTruthy();
  });

  it('captures the card and opens the share sheet on press', async () => {
    render(<ShareSessionModal visible={true} onClose={onClose} data={baseData} />);
    fireEvent.press(screen.getByText('Del'));

    await waitFor(() => {
      expect(mockCapture).toHaveBeenCalled();
      expect(mockShareAsync).toHaveBeenCalledWith('/tmp/share-card.png', { mimeType: 'image/png' });
    });
  });

  it('does not call shareAsync if capture returns no uri', async () => {
    mockCapture.mockResolvedValue(undefined);
    render(<ShareSessionModal visible={true} onClose={onClose} data={baseData} />);
    fireEvent.press(screen.getByText('Del'));

    await waitFor(() => {
      expect(mockCapture).toHaveBeenCalled();
    });
    expect(mockShareAsync).not.toHaveBeenCalled();
  });

  it('silently ignores "User did not share" error', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    mockShareAsync.mockRejectedValue(new Error('User did not share'));

    render(<ShareSessionModal visible={true} onClose={onClose} data={baseData} />);
    fireEvent.press(screen.getByText('Del'));

    await waitFor(() => {
      expect(mockShareAsync).toHaveBeenCalled();
    });
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('shows an error alert for other sharing errors', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    mockShareAsync.mockRejectedValue(new Error('Permission denied'));

    render(<ShareSessionModal visible={true} onClose={onClose} data={baseData} />);
    fireEvent.press(screen.getByText('Del'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Feil', 'Kunne ikke dele bildet. Prøv igjen.');
    });
  });

  it('shows loading indicator while sharing', async () => {
    let resolveShare: () => void;
    mockShareAsync.mockImplementation(() => new Promise<void>((resolve) => (resolveShare = resolve)));

    render(<ShareSessionModal visible={true} onClose={onClose} data={baseData} />);
    fireEvent.press(screen.getByText('Del'));

    await waitFor(() => {
      expect(screen.getByTestId('ActivityIndicator')).toBeTruthy();
    });

    resolveShare!();

    await waitFor(() => {
      expect(screen.getByText('Del')).toBeTruthy();
    });
  });
});
