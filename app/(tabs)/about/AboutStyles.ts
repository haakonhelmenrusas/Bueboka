import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  header: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tertiary,
    margin: -16,
    paddingTop: 24,
    marginTop: -32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 32,
  },
  sub: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  box: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 24,
    textAlign: 'center',
  },
  feather: {
    color: colors.white,
    fontSize: 32,
    alignSelf: 'center',
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 16,
  },
  links: {
    marginTop: 32,
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  link: {
    fontSize: 16,
    color: colors.secondary,
  },
  sponsorContainer: {
    flexDirection: 'column',
    marginTop: 'auto',
    alignItems: 'center',
  },
  sponsor: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'center',
  },
  logo: {
    height: 150,
    width: 150,
  },
  sponsorLogo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 80,
    width: 250,
  },
});
