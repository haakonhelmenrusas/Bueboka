import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
    marginBottom: 2,
  },

  // ── Section ────────────────────────────────────────────────────────────────
  section: {
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },

  // ── Card ───────────────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },

  // ── Account grid ───────────────────────────────────────────────────────────
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoGridItem: {
    width: '47%',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.inactive,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  editButtonRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.07)',
    paddingTop: 12,
  },

  // ── Public profile ─────────────────────────────────────────────────────────
  privacyIntro: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textGray700,
  },
  publicSubSettings: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginTop: 4,
  },
  publicSubLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textGray700,
    marginBottom: 2,
  },
  successMessage: {
    padding: 10,
    backgroundColor: 'rgba(0, 184, 148, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 148, 0.4)',
    borderRadius: 10,
  },
  successMessageText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  errorMessage: {
    padding: 10,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: 10,
  },
  errorMessageText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.errorLight,
  },

  // ── Privacy list ───────────────────────────────────────────────────────────
  privacyList: {
    gap: 10,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  privacyIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  privacyItemContent: {
    flex: 1,
    gap: 2,
  },
  privacyItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    lineHeight: 18,
  },
  privacyItemDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textGray700,
  },
  privacyFooter: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textGray700,
    fontStyle: 'italic',
  },
  link: {
    color: colors.primaryLight,
    textDecorationLine: 'underline',
  },

  // ── Sponsor ────────────────────────────────────────────────────────────────
  sponsorCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sponsorLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.inactive,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sponsorLogo: {
    height: 64,
    width: 200,
  },
  sponsorLink: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryDark,
    textDecorationLine: 'underline',
  },
  // ── Logout ─────────────────────────────────────────────────────────────────
  logoutButton: {
    minHeight: 52,
  },
  logoutLabel: {
    fontWeight: '700',
  },

  // ── Danger zone ────────────────────────────────────────────────────────────
  dangerCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.35)',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  dangerHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.error,
  },
  dangerDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textGray700,
  },
  dangerText: {
    fontSize: 13,
    color: colors.error,
    fontStyle: 'italic',
  },
});
