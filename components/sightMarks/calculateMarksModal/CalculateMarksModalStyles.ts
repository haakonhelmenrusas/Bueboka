import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  modal: {
    padding: 24,
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputs: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 32,
  },
  angles: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
  },
  buttons: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 'auto',
    gap: 8,
  },
});
