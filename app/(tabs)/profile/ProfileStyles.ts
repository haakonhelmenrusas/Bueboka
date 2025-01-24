import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 32,
  },
  bow: {
    height: 240,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9697B6',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    padding: 16,
    alignItems: 'flex-end',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    backgroundColor: '#9697B6',
  },
  image: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    color: '#D8F5FF',
    fontWeight: 'medium',
  },
});
