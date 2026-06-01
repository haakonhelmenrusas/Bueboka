import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkState } from '@/hooks/useNetworkState';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { useTranslation } from '@/contexts';
import { styles } from './OfflineBannerStyles';

export function OfflineBanner() {
  const { isConnected } = useNetworkState();
  const { queueLength, isSyncing, syncNow } = useOfflineQueue();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  if (isConnected && queueLength === 0) {
    return null;
  }

  if (!isConnected) {
    return (
      <View style={[styles.banner, { paddingTop: top + 8 }]}>
        <Text style={styles.text}>📴 {t['offline.disconnected']}</Text>
      </View>
    );
  }

  if (queueLength > 0) {
    return (
      <Pressable style={[styles.banner, { paddingTop: top + 8 }]} onPress={syncNow} disabled={isSyncing}>
        <Text style={styles.text}>
          {isSyncing ? `🔄 ${t['offline.syncing']}` : `⏳ ${t['offline.queued'].replace('{count}', String(queueLength))}`}
        </Text>
      </Pressable>
    );
  }

  return null;
}
