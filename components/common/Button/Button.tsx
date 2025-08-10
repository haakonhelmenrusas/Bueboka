import React from 'react';
import { ActivityIndicator, DimensionValue, Pressable, PressableProps, Text, TextStyle, ViewStyle } from 'react-native';
import { colors } from '@/styles/colors';

interface ButtonProps extends PressableProps {
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  label: string;
  width?: number | DimensionValue;
  /**
   * FontAwesome icon component to render inside the button (optional)
   */
  icon?: any;
  disabled?: boolean;
  type?: 'filled' | 'outline';
  loading?: boolean;
  iconPosition?: 'left' | 'right';
  variant?: 'standard' | 'warning';
  size?: 'small' | 'normal';
}

const Button: React.FC<ButtonProps> = ({
  buttonStyle,
  textStyle,
  label,
  icon,
  width = 'auto',
  disabled,
  type = 'filled',
  loading = false,
  iconPosition = 'left',
  variant = 'standard',
  size = 'normal',
  ...props
}) => {
  const getColors = () => {
    switch (variant) {
      case 'warning':
        return {
          main: type === 'outline' ? colors.transparent : colors.error,
          text: type === 'outline' ? colors.error : colors.white,
        };
      case 'standard':
      default:
        return {
          main: type === 'outline' ? colors.transparent : colors.primary,
          text: type === 'outline' ? colors.primary : colors.white,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 32,
          paddingVertical: 4,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 12,
        };
      case 'normal':
      default:
        return {
          height: 48,
          paddingVertical: 8,
          paddingHorizontal: 24,
          fontSize: 16,
          iconSize: 16,
        };
    }
  };

  const { main: buttonColor, text: textColor } = getColors();
  const sizeStyles = getSizeStyles();

  const renderContent = () => {
    const content = [
      icon && React.isValidElement(icon) && iconPosition === 'left' && React.cloneElement(icon, { key: 'icon-left' }),
      <Text
        key="label"
        style={[textStyle, { fontSize: sizeStyles.fontSize, color: textColor, marginLeft: icon ? 8 : 0, marginRight: icon ? 8 : 0 }]}>
        {label}
      </Text>,
      icon && React.isValidElement(icon) && iconPosition === 'right' && React.cloneElement(icon, { key: 'icon-right' }),
    ];

    return content.filter(Boolean);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: disabled || loading ? 0.6 : pressed ? 0.8 : 1,
          backgroundColor: type === 'outline' ? colors.transparent : buttonColor,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: width,
          borderColor: buttonColor,
          borderWidth: type === 'outline' ? 1 : 0,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderRadius: 8,
          height: sizeStyles.height,
        },
        buttonStyle,
      ]}
      disabled={disabled ?? loading}
      {...props}>
      {loading ? <ActivityIndicator testID="ActivityIndicator" size={sizeStyles.iconSize} color={textColor} /> : renderContent()}
    </Pressable>
  );
};

export default Button;
