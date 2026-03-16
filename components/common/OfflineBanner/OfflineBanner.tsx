import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNetworkState } from '@/hooks/useNetworkState';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { colors } from '@/styles/colors';

export function OfflineBanner() {
  const { isConnected } = useNetworkState();
  const { queueLength, isSyncing, syncNow } = useOfflineQueue();

  if (isConnected && queueLength === 0) {
    return null;
  }

  if (!isConnected) {
    return (
      <View style={styles.banner}>
        <Text style={styles.text}>📴 Frakoblet — endringer synkroniseres når du er tilkoblet</Text>
      </View>
    );
  }

  if (queueLength > 0) {
    return (
      <Pressable style={styles.banner} onPress={syncNow} disabled={isSyncing}>
        <Text style={styles.text}>{isSyncing ? '🔄 Jobber...' : `⏳ ${queueLength} i kø - klikk for å synkronisere`}</Text>
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
