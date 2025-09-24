import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const defaultStyles = StyleSheet.create({
  container: { marginBottom: 16, minHeight: 100 },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'flex-start',
  },
  label: { color: colors.primary, fontWeight: '500', fontSize: 16 },
  textarea: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    display: 'flex',
    minHeight: 80,
    width: '100%',
    fontSize: 14,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 4,
  },
  icon: { marginRight: 8 },
});
