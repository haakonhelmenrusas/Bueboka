import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useAuth } from './useAuth';
import { notificationsApi } from '@/services/api/notificationsApi';

// Show notifications as alerts/sounds/badges while the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Registers this device's Expo push token with POST /api/notifications/push-token
 * after login, so the server can deliver push notifications (e.g. challenge
 * invites) to this device. Re-runs when the user changes.
 */
export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const register = async () => {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
          });
        }

        const { status: existing } = await Notifications.getPermissionsAsync();
        let status = existing;
        if (existing !== 'granted') {
          status = (await Notifications.requestPermissionsAsync()).status;
        }
        if (status !== 'granted') return;

        const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
        const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
        if (cancelled || !token?.data) return;

        await notificationsApi.registerPushToken(token.data);
      } catch (err) {
        console.error('[push] failed to register push token:', err);
      }
    };

    register();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);
}
