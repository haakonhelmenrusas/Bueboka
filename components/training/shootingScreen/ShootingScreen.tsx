import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/common';
import { colors } from '@/styles/colors';

export default function ShootingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skyteøkt</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Dato: {params.date}</Text>
        {params.bowId && <Text style={styles.infoText}>Bue ID: {params.bowId}</Text>}
        {params.arrowSet && <Text style={styles.infoText}>Pilsett: {params.arrowSet}</Text>}
        {params.arrows && <Text style={styles.infoText}>Piler: {params.arrows}</Text>}
      </View>

      <Button label="Tilbake til treninger" onPress={() => router.back()} buttonStyle={styles.backButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 'auto',
  },
});
