import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    backgroundColor: colors.background,
  },
  tr: {
    display: 'flex',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.inactive,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  section: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
    margin: 8,
  },
  sectionCalc: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    margin: 8,
  },
  trData: {
    flex: 1,
    fontSize: 18,

    fontWeight: '500',
    textAlign: 'center',
  },
  thead: {
    fontWeight: '400',
    color: colors.secondary,
    textAlign: 'center',
    fontSize: 14,
  },
  theadBlack: {
    fontWeight: '400',
    color: colors.dark_primary,
    textAlign: 'center',
    fontSize: 14,
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
});
