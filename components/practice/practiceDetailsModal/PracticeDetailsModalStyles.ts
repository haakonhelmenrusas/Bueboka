import { colors } from '@/styles/colors';
import { Dimensions, StyleSheet } from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '100%',
    height: WINDOW_HEIGHT * 0.85,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  scoreCard: {
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 2,
  },
  scoreSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.white,
    opacity: 0.85,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCardFull: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.dimmed,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.textSecondary,
    flex: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  customIcon: {
    fontSize: 18,
  },
  roundsSection: {
    gap: 10,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  roundsList: {
    gap: 8,
  },
  notesSection: {
    gap: 10,
  },
  notesContent: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.dimmed,
    borderRadius: 10,
    padding: 12,
  },
  notesText: {
    color: colors.textGray700,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.dimmed,
  },
  actionButton: {
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallActionButton: {
    flex: 1,
  },
});
