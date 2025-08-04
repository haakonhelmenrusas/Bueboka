import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    width: '100%',
  },
  messageTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 16,
  },
  icon: {
    color: colors.primary,
  },
  messageText: {
    color: colors.primary,
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});
