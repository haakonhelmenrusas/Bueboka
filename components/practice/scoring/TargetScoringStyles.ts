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
  previewDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderColor: colors.white,
    zIndex: 20,
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
