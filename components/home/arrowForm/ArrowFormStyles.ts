import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  modal: {
    padding: 16,
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputs: {
    gap: 16,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  advancedLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  advancedLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  advancedLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  advancedContent: {
    gap: 16,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  footer: {
    paddingTop: 8,
    gap: 8,
  },
  // Two equal columns
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
});
