import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/styles/colors';

export type BadgeVariant = 'default' | 'training' | 'competition' | 'primary' | 'secondary' | 'ghost';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Visual style of the badge */
  variant?: BadgeVariant;
  /** Size preset */
  size?: BadgeSize;
  /** Optional leading icon */
  icon?: React.ReactNode;
  children: React.ReactNode;
  /** Extra style for one-off layout overrides */
  style?: ViewStyle;
  /** Extra text style overrides */
  textStyle?: TextStyle;
  /** Render text in ALL-CAPS with wider letter-spacing */
  uppercase?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'md', icon, children, style, textStyle, uppercase = false }) => {
  const badgeStyles = [styles.badge, styles[variant], styles[size], style];

  const badgeTextStyles = [styles.text, styles[`${size}Text`], styles[`${variant}Text`], uppercase && styles.uppercase, textStyle];

  return (
    <View style={badgeStyles}>
      {icon && (
        <View style={styles.iconContainer} aria-hidden={true}>
          {icon}
        </View>
      )}
      <Text style={badgeTextStyles}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
  /* default */
  default: {
    backgroundColor: 'rgba(5, 53, 70, 0.06)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  defaultText: {
    color: '#4B5563', // Gray 600
  },

  /* training – blue */
  training: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  trainingText: {
    color: 'rgb(37, 99, 235)',
  },

  /* competition – amber */
  competition: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  competitionText: {
    color: 'rgb(180, 100, 0)',
  },

  /* primary – solid brand colour */
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
  },

  /* secondary – solid secondary colour */
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  secondaryText: {
    color: colors.white,
  },

  /* ghost – semi-transparent white */
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
