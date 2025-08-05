import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  bowContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  arrowContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
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
