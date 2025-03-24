import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  notchContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  notch: {
    width: 40,
    height: 4,
    backgroundColor: colors.dimmed,
    borderRadius: 2.5,
  },
});
