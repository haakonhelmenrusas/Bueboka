import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetWrapper: {
    overflow: 'hidden',
  },
  targetContent: {
    position: 'relative',
  },
  arrowHit: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.white,
    zIndex: 10,
  },
  arrowHitEditing: {
    borderColor: colors.warning,
    borderWidth: 2.5,
  },
  crosshair: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  crosshairShadowH: {
    position: 'absolute',
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 1.5,
  },
  crosshairShadowV: {
    position: 'absolute',
    width: 3,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 1.5,
  },
  crosshairLineH: {
    position: 'absolute',
    width: '100%',
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  crosshairLineV: {
    position: 'absolute',
    width: 1.5,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  crosshairDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  undoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 12,
  },
  undoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.bgGray100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  undoText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.error,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
});
