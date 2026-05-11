import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { ScoringGrid, ArrowHit } from '@/components/practice/scoring/ScoringGrid';
import { Button } from '@/components/common';
import { colors } from '@/styles/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { practiceRepository } from '@/services/repositories';
import * as Sentry from '@/services/sentryStub';

export default function ShootingScoreScreen() {
  const [hits, setHits] = useState<ArrowHit[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleAddHit = (hit: ArrowHit) => {
    setHits([...hits, hit]);
  };

  const handleClear = () => {
    setHits([]);
  };

  const calculateScore = (hit: ArrowHit, targetSize: number) => {
    const center = targetSize / 2;
    const dx = hit.x - center;
    const dy = hit.y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unit = targetSize / 22; // 10 rings + 1 extra area padding

    // Distance from center to outer edge of ring 10 is unit * 1
    // Distance from center to outer edge of ring 9 is unit * 2, etc.
    const score = Math.max(0, 11 - Math.ceil(distance / unit));
    return score > 10 ? 10 : score;
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const targetSize = Dimensions.get('window').width - 40;
      const scores = hits.map((hit) => calculateScore(hit, targetSize));
      const totalEndScore = scores.reduce((a, b) => a + b, 0);

      const practiceId = params.id as string;

      if (practiceId) {
        // Update existing practice - fetch current practice to get existing ends
        const currentPractice = await practiceRepository.getById(practiceId);
        const existingEnds = currentPractice.ends || [];

        // Create a new round with coordinates - match API schema
        const newRound = {
          numberArrows: hits.length,
          scores: scores,
          roundScore: totalEndScore,
          arrowCoordinates: hits,
          targetType: params.targetSize ? `${params.targetSize}cm` : '80cm',
          distanceMeters: params.distance ? parseInt(params.distance as string) : 18,
        };

        // Convert existing ends to rounds format
        const existingRounds = existingEnds.map((end) => ({
          numberArrows: end.arrows ?? undefined,
          arrowsWithoutScore: end.arrowsWithoutScore ?? undefined,
          scores: end.scores ?? undefined,
          roundScore: end.roundScore ?? undefined,
          distanceMeters: end.distanceMeters ?? undefined,
          distanceFrom: end.distanceFrom ?? undefined,
          distanceTo: end.distanceTo ?? undefined,
          targetType: end.targetType ?? undefined,
          arrowCoordinates: end.arrowCoordinates ?? undefined,
        }));

        // Use the main practice update endpoint with all rounds (API expects 'rounds')
        await practiceRepository.update(practiceId, {
          rounds: [...existingRounds, newRound] as any,
        });
      } else {
        // Create new practice with the scored end
        const createPayload = {
          date: new Date(params.date as string),
          environment: params.environment as any,
          practiceCategory: params.practiceCategory as any,
          weather: params.weather ? JSON.parse(params.weather as string) : [],
          location: (params.location as string) || undefined,
          bowId: (params.bowId as string) || undefined,
          arrowsId: (params.arrowsId as string) || undefined,
          notes: (params.notes as string) || undefined,
          rating: params.rating ? parseInt(params.rating as string) : undefined,
          totalScore: totalEndScore,
          ends: [
            {
              arrows: hits.length,
              scores: scores,
              roundScore: totalEndScore,
              arrowCoordinates: hits,
              targetType: params.targetSize ? `${params.targetSize}cm` : '80cm',
              distanceMeters: params.distance ? parseInt(params.distance as string) : 18,
            },
          ],
        };

        await practiceRepository.create(createPayload);
      }

      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Error saving score:', error);
      Sentry.captureException(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Registrer Piler</Text>
        <Text style={styles.subtitle}>Trykk eller hold for å zoome og plassere piler</Text>

        <ScoringGrid hits={hits} onAddHit={handleAddHit} />

        <View style={styles.stats}>
          <Text style={styles.statsText}>Piler skutt: {hits.length}</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Tøm piler</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.hitsWrapper}>
          <ScrollView
            horizontal
            style={styles.hitsScroll}
            contentContainerStyle={styles.hitsContainer}
            showsHorizontalScrollIndicator={false}>
            {hits.map((hit, index) => {
              const targetSize = Dimensions.get('window').width - 40;
              const score = calculateScore(hit, targetSize);

              // Map score to target color
              let dotColor = '#FFFFFF'; // White (1, 2)
              let textColor = '#000000';
              if (score >= 9) {
                dotColor = '#FFBB33'; // Gold (9, 10)
                textColor = '#000000';
              } else if (score >= 7) {
                dotColor = '#FF4444'; // Red (7, 8)
                textColor = '#FFFFFF';
              } else if (score >= 5) {
                dotColor = '#33B5E5'; // Blue (5, 6)
                textColor = '#FFFFFF';
              } else if (score >= 3) {
                dotColor = '#111111'; // Black (3, 4)
                textColor = '#FFFFFF';
              }

              return (
                <View
                  key={index}
                  style={[
                    styles.hitDot,
                    { backgroundColor: dotColor, borderColor: score <= 2 ? '#000' : 'transparent', borderWidth: score <= 2 ? 1 : 0 },
                  ]}>
                  <Text style={[styles.hitDotText, { color: textColor }]}>{score === 0 ? 'M' : score}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <Button
          label={isSaving ? 'Lagrer...' : 'Ferdig'}
          onPress={handleSave}
          disabled={hits.length === 0 || isSaving}
          loading={isSaving}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
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
  hitsWrapper: {
    height: 40,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  hitsScroll: {
    flex: 1,
    width: '100%',
  },
  hitsContainer: {
    paddingHorizontal: 10,
    gap: 8,
    alignItems: 'center',
  },
  hitDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  hitDotText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
});
