import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    //TODO: Fix this for iOS
    //marginBottom: Platform.OS === 'ios' ? 8 : 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: colors.dark_primary,
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
