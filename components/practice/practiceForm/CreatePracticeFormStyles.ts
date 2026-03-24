import { Platform, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  // ─── Modal container ────────────────────────────────────────────────────────
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: '95%',
    ...Platform.select({ android: { minHeight: '80%' } }),
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },

  // ─── Generic layout helpers ─────────────────────────────────────────────────
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

  // ─── Section titles ─────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 4,
  },

  // ─── Weather chips ──────────────────────────────────────────────────────────
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

  // ─── Rounds section ─────────────────────────────────────────────────────────
  roundsSection: {
    marginVertical: 8,
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

  // ─── Rating section ─────────────────────────────────────────────────────────
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
    width: 32,
    height: 32,
    borderRadius: 16,
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

  // ─── Footer / actions ────────────────────────────────────────────────────────
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

  // ─── Error message ───────────────────────────────────────────────────────────
  error: {
    color: colors.error,
    fontSize: 13,
    marginVertical: 8,
    textAlign: 'center',
  },

  // ─── Legacy – kept for backward compat ──────────────────────────────────────
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
});
