import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { NotificationListItem } from '../NotificationListItem';
import { NotificationType, type Notification } from '@/contexts/NotificationContext';

const base: Notification = {
  id: 'n1',
  type: NotificationType.CHALLENGE_RECEIVED,
  title: 'Ny utfordring',
  message: 'Du har mottatt en ny utfordring fra Ola',
  challengeId: 'ch-1',
  createdAt: '2026-11-03T10:00:00.000Z',
  read: false,
};

describe('NotificationListItem', () => {
  it('renders title and message', async () => {
    const { getByText } = await render(<NotificationListItem notification={base} onPress={jest.fn()} />);
    expect(getByText('Ny utfordring')).toBeTruthy();
    expect(getByText('Du har mottatt en ny utfordring fra Ola')).toBeTruthy();
  });

  it('shows the unread dot when unread and hides it when read', async () => {
    const { getByTestId, queryByTestId, rerender } = await render(<NotificationListItem notification={base} onPress={jest.fn()} />);
    expect(getByTestId('notification-unread-n1')).toBeTruthy();

    await rerender(<NotificationListItem notification={{ ...base, read: true }} onPress={jest.fn()} />);
    expect(queryByTestId('notification-unread-n1')).toBeNull();
  });

  it('calls onPress with the notification when pressed', async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(<NotificationListItem notification={base} onPress={onPress} />);

    await fireEvent.press(getByTestId('notification-item-n1'));
    expect(onPress).toHaveBeenCalledWith(base);
  });
});
