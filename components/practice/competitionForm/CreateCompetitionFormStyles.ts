import { Dimensions, Platform, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = WINDOW_HEIGHT * 0.88;

export const styles = StyleSheet.create({
  // ─── Modal container ──────────────────────────────────────────────────────────
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: MODAL_HEIGHT,
    ...Platform.select({ android: { minHeight: WINDOW_HEIGHT * 0.7 } }),
  },
  scrollView: { flex: 1 },
  scrollContainer: { flexGrow: 1 },

  // ─── Step content ─────────────────────────────────────────────────────────────
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
  stepItem: { alignItems: 'center', gap: 4 },
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
  stepDotActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  stepDotCompleted: { borderColor: colors.secondary, backgroundColor: colors.secondary },
  stepDotText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  stepDotTextActive: { color: colors.white },
  stepLabel: { fontSize: 10, color: colors.textSecondary },
  stepLabelActive: { color: colors.primary, fontWeight: '600' },
  stepLabelCompleted: { color: colors.secondary },
  stepConnector: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.border,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  stepConnectorCompleted: { backgroundColor: colors.secondary },

  // ─── Layout helpers ───────────────────────────────────────────────────────────
  row: { flexDirection: 'row', gap: 12 },
  field: { flex: 1, marginVertical: 8 },
  inputContainer: { marginVertical: 8 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 4,
  },

  // ─── Weather chips ────────────────────────────────────────────────────────────
  weatherSection: { marginVertical: 8 },
  weatherLabel: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 8 },
  weatherChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  weatherChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgGray100,
  },
  weatherChipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  weatherChipText: { fontSize: 13, color: colors.textSecondary },
  weatherChipTextActive: { color: colors.white },

  // ─── Details step ─────────────────────────────────────────────────────────────
  personalBestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.starBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.starBorder,
    gap: 10,
  },
  personalBestText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.starColor,
    flex: 1,
  },
  personalBestHint: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  // ─── Rounds section ───────────────────────────────────────────────────────────
  roundsSection: { marginVertical: 4 },
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
  roundNumber: { fontSize: 14, fontWeight: '600', color: colors.primary },
  removeRoundBtn: { padding: 6 },
  roundFields: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  roundField: { flex: 1 },
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
  addRoundBtnText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  limitMessage: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },

  // ─── Delete section ───────────────────────────────────────────────────────────
  deleteSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.errorBorder,
    alignItems: 'center',
  },
  deleteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
  },
  deleteLinkText: { fontSize: 14, fontWeight: '500', color: colors.error },

  // ─── Navigation footer ────────────────────────────────────────────────────────
  navFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: colors.white,
  },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  navArrowDisabled: { opacity: 0.35 },
  navStepName: { fontSize: 14, fontWeight: '600', color: colors.primary },
  navActions: { flexDirection: 'row', gap: 10 },

  // ─── Error ────────────────────────────────────────────────────────────────────
  error: { color: colors.error, fontSize: 13, marginVertical: 8, textAlign: 'center' },

  // ─── Legacy compat ────────────────────────────────────────────────────────────
  saveButton: { backgroundColor: colors.secondary },
});
