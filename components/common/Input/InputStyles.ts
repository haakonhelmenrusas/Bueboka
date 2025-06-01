import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const defaultStyles = StyleSheet.create({
  container: { marginBottom: 16, height: 40 },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  label: { color: colors.primary, fontWeight: '500', fontSize: 14 },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: '100%',
    fontSize: 14,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 4,
  },
  icon: { marginRight: 8 },
});
