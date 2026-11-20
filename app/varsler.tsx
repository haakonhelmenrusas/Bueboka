import { useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { useNotifications } from '@/contexts';
import type { Notification } from '@/contexts/NotificationContext';
import { NotificationListItem } from '@/components/notifications';
import { styles } from '@/components/notifications/VarslerScreenStyles';

export default function VarslerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handlePress = useCallback(
    (notification: Notification) => {
      markAsRead(notification.id);
      if (notification.challengeId) {
        router.push(`/utfordringer/${notification.challengeId}`);
      }
    },
    [markAsRead, router],
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>
          <View style={styles.header}>
            <TouchableOpacity
              testID="varsler-back"
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel={t['notifications.back']}>
              <FontAwesomeIcon icon={faChevronLeft} size={18} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>{t['notifications.title']}</Text>
            </View>
            {unreadCount > 0 ? (
              <TouchableOpacity testID="varsler-mark-all" style={styles.markAllButton} onPress={markAllAsRead}>
                <Text style={styles.markAllText}>{t['notifications.markAllRead']}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {notifications.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>{t['notifications.empty']}</Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <NotificationListItem key={notification.id} notification={notification} onPress={handlePress} />
            ))
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
