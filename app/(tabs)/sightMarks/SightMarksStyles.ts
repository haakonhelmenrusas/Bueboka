import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    marginTop: 24,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
  },
  headerText: {
    fontSize: 18,
    paddingBottom: 8,
    fontWeight: '600',
    color: '#666',
  },
  activeText: {
    color: '#227B9A',
  },
  activeLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#227B9A',
  },
});
