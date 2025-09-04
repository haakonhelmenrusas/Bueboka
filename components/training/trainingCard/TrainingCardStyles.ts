import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  trainingCard: {
    margin: 1,
    marginVertical: 6,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  content: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textSection: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: 4,
    color: colors.secondary,
  },
  arrowCount: {
    fontSize: 24,
    color: colors.dark_primary,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 8,
  },
  equipmentContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  equipmentGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  equipmentText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  editButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonGradient: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
