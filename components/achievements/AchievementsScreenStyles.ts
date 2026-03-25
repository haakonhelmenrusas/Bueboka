import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: colors.white80,
    lineHeight: 18,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: colors.white80,
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: colors.errorBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.white20,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white15,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.white80,
    fontWeight: '500',
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  filtersContainer: {
    gap: 8,
    backgroundColor: colors.white08,
    borderRadius: 12,
    padding: 12,
  },
  filterGroup: {
    gap: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white80,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: colors.white10,
    borderWidth: 1,
    borderColor: colors.white15,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white80,
  },
  filterButtonTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.white80,
  },
});

