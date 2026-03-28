import { colors } from '@/styles/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.white,
    borderRadius: 12,
    maxHeight: '95%',
    width: '100%',
  },
  scrollView: {
    maxHeight: 750,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scoreCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
    opacity: 0.85,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCardFull: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.dimmed,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.textSecondary,
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  customIcon: {
    fontSize: 20,
  },
  roundsSection: {
    gap: 12,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  roundsList: {
    gap: 12,
  },
  notesSection: {
    gap: 12,
  },
  notesContent: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.dimmed,
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    color: colors.textGray700,
    lineHeight: 20,
  },
  actions: {
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.dimmed,
  },
  actionButton: {
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  smallActionButton: {
    flex: 1,
  },
});
