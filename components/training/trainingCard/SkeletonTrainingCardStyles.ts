import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  trainingCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.dark_primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateSkeleton: {
    backgroundColor: colors.tertiary,
    height: 16,
    width: 80,
    borderRadius: 4,
    marginBottom: 6,
  },
  arrowCountSkeleton: {
    backgroundColor: colors.tertiary,
    height: 14,
    width: 60,
    borderRadius: 4,
  },
  iconSkeleton: {
    backgroundColor: colors.tertiary,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
});
