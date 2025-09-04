import { Dimensions, Platform, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 40,
    position: 'relative',
    width: '100%',
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: colors.primary,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: colors.white,
    height: 40,
  },
  selectText: {
    fontSize: 14,
    color: colors.primary,
    flex: 1,
    marginRight: 8,
  },
  // iOS/Web Overlay
  overlay: {
    position: 'absolute',
    top: -WINDOW_HEIGHT * 2,
    left: -100,
    right: -100,
    height: WINDOW_HEIGHT * 4,
    backgroundColor: 'transparent',
  },
  // iOS/Web Dropdown
  dropdown: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: Platform.OS === 'android' ? 15 : 0,
    shadowColor: colors.dark_primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    maxHeight: 200,
  },
  // Android Modal Styles
  modalBackdrop: {
    flex: 1,
  },
  modalDropdown: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    maxHeight: 250,
    minHeight: 100,
  },
  // Common List Styles
  optionsList: {
    flex: 1,
  },
  optionsContainer: {
    paddingVertical: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.dimmed,
    minHeight: 50,
  },
  optionSelected: {
    backgroundColor: colors.background,
  },
  optionText: {
    fontSize: 14,
    color: colors.primary,
    flex: 1,
    marginRight: 8,
  },
});

export default styles;
