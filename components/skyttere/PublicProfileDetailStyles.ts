import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { hexToRgba } from '@/utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: hexToRgba(colors.white, 0.7),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 20,
    gap: 8,
  },
  backText: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarWrap: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: hexToRgba(colors.primary, 0.08),
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  badges: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  clubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: hexToRgba(colors.primary, 0.08),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skytternrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: hexToRgba(colors.primary, 0.08),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  statsSection: {
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: hexToRgba(colors.primary, 0.1),
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 130,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: hexToRgba(colors.primary, 0.04),
    borderRadius: 12,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: hexToRgba(colors.primary, 0.6),
    textAlign: 'center',
  },
});
