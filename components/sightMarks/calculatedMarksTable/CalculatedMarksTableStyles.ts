import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  page: {
    padding: 16,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  tr: {
    display: 'flex',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  trDataColumn: {
    display: 'flex',
    height: '100%',
    width: 80,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 12,
    backgroundColor: colors.tertiary,
  },
  trData: {
    fontSize: 16,
    textAlign: 'center',
  },
  angles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  angle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
});
