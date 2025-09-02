import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  date: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 0,
  },
  icon: {
    color: colors.primary,
    padding: 12,
  },
  arrowCount: {
    fontSize: 24,
    color: colors.dark_primary,
    fontWeight: 500,
    textAlign: 'left',
    marginTop: 0,
  },
  trainingCard: {
    padding: 16,
    margin: 1,
    marginVertical: 4,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.dark_primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
