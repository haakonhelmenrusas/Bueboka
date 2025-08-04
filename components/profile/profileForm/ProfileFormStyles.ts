import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});