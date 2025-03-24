import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
  },
  messageTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
  },
  icon: {
    color: colors.primary,
  },
  messageText: {
    color: colors.primary,
    fontSize: 16,
    marginBottom: 16,
  },
});
