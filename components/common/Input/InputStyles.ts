import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
  container: { marginBottom: 16, height: 40 },
  labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  label: { color: '#053546', fontWeight: '500', fontSize: 14 },
  input: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  icon: { marginRight: 8 },
});
