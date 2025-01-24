import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flex: 1,
    padding: 24,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'medium',
  },
  radioContainer: {
    marginTop: 32,
  },
  radioButtonContainer: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 16,
  },
  radioButtonContainerSelected: {
    borderColor: '#053546',
  },
  radioButton: {
    height: 16,
    width: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#053546',
  },
  radioButtonLabel: {
    color: '#053546',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  bowTypeLabel: {
    color: '#053546',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
  },
});
