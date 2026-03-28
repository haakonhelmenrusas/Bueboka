import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { End, CompetitionRound } from '@/types';
import { colors } from '@/styles/colors';

interface RoundCardProps {
  end?: End;
  round?: CompetitionRound;
  roundNumber?: number;
}

export function RoundCard({ end, round, roundNumber }: RoundCardProps) {
  const data = end || round;
  if (!data) return null;

  const distanceText = data.distanceMeters
    ? `${data.distanceMeters}m`
    : data.distanceFrom && data.distanceTo
      ? `${data.distanceFrom}-${data.distanceTo}m`
      : null;

  const targetText = data.targetType || null;
  const scoreValue = data.roundScore ?? 0;
  const arrowsCount = data.arrows ?? 0;

  // For ends, we have individual scores
  const scores = 'scores' in data ? data.scores : [];

  return (
    <View style={styles.roundCard}>
      <View style={styles.roundMeta}>
        {roundNumber !== undefined && (
          <View style={styles.roundMetaItem}>
            <Text style={styles.roundMetaLabel}>Runde</Text>
            <Text style={styles.roundMetaValue}>{roundNumber}</Text>
          </View>
        )}
        {distanceText && (
          <View style={styles.roundMetaItem}>
            <Text style={styles.roundMetaLabel}>Avstand</Text>
            <Text style={styles.roundMetaValue}>{distanceText}</Text>
          </View>
        )}
        {targetText && (
          <View style={styles.roundMetaItem}>
            <Text style={styles.roundMetaLabel}>Skive</Text>
            <Text style={styles.roundMetaValue}>{targetText}</Text>
          </View>
        )}
        {scoreValue > 0 && (
          <View style={styles.roundMetaItem}>
            <Text style={styles.roundMetaLabel}>Poeng</Text>
            <Text style={styles.roundMetaValue}>{scoreValue}</Text>
          </View>
        )}
        {arrowsCount > 0 && (
          <View style={styles.roundMetaItem}>
            <Text style={styles.roundMetaLabel}>Piler</Text>
            <Text style={styles.roundMetaValue}>{arrowsCount}</Text>
          </View>
        )}
      </View>

      {scores.length > 0 && (
        <View style={styles.roundScores}>
          {scores.map((score, idx) => (
            <View key={idx} style={styles.scoreChip}>
              <Text style={styles.scoreChipText}>{score}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  roundCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.dimmed,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  roundMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  roundMetaItem: {
    alignItems: 'center',
    gap: 2,
  },
  roundMetaLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.textSecondary,
  },
  roundMetaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  roundScores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  scoreChip: {
    backgroundColor: colors.tertiary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  scoreChipText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
