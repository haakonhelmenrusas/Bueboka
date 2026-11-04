import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import type { Notification } from '@/contexts/NotificationContext';
import { NotificationType } from '@/contexts/NotificationContext';
import { useTranslation } from '@/contexts';
import { colors } from '@/styles/colors';
import { styles } from './NotificationListItemStyles';

interface Props {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

function iconForType(type: NotificationType) {
  switch (type) {
    case NotificationType.CHALLENGE_RECEIVED:
      return faTrophy;
    case NotificationType.CHALLENGE_SENT:
      return faPaperPlane;
    default:
      return faBell;
  }
}

/**
 * A single notification row in the varsler screen.
 */
export function NotificationListItem({ notification, onPress }: Props) {
  const { locale } = useTranslation();

  const createdAt = new Date(notification.createdAt).toLocaleString(locale === 'en' ? 'en-GB' : 'nb-NO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      testID={`notification-item-${notification.id}`}
      style={[styles.row, !notification.read && styles.rowUnread]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={iconForType(notification.type)} size={16} color={colors.primary} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{createdAt}</Text>
      </View>
      {!notification.read && <View testID={`notification-unread-${notification.id}`} style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}
