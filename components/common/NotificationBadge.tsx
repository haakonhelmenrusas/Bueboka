import { View, Text } from 'react-native';
import { styles } from './NotificationBadgeStyles';

interface NotificationBadgeProps {
  count: number;
  showZero?: boolean;
}

export default function NotificationBadge({ count, showZero = false }: NotificationBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}
