import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  section: {
    marginBottom: 18,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inactive,
    marginBottom: 4,
  },
  value: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  logoutButton: {
    minHeight: 52,
  },
  logoutLabel: {
    fontWeight: '700',
  },
  dangerText: {
    fontSize: 13,
    color: colors.error,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
