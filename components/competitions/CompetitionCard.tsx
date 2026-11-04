import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import type { Competition } from '@/types';
import { useTranslation } from '@/contexts';
import { colors } from '@/styles/colors';
import { styles } from './CompetitionCardStyles';

interface Props {
  competition: Competition;
  onPress: (competition: Competition) => void;
}

/**
 * Card for a single competition in the konkurranse screen lists.
 */
export function CompetitionCard({ competition, onPress }: Props) {
  const { t, locale } = useTranslation();

  const formattedDate = new Date(competition.date).toLocaleDateString(locale === 'en' ? 'en-GB' : 'nb-NO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity
      testID={`competition-card-${competition.id}`}
      style={styles.card}
      onPress={() => onPress(competition)}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <FontAwesomeIcon icon={faTrophy} size={14} color={colors.warning} />
        <Text style={styles.name} numberOfLines={1}>
          {competition.name}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <FontAwesomeIcon icon={faCalendar} size={12} color={colors.textSecondary} />
          <Text style={styles.rowText}>{formattedDate}</Text>
        </View>
        {competition.location ? (
          <View style={styles.row}>
            <FontAwesomeIcon icon={faLocationDot} size={12} color={colors.textSecondary} />
            <Text style={styles.rowText} numberOfLines={1}>
              {competition.location}
            </Text>
          </View>
        ) : null}
        {competition.placement != null ? (
          <Text style={styles.placement}>
            {t['konkurranse.placement']}: {competition.placement}
          </Text>
        ) : null}
        <Text style={styles.score}>
          {t['konkurranse.score']}: {competition.totalScore}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
