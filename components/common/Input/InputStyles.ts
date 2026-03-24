import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const defaultStyles = StyleSheet.create({
  container: {
    marginBottom: 0,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    minHeight: 22,
  },
  label: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 16,
  },
  optional: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.secondary,
  },
  help: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
    minHeight: 18,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.dimmed,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    minHeight: 40,
  },
  controlFocused: {
    borderColor: colors.primary,
  },
  controlError: {
    borderColor: colors.error,
  },
  controlDisabled: {
    opacity: 0.7,
    backgroundColor: colors.background,
  },
  left: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    paddingVertical: 8,
    minHeight: 24,
  },
  errorMessage: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
});
