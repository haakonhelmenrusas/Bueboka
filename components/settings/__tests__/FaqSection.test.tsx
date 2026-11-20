import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import FaqSection, { FAQ_URL } from '../FaqSection';

const mockOpenBrowserAsync = jest.fn();
jest.mock('expo-web-browser', () => ({
  openBrowserAsync: (...args: any[]) => mockOpenBrowserAsync(...args),
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

describe('FaqSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOpenBrowserAsync.mockResolvedValue({ type: 'opened' });
  });

  it('renders the FAQ header, description and link button', async () => {
    await render(<FaqSection />);
    expect(screen.getByText('Spørsmål og svar')).toBeTruthy();
    expect(screen.getByText('Finn svar på ofte stilte spørsmål om Bueboka på nettsiden vår.')).toBeTruthy();
    expect(screen.getByText('Åpne FAQ i appen')).toBeTruthy();
  });

  it('opens the FAQ page in an in-app browser window when the button is pressed', async () => {
    await render(<FaqSection />);
    await fireEvent.press(screen.getByText('Åpne FAQ i appen'));
    await waitFor(() => expect(mockOpenBrowserAsync).toHaveBeenCalledTimes(1));
    expect(mockOpenBrowserAsync).toHaveBeenCalledWith(FAQ_URL);
    expect(FAQ_URL).toBe('https://bueboka.no/faq');
  });
});
