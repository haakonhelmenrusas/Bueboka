import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    gap: 14,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    opacity: 0.72,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  tierBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    gap: 5,
  },
  name: {
    fontWeight: '700',
    lineHeight: 20,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 16,
  },
  progressContainer: {
    gap: 4,
    marginTop: 2,
  },
  progressBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.bgGray200,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 4,
    backgroundColor: '#16a34a',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});
