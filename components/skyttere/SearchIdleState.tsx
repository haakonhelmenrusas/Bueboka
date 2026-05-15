import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { styles } from './SkyttereStyles';
import { useTranslation } from '@/contexts';

export default function SearchIdleState() {
  const { t } = useTranslation();
  return (
    <View style={styles.idle}>
      <View style={styles.idleTarget}>
        <View style={[styles.idleRing, styles.idleRing1]} />
        <View style={[styles.idleRing, styles.idleRing2]} />
        <View style={[styles.idleRing, styles.idleRing3]} />
        <View style={styles.idleCenter}>
          <FontAwesomeIcon icon={faUsers} size={28} color={colors.white} />
        </View>
      </View>
      <Text style={styles.idleHint}>{t['skyttere.searchIdle']}</Text>
    </View>
  );
}
