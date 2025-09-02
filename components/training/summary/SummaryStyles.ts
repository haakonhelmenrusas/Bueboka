import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 4,
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 8,
    shadowColor: colors.dark_primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.white,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'left',
    marginBottom: 4,
    marginLeft: 8,
  },
  arrowCount: {
    fontSize: 20,
    color: colors.white,
    marginBottom: 4,
    fontWeight: 500,
  },
  textLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
