import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowDown, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { styles } from './PublicProfileDetailStyles';
import { useTranslation } from '@/contexts';

interface ProfileStatsProps {
  totalArrows: number;
  avgScorePerArrow: number | null;
}

export default function ProfileStats({ totalArrows, avgScorePerArrow }: ProfileStatsProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.statsSection}>
      <Text style={styles.statsTitle}>{t['skyttere.statsTitle']}</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <FontAwesomeIcon icon={faArrowDown} size={20} color={colors.primary} style={styles.statIcon} />
          <Text style={styles.statValue}>{totalArrows.toLocaleString('nb-NO')}</Text>
          <Text style={styles.statLabel}>{t['skyttere.totalArrows']}</Text>
        </View>
        {avgScorePerArrow !== null && (
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faChartBar} size={20} color={colors.primary} style={styles.statIcon} />
            <Text style={styles.statValue}>
              {avgScorePerArrow.toLocaleString('nb-NO', {
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.statLabel}>{t['skyttere.avgScore']}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
