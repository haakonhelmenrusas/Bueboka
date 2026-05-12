import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const languageSectionStyles = StyleSheet.create({
  helpText: {
    fontSize: 13,
    color: colors.inactive,
  },
  optionList: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: colors.white,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(5,53,70,0.06)',
  },
  flag: {
    fontSize: 22,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  optionLabelActive: {
    color: colors.primary,
  },
});
