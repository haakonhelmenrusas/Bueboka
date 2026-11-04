import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import VarslerScreen from '../varsler';
import { NotificationType, type Notification } from '@/contexts/NotificationContext';

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

const mockMarkAsRead = jest.fn();
const mockMarkAllAsRead = jest.fn();
let mockNotifications: Notification[] = [];

jest.mock('@/contexts/NotificationContext', () => ({
  NotificationType: {
    CHALLENGE_RECEIVED: 'CHALLENGE_RECEIVED',
    CHALLENGE_SENT: 'CHALLENGE_SENT',
  },
  useNotifications: () => ({
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter((n) => !n.read).length,
    markAsRead: mockMarkAsRead,
    markAllAsRead: mockMarkAllAsRead,
  }),
}));

const received: Notification = {
  id: 'n1',
  type: NotificationType.CHALLENGE_RECEIVED,
  title: 'Ny utfordring',
  message: 'Du har mottatt en ny utfordring fra Ola',
  challengeId: 'ch-1',
  createdAt: '2026-11-03T10:00:00.000Z',
  read: false,
};

const sent: Notification = {
  id: 'n2',
  type: NotificationType.CHALLENGE_SENT,
  title: 'Utfordring sendt',
  message: 'Du sendte en utfordring til Kari',
  challengeId: 'ch-2',
  createdAt: '2026-11-02T10:00:00.000Z',
  read: true,
};

describe('VarslerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotifications = [received, sent];
  });

  it('lists all notifications', async () => {
    const { getByText } = await render(<VarslerScreen />);
    expect(getByText('Ny utfordring')).toBeTruthy();
    expect(getByText('Utfordring sendt')).toBeTruthy();
    expect(getByText('Varsler')).toBeTruthy();
  });

  it('shows the empty state when there are no notifications', async () => {
    mockNotifications = [];
    const { getByText, queryByText } = await render(<VarslerScreen />);
    expect(getByText('Ingen varsler ennå')).toBeTruthy();
    expect(queryByText('Merk alle som lest')).toBeNull();
  });

  it('marks a notification as read and navigates to its challenge on press', async () => {
    const { getByTestId } = await render(<VarslerScreen />);

    await fireEvent.press(getByTestId('notification-item-n1'));

    expect(mockMarkAsRead).toHaveBeenCalledWith('n1');
    expect(mockPush).toHaveBeenCalledWith('/utfordringer/ch-1');
  });

  it('marks all as read from the header button', async () => {
    const { getByTestId } = await render(<VarslerScreen />);

    await fireEvent.press(getByTestId('varsler-mark-all'));
    expect(mockMarkAllAsRead).toHaveBeenCalledTimes(1);
  });

  it('navigates back from the header button', async () => {
    const { getByTestId } = await render(<VarslerScreen />);

    await fireEvent.press(getByTestId('varsler-back'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
