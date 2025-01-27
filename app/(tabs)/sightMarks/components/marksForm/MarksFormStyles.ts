import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 32 : 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFF',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    marginTop: 24,
  },
  formButton: {
    margin: 16,
  },
});
