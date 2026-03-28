import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.8)',
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
    color: 'rgba(255,255,255,0.6)',
  },
  activeText: {
    color: colors.white,
    fontWeight: '700',
  },
  activeLine: {
    height: 2,
    width: '100%',
    backgroundColor: colors.white,
  },
});
