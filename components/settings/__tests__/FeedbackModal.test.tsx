import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { FeedbackModal } from '../FeedbackModal';

const mockPost = jest.fn();
jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: {
    post: (...args: any[]) => mockPost(...args),
  },
}));

describe('FeedbackModal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    mockPost.mockResolvedValue({ data: null });
  });

  async function pressStar(n: number) {
    await fireEvent.press(screen.getByLabelText(`${n}`));
  }

  async function typeText(text: string) {
    await fireEvent.changeText(screen.getByPlaceholderText('Skriv din tilbakemelding her...'), text);
  }

  it('renders title, rating label, text input, and buttons', async () => {
    await render(<FeedbackModal visible={true} onClose={onClose} />);
    expect(screen.getByText('Send tilbakemelding')).toBeTruthy();
    expect(screen.getByText('Vurdering')).toBeTruthy();
    expect(screen.getByText('Tilbakemelding')).toBeTruthy();
    expect(screen.getByPlaceholderText('Skriv din tilbakemelding her...')).toBeTruthy();
    expect(screen.getByText('Send')).toBeTruthy();
    expect(screen.getByText('Avbryt')).toBeTruthy();
  });

  it('renders 5 star buttons', async () => {
    await render(<FeedbackModal visible={true} onClose={onClose} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByLabelText(`${i}`)).toBeTruthy();
    }
  });

  it('does not submit when no rating is selected', async () => {
    await render(<FeedbackModal visible={true} onClose={onClose} />);
    await typeText('Some feedback');
    await fireEvent.press(screen.getByText('Send'));
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('does not submit when no text is entered', async () => {
    await render(<FeedbackModal visible={true} onClose={onClose} />);
    await pressStar(3);
    await fireEvent.press(screen.getByText('Send'));
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('submits feedback and closes on success', async () => {
    await render(<FeedbackModal visible={true} onClose={onClose} />);
    await pressStar(4);
    await typeText('Love it!');
    await fireEvent.press(screen.getByText('Send'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/feedback', { rating: 4, feedback: 'Love it!' });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('posts to the correct API endpoint', async () => {
    await render(<FeedbackModal visible={true} onClose={onClose} />);
    await pressStar(2);
    await typeText('Could be better');
    await fireEvent.press(screen.getByText('Send'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/feedback', { rating: 2, feedback: 'Could be better' });
    });
  });

  it('shows an alert on API error', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    mockPost.mockRejectedValue(new Error('Server error'));

    await render(<FeedbackModal visible={true} onClose={onClose} />);
    await pressStar(1);
    await typeText('Bug report');
    await fireEvent.press(screen.getByText('Send'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Feil', 'Kunne ikke sende tilbakemelding');
    });
  });

  it('does not close the modal on API error', async () => {
    mockPost.mockRejectedValue(new Error('Server error'));

    await render(<FeedbackModal visible={true} onClose={onClose} />);
    await pressStar(5);
    await typeText('Feedback text');
    await fireEvent.press(screen.getByText('Send'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when cancel is pressed', async () => {
    await render(<FeedbackModal visible={true} onClose={onClose} />);
    await fireEvent.press(screen.getByText('Avbryt'));
    expect(onClose).toHaveBeenCalled();
  });
});
