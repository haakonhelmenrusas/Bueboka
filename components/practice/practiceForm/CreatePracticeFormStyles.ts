import { Dimensions, Platform, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = WINDOW_HEIGHT * 0.88;

export const styles = StyleSheet.create({
  // ─── Modal container ─────────────────────────────────────────────────────────
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: MODAL_HEIGHT,
    ...Platform.select({ android: { minHeight: WINDOW_HEIGHT * 0.7 } }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },

  // ─── Step content wrapper ─────────────────────────────────────────────────────
  stepContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },

  // ─── Step indicator ───────────────────────────────────────────────────────────
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgGray50,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  stepDotCompleted: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepDotTextActive: {
    color: colors.white,
  },
  stepLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: colors.secondary,
  },
  stepConnector: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.border,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  stepConnectorCompleted: {
    backgroundColor: colors.secondary,
  },

  // ─── Step description ─────────────────────────────────────────────────────────
  stepDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },

  // ─── Generic layout helpers ───────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
    marginVertical: 8,
  },
  inputContainer: {
    marginVertical: 8,
  },

  // ─── Section titles ───────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 4,
  },

  // ─── Weather chips ────────────────────────────────────────────────────────────
  weatherSection: {
    marginVertical: 8,
  },
  weatherLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  weatherChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weatherChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgGray100,
  },
  weatherChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  weatherChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  weatherChipTextActive: {
    color: colors.white,
  },

  // ─── Rounds section ───────────────────────────────────────────────────────────
  roundsSection: {
    marginVertical: 4,
  },
  roundCard: {
    backgroundColor: colors.bgGray50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  roundNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  removeRoundBtn: {
    padding: 6,
  },
  roundFields: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  roundField: {
    flex: 1,
  },
  addRoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 4,
  },
  addRoundBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  limitMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // ─── Arrow scoring step ───────────────────────────────────────────────────────
  emptyScoring: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.bgGray50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  emptyScoringText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  scoringCard: {
    backgroundColor: colors.bgGray50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  scoringCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoringRoundTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  scoringRoundMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  arrowChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  arrowChip: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  arrowChipFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  arrowChipEmpty: {
    backgroundColor: colors.bgGray100,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  arrowChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrowChipTextFilled: {
    color: colors.white,
  },
  arrowChipTextEmpty: {
    color: colors.dimmed,
  },
  scoringProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoringProgressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scoringTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  scoreButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButtonX: {
    borderColor: colors.accentYellow,
    backgroundColor: colors.starBg,
  },
  scoreButtonMiss: {
    borderColor: colors.errorBorder,
    backgroundColor: colors.errorBg,
  },
  scoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  scoreButtonTextX: {
    color: colors.starColor,
  },
  scoreButtonTextMiss: {
    color: colors.error,
  },
  scoringComplete: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 128, 0, 0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 128, 0, 0.2)',
    alignItems: 'center',
  },
  scoringCompleteText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  backspaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backspaceBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  // ─── Rating section ───────────────────────────────────────────────────────────
  ratingSection: {
    marginVertical: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  ratingHelpText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  ratingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgGray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ratingButtonText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  ratingButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },

  // ─── Delete link ──────────────────────────────────────────────────────────────
  deleteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    marginTop: 24,
    padding: 8,
  },
  deleteLinkText: {
    fontSize: 14,
    color: colors.error,
  },

  // ─── Navigation footer ────────────────────────────────────────────────────────
  navFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: colors.white,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navArrow: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgGray50,
  },
  navArrowDisabled: {
    opacity: 0.35,
  },
  navStepName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  navActions: {
    flexDirection: 'row',
    gap: 10,
  },

  // ─── Error message ────────────────────────────────────────────────────────────
  error: {
    color: colors.error,
    fontSize: 13,
    marginVertical: 8,
    textAlign: 'center',
  },

  // ─── Legacy – kept for backward compat ───────────────────────────────────────
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  startButton: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    height: 48,
  },
  saveButton: {
    backgroundColor: colors.secondary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  deleteRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  deleteBtn: {
    padding: 8,
  },
});
