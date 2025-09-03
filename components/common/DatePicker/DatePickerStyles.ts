import { Dimensions, Platform, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const { height: screenHeight } = Dimensions.get('window');

export const defaultStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'flex-start',
  },
  label: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
  dateButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 44 : 40, // iOS needs minimum 44pt touch target
    width: '100%',
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 4,
    // Ensure proper touch target on iOS
    minHeight: Platform.OS === 'ios' ? 44 : 40,
  },
  dateInput: {
    fontSize: 14,
    color: colors.primary,
    textAlignVertical: Platform.OS === 'android' ? 'center' : 'auto',
    textAlign: 'left',
    flex: 1,
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 0 : undefined,
    paddingBottom: Platform.OS === 'ios' ? 0 : undefined,
  },
  dateButtonError: {
    borderColor: colors.error,
  },
  dateText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    // Ensure text is centered vertically on iOS
    lineHeight: Platform.OS === 'ios' ? 20 : undefined,
  },
  placeholderText: {
    color: colors.secondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  // iOS Modal Styles
  backdrop: {
    position: 'absolute',
    top: -1000, // Cover entire screen including status bar
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  iosModalOverlay: {
    position: 'absolute',
    top: -1000, // Cover entire screen
    left: -1000,
    right: -1000,
    bottom: -1000,
    justifyContent: 'flex-end',
    zIndex: 999,
    paddingHorizontal: 1000,
    paddingTop: 1000,
    paddingBottom: 1000,
  },
  iosModalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Safe area for iPhone
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iosModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.dimmed,
    backgroundColor: colors.white,
  },
  iosModalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  iosModalButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 60,
    minHeight: 44, // Minimum touch target
    justifyContent: 'center',
  },
  iosModalButtonText: {
    fontSize: 17,
    color: colors.secondary,
  },
  iosModalConfirmText: {
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'right',
  },
  iosDatePicker: {
    backgroundColor: colors.white,
    height: 216,
    width: '100%',
  },
});
