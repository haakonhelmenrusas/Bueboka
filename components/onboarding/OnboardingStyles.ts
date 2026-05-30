import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Decorative background rings
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

  container: {
    flex: 1,
    paddingHorizontal: 28,
  },

  // Skip button
  skipButton: {
    position: 'absolute',
    top: 8,
    right: 28,
    zIndex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 15,
    color: colors.white50,
    fontWeight: '500',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 48,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.white80,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Body
  body: {
    flex: 1,
  },

  // Step 1: Welcome
  heroText: {
    fontSize: 16,
    color: colors.white80,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white10,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.white10,
  },
  featureIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.white15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.white80,
    lineHeight: 18,
  },

  // Step 2: Getting started
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white15,
    borderWidth: 1,
    borderColor: colors.white25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  stepTextContainer: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    color: colors.white80,
    lineHeight: 21,
  },

  // Step 3: Tips
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 14,
  },
  tipIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.white15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 3,
  },
  tipDesc: {
    fontSize: 14,
    color: colors.white80,
    lineHeight: 20,
  },

  // Footer
  footer: {
    paddingBottom: 40,
    paddingTop: 16,
    gap: 20,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white25,
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 24,
  },
  dotCompleted: {
    backgroundColor: colors.white50,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  backButton: {
    height: 52,
    borderRadius: 12,
    borderColor: colors.white30,
  },
  nextButton: {
    height: 52,
    borderRadius: 12,
  },
});
