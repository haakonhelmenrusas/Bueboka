import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  modal: {
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  section: {
    marginTop: 16,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
});
