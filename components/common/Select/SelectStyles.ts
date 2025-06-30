import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectBox: {
    borderWidth: 1,
    height: 40,
    borderColor: colors.secondary,
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#fff',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 2,
    elevation: 6,
    maxHeight: 200,
  },
  scrollList: {
    paddingVertical: 6,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default styles;
