import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    lineHeight: 16,
  },
  iconContainer: {
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  smText: {
    fontSize: 11,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  mdText: {
    fontSize: 12,
  },
  lg: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  lgText: {
    fontSize: 13,
  },
  default: {
    backgroundColor: 'rgba(5, 53, 70, 0.06)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  defaultText: {
    color: '#4B5563',
  },
  training: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  trainingText: {
    color: 'rgb(37, 99, 235)',
  },
  competition: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  competitionText: {
    color: 'rgb(180, 100, 0)',
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  secondaryText: {
    color: colors.white,
  },
  ghost: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  ghostText: {
    color: colors.white,
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
