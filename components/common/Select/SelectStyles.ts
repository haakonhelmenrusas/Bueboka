import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/styles/colors';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: colors.white,
  },
  selectText: {
    fontSize: 16,
    color: colors.primary,
  },
  overlay: {
    position: 'absolute',
    top: -WINDOW_HEIGHT,
    left: -20,
    right: -20,
    height: WINDOW_HEIGHT * 2,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  dropdown: {
    position: 'absolute',
    top: 64,
    paddingVertical: 4,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 6,
    shadowColor: colors.dark_primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
    zIndex: 1000,
  },
  scrollContainer: {
    maxHeight: 200,
  },
  scrollContentContainer: {
    flexGrow: 0,
  },
  optionsContainer: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: 16,
    color: colors.primary,
  },
});

export default styles;
