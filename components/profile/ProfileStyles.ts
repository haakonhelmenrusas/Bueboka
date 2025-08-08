import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  bowContainer: {
    marginBottom: 24,
  },
  arrowContainer: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 8,
  },
  bowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  arrowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'flex-start',
  },
});
