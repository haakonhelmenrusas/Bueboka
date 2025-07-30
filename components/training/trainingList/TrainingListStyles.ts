import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 0,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  icon: {
    color: colors.primary,
  },
  subtitleToday: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.dark_primary,
    marginTop: 4,
  },
  subtitlePast: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.dark_primary,
    marginTop: 16,
  }


});
