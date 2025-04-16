import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 32,
  },
  bow: {
    height: 240,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.inactive,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    padding: 16,
    alignItems: 'flex-end',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    backgroundColor: colors.inactive,
  },
  image: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    color: colors.tertiary,
    fontWeight: 'medium',
  },
});
