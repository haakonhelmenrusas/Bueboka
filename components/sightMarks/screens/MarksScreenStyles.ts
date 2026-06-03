import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    minHeight: '50%',
  },
  selectorCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 2000,
    gap: 8,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorHeaderText: {
    flex: 1,
    gap: 2,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  selectorHint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  selectorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  selectorMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    marginTop: 'auto',
    padding: 16,
  },
  actionBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
});
