import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // ── Decorative background rings (target-face theme) ──────────────────────
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.white10,
  },
  ring1: { width: 320, height: 320, top: -100, right: -100 },
  ring2: { width: 200, height: 200, top: -40, right: -40 },
  ring3: { width: 500, height: 500, bottom: -160, left: -180 },
  ring4: { width: 300, height: 300, bottom: -60, left: -60 },

  // ── Layout ────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 0,
  },

  // ── Logo section ──────────────────────────────────────────────────────────
  logoSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 48,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 72,
    height: 72,
  },
  appName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white85,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // ── Hero section ──────────────────────────────────────────────────────────
  heroSection: {
    flex: 1,
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.tertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 48,
    marginBottom: 20,
  },
  titleAccent: {
    color: colors.tertiary,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.white80,
    marginBottom: 12,
  },

  // ── CTA section ───────────────────────────────────────────────────────────
  ctaSection: {
    paddingBottom: 40,
  },
  ctaButton: {
    height: 56,
    borderRadius: 12,
  },
});
