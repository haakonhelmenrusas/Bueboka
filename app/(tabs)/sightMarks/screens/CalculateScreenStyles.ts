import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  ios: {
    flex: 1,
    backgroundColor: colors.background,
    marginBottom: -34,
  },
  remove: {
    color: colors.secondary,
  },
  centeredContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
});
