import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  // ─── Filter tabs ────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.white20,
    borderWidth: 1,
    borderColor: colors.white30,
  },
  filterTabActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white80,
  },
  filterTabTextActive: {
    color: colors.primary,
  },
  // ─── List ───────────────────────────────────────────────────────────────
  list: {
    gap: 8,
  },
  // ─── Load more ──────────────────────────────────────────────────────────
  loadMoreBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.white20,
    borderWidth: 1,
    borderColor: colors.white30,
    marginTop: 4,
    minHeight: 44,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  // ─── States ─────────────────────────────────────────────────────────────
  placeholder: {
    backgroundColor: 'rgba(12, 130, 172, 0.05)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(12, 130, 172, 0.26)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
