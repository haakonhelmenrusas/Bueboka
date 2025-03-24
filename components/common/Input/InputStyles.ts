import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const defaultStyles = StyleSheet.create({
  container: { marginBottom: 16, height: 40 },
  labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  label: { color: colors.primary, fontWeight: '500', fontSize: 14 },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    height: 40,
    width: '100%',
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
  },
  icon: { marginRight: 8 },
});
