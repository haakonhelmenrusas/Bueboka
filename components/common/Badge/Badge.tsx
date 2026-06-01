import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { styles } from './BadgeStyles';

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
