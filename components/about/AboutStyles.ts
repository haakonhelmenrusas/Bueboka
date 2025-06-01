import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tertiary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  sub: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginHorizontal: 24,
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
    marginVertical: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  link: {
    fontSize: 16,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    color: colors.secondary,
  },
  sponsor: {
    fontSize: 16,
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
