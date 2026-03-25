import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 6,
    paddingRight: 4,
    height: 64,
  },
  section: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginHorizontal: 4,
  },
  sectionCalc: {
    flex: 1,
    maxWidth: 80,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    marginHorizontal: 6,
  },
  deleteButton: {
    width: 36,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trData: {
    fontSize: 17,
    lineHeight: 18,
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.white,
  },
  thead: {
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    fontSize: 12,
  },
  theadBlack: {
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    fontSize: 12,
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
});
