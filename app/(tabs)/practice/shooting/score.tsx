import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScoringGrid, ArrowHit } from '@/components/practice/scoring/ScoringGrid';
import { Button } from '@/components/common';
import { colors } from '@/styles/colors';
import { useRouter } from 'expo-router';

export default function ShootingScoreScreen() {
  const [hits, setHits] = useState<ArrowHit[]>([]);
  const router = useRouter();

  const handleAddHit = (hit: ArrowHit) => {
    setHits([...hits, hit]);
  };

  const handleClear = () => {
    setHits([]);
  };

  const handleSave = () => {
    // TODO: Implement actual saving logic with context/repository
    console.log('Hits to save:', hits);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrer Piler</Text>
      <Text style={styles.subtitle}>Trykk på skiven for å plassere piler</Text>

      <ScoringGrid hits={hits} onAddHit={handleAddHit} />

      <View style={styles.stats}>
        <Text style={styles.statsText}>Piler skutt: {hits.length}</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearText}>Tøm piler</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button label="Ferdig" onPress={handleSave} disabled={hits.length === 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsText: {
    fontSize: 16,
    color: colors.primary,
  },
  clearText: {
    color: colors.error,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
});
