import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { styles } from './PublicProfileDetailStyles';
import { useTranslation } from '@/contexts';

interface ProfileAchievementsProps {
  achievementCount: number;
}

export default function ProfileAchievements({ achievementCount }: ProfileAchievementsProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.statsSection}>
      <Text style={styles.statsTitle}>{t['skyttere.achievementsTitle']}</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <FontAwesomeIcon icon={faTrophy} size={20} color={colors.primary} style={styles.statIcon} />
          <Text style={styles.statValue}>{achievementCount}</Text>
          <Text style={styles.statLabel}>{t['skyttere.achievementsUnlocked']}</Text>
        </View>
      </View>
    </View>
  );
}
