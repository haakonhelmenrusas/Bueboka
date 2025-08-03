import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
    marginTop: 32,
  },
  bowContainer: {
    marginBottom: 16,
  },
  scrollList: {
    flexGrow: 0,
    maxHeight: 200,
  },
  buttons: {
    marginTop: 'auto',
    display: 'flex',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bowList: {
    flexGrow: 0,
    maxHeight: 200,
    marginBottom: 16,
  },

});
