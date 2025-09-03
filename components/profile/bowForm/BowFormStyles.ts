import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  modal: {
    padding: 16,
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputs: {
    gap: 16,
  },
  trashIcon: {
    padding: 16,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
});
