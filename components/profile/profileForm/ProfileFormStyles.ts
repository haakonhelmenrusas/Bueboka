import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    width: 320,
    shadowColor: colors.dark_primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    gap: 32,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
