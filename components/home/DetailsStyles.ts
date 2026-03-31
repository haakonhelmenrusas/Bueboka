import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '100%',
    maxHeight: WINDOW_HEIGHT * 0.85,
    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 8,
  },
  content: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.secondary,
  },
  value: {
    fontSize: 14,
  },
});
