import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  header: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8F5FF',
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
    backgroundColor: '#053546',
    borderRadius: 10,
    padding: 24,
    textAlign: 'center',
  },
  feather: {
    color: '#fff',
    fontSize: 32,
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
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
    color: 'blue',
  },
  sponsorContainer: {
    flexDirection: 'column',
    marginTop: 'auto',
    alignItems: 'center',
  },
  sponsor: {
    fontSize: 14,
    color: '#227B9A',
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
