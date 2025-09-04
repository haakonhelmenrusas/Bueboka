import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  arrowCountContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  arrowCountLabel: {
    fontSize: 18,
    color: colors.secondary,
    marginBottom: 10,
  },
  arrowCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  counterButton: {
    width: 120,
    height: 120,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dark_primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  counterButtonMinus: {
    width: 90,
    height: 90,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dark_primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: colors.secondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    height: 48,
    marginTop: 'auto',
  },
});
