import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  modal: {
    marginTop: 'auto',
    marginBottom: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 160,
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: colors.dark_primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
