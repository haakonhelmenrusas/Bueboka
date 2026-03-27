import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faTree } from '@fortawesome/free-solid-svg-icons/faTree';
import { Environment } from '@/types';
import { colors } from '@/styles/colors';

interface PracticeTypeBadgeProps {
  practiceType?: 'TRENING' | 'KONKURRANSE' | null;
}

export function PracticeTypeBadge({ practiceType }: PracticeTypeBadgeProps) {
  const isCompetition = practiceType === 'KONKURRANSE';

  return (
    <View style={[styles.badge, isCompetition ? styles.badgeCompetition : styles.badgePractice]}>
      <FontAwesomeIcon icon={isCompetition ? faTrophy : faBullseye} size={14} color={isCompetition ? colors.warning : colors.white} />
      <Text style={[styles.badgeText, isCompetition && styles.badgeTextCompetition]}>{isCompetition ? 'Konkurranse' : 'Trening'}</Text>
    </View>
  );
}

interface EnvironmentBadgeProps {
  environment?: Environment | string | null;
}

export function EnvironmentBadge({ environment }: EnvironmentBadgeProps) {
  if (!environment) return null;

  const isIndoor = environment === Environment.INDOOR || environment === 'INDOOR';

  return (
    <View style={[styles.badge, styles.badgeEnvironment]}>
      <FontAwesomeIcon icon={isIndoor ? faHouse : faTree} size={14} color={colors.secondary} />
      <Text style={styles.badgeTextEnvironment}>{isIndoor ? 'Innendørs' : 'Utendørs'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgePractice: {
    backgroundColor: colors.primary,
  },
  badgeCompetition: {
    backgroundColor: colors.tertiary,
  },
  badgeEnvironment: {
    backgroundColor: colors.bgLight,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  badgeTextCompetition: {
    color: colors.primary,
  },
  badgeTextEnvironment: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
});
