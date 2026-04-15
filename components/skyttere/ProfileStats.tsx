import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowDown, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { styles } from './PublicProfileDetailStyles';

interface ProfileStatsProps {
  totalArrows: number;
  avgScorePerArrow: number | null;
}

export default function ProfileStats({ totalArrows, avgScorePerArrow }: ProfileStatsProps) {
  return (
    <View style={styles.statsSection}>
      <Text style={styles.statsTitle}>Statistikk</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <FontAwesomeIcon icon={faArrowDown} size={20} color={colors.primary} style={styles.statIcon} />
          <Text style={styles.statValue}>{totalArrows.toLocaleString('nb-NO')}</Text>
          <Text style={styles.statLabel}>Piler skutt totalt</Text>
        </View>
        {avgScorePerArrow !== null && (
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faChartBar} size={20} color={colors.primary} style={styles.statIcon} />
            <Text style={styles.statValue}>
              {avgScorePerArrow.toLocaleString('nb-NO', {
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.statLabel}>Snittpoeng per pil</Text>
          </View>
        )}
      </View>
    </View>
  );
}
