import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flex: 1,
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 16 : 0,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
