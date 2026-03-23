import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

/** Compose rgba from a hex color constant and an opacity value */
const rgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

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
    paddingTop: 80,
    paddingBottom: 56,
    alignItems: 'center',
    width: '100%',
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: rgba(colors.white, 0.12),
    borderWidth: 1,
    borderColor: rgba(colors.white, 0.2),
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
    lineHeight: 25,
    marginBottom: 24,
    maxWidth: 560,
    paddingHorizontal: 16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: rgba(colors.white, 0.12),
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: rgba(colors.white, 0.25),
    width: '100%',
    maxWidth: 480,
    marginTop: 16,
  },
  searchWrapFocused: {
    backgroundColor: rgba(colors.white, 0.18),
    borderColor: rgba(colors.white, 0.5),
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    paddingHorizontal: 20,
    paddingTop: 24,
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
    borderColor: rgba(colors.white, 0.18),
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
    backgroundColor: rgba(colors.white, 0.1),
    borderWidth: 1.5,
    borderColor: rgba(colors.white, 0.25),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  idleHint: {
    fontSize: 14,
    color: rgba(colors.white, 0.5),
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
