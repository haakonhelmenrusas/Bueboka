import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 24,
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
    fontSize: 16,
    paddingBottom: 8,
    fontWeight: '500',
    color: colors.dark_primary,
  },
  activeText: {
    color: colors.secondary,
  },
  activeLine: {
    height: 2,
    width: '100%',
    backgroundColor: colors.secondary,
  },
});
