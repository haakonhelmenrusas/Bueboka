import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  meta: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  description: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  rules: {
    marginTop: 8,
  },
  rulesGrid: {
    gap: 8,
  },
  ruleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  ruleLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ruleValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  participants: {
    marginTop: 8,
  },
  participantRow: {
    flexDirection: 'row',
    gap: 16,
  },
  participant: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantScore: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  arrowsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  submittedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  submittedText: {
    fontSize: 12,
    color: colors.white,
  },
  result: {
    marginTop: 8,
    alignItems: 'center',
  },
  winnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  winnerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  scoresContainer: {
    alignItems: 'center',
  },
  scoreComparison: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 16,
  },
  buttonAccept: {
    backgroundColor: colors.success,
  },
  buttonDecline: {
    backgroundColor: colors.error,
  },
  buttonCancel: {
    backgroundColor: colors.warning,
  },
  buttonSubmit: {
    backgroundColor: colors.primary,
  },
  buttonDelete: {
    backgroundColor: colors.error,
  },
});
