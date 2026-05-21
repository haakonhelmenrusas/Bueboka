import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const introLanguagePickerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.white20,
    backgroundColor: colors.white10,
  },
  pillActive: {
    borderColor: colors.white50,
    backgroundColor: colors.white25,
  },
  flag: {
    fontSize: 20,
  },
});
