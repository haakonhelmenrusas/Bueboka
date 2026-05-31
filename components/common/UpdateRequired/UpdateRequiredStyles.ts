import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 32,
    borderRadius: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    width: '100%',
    minWidth: 200,
    marginBottom: 16,
  },
  subtext: {
    fontSize: 14,
    color: colors.inactive,
    textAlign: 'center',
    lineHeight: 20,
  },
});
