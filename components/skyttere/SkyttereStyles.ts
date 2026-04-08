import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { hexToRgba } from '@/utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 56,
    alignItems: 'center',
    width: '100%',
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: hexToRgba(colors.white, 0.12),
    borderWidth: 1,
    borderColor: hexToRgba(colors.white, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    maxWidth: 580,
    paddingHorizontal: 8,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: hexToRgba(colors.white, 0.12),
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: hexToRgba(colors.white, 0.25),
    width: '100%',
    maxWidth: 480,
    marginTop: 16,
  },
  searchWrapFocused: {
    // intentionally empty – focus colours are animated in the component via Animated.Value
    // to avoid a setState re-render that loses native TextInput focus
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    padding: 0,
  },
  results: {
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 56,
  },
  idle: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 20,
  },
  idleTarget: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  idleRing: {
    position: 'absolute',
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: hexToRgba(colors.white, 0.18),
  },
  idleRing1: {
    width: 140,
    height: 140,
  },
  idleRing2: {
    width: 100,
    height: 100,
  },
  idleRing3: {
    width: 62,
    height: 62,
  },
  idleCenter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: hexToRgba(colors.white, 0.1),
    borderWidth: 1.5,
    borderColor: hexToRgba(colors.white, 0.25),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  idleHint: {
    fontSize: 14,
    color: hexToRgba(colors.white, 0.5),
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
