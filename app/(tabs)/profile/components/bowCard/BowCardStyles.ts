import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    width: '100%',
    marginHorizontal: 'auto',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#053546',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    backgroundColor: '#053546',
  },
  image: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    color: '#D8F5FF',
    fontWeight: 'medium',
  },
  cogIcon: {
    marginLeft: 'auto',
    padding: 8,
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  column: {
    flex: 1,
  },
  head: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 16,
  },
});
