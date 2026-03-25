import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const defaultStyles = StyleSheet.create({
  container: { marginBottom: 16, minHeight: 100 },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    minHeight: 18,
  },
  label: {
    fontWeight: '600',
    color: colors.primary,
    fontSize: 15,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.secondary,
    marginLeft: 4,
  },
  optional: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.secondary,
  },
  help: {
    color: colors.secondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 6,
  },
  textarea: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 80,
    width: '100%',
    fontSize: 14,
    borderColor: colors.dimmed,
    borderWidth: 1,
    borderRadius: 4,
  },
  textareaFocused: {
    borderColor: colors.primary,
  },
  icon: { marginRight: 8 },
  errorMessage: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
});
