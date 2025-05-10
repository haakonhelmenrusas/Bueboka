import { Platform, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flex: 1,
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 16 : 0,
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
  radioContainer: {
    marginTop: 32,
  },
  radioButtonContainer: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inactive,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 16,
  },
  radioButtonContainerSelected: {
    borderColor: colors.primary,
  },
  radioButton: {
    height: 16,
    width: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: colors.primary,
  },
  radioButtonLabel: {
    color: colors.primary,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  bowTypeLabel: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
  },
});
