import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import type { CompetitionStats } from '@/types';
import { useTranslation } from '@/contexts';
import { colors } from '@/styles/colors';
import { styles } from './CompetitionStatsCardStyles';

interface Props {
  stats: CompetitionStats;
}

/**
 * Overview card with aggregated competition statistics.
 */
export function CompetitionStatsCard({ stats }: Props) {
  const { t } = useTranslation();

  const items: { label: string; value: string }[] = [
    { label: t['konkurranse.stats.total'], value: String(stats.total) },
    { label: t['konkurranse.stats.active'], value: String(stats.active) },
    { label: t['konkurranse.stats.podiums'], value: String(stats.podiums) },
    { label: t['konkurranse.stats.personalBests'], value: String(stats.personalBests) },
    { label: t['konkurranse.stats.bestPlacement'], value: stats.bestPlacement != null ? String(stats.bestPlacement) : '–' },
    { label: t['konkurranse.stats.avgScore'], value: stats.averageScore != null ? String(stats.averageScore) : '–' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <FontAwesomeIcon icon={faTrophy} size={16} color={colors.warning} />
        <Text style={styles.title}>{t['konkurranse.stats.title']}</Text>
      </View>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={styles.cell}>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
