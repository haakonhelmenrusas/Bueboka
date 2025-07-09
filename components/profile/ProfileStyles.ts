import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 32,
  },
  bowContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  scrollList: {
    flexGrow: 0,
    maxHeight: 240,
    marginBottom: 16,
  },
  buttons: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  }
});
