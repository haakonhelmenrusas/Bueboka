import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.primarySubtle,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primarySubtleBorder,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  list: {
    gap: 8,
  },
  placeholder: {
    backgroundColor: colors.secondarySubtle,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.secondarySubtleBorder,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
