import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    backgroundColor: '#F2F2F2',
  },
  tr: {
    display: 'flex',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  section: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
    margin: 8,
  },
  sectionCalc: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
    backgroundColor: '#D8F5FF',
    borderRadius: 12,
    margin: 8,
  },
  trData: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  thead: {
    fontWeight: '400',
    color: '#227B9A',
    textAlign: 'center',
    fontSize: 14,
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
});
