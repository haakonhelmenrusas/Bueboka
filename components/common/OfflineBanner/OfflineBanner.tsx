import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNetworkState } from '@/hooks/useNetworkState';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';

export function OfflineBanner() {
  const { isConnected } = useNetworkState();
  const { queueLength, isSyncing, syncNow } = useOfflineQueue();
  const { t } = useTranslation();

  if (isConnected && queueLength === 0) {
    return null;
  }

  if (!isConnected) {
    return (
      <View style={styles.banner}>
        <Text style={styles.text}>📴 {t['offline.disconnected']}</Text>
      </View>
    );
  }

  if (queueLength > 0) {
    return (
      <Pressable style={styles.banner} onPress={syncNow} disabled={isSyncing}>
        <Text style={styles.text}>
          {isSyncing ? `🔄 ${t['offline.syncing']}` : `⏳ ${t['offline.queued'].replace('{count}', String(queueLength))}`}
        </Text>
      </Pressable>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.tertiary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
