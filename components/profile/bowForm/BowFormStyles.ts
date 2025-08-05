import { Platform, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flex: 1,
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 24 : 0,
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
    fontSize: 16,
    marginBottom: 4,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  favorite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
});
