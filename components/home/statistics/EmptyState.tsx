import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { colors } from '@/styles/colors';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faChartBar} size={48} color="rgba(255,255,255,0.3)" />
      <Text style={styles.title}>Ingen statistikk ennå</Text>
      <Text style={styles.subtitle}>Legg til treninger for å se statistikk her</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
});
