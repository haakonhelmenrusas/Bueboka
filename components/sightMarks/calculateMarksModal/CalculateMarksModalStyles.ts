import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    padding: 24,
    marginTop: 64,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  bottons: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 32,
    gap: 16,
  },
});
