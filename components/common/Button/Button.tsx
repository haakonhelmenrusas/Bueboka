import React from 'react';
import { ActivityIndicator, DimensionValue, Pressable, PressableProps, Text, TextStyle, ViewStyle } from 'react-native';

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
  ...props
}) => {
  const buttonColor = type === 'outline' ? 'transparent' : '#053546';
  const textColor = type === 'outline' ? '#053546' : 'white';

  const renderContent = () => {
    const content = [
      icon && React.isValidElement(icon) && iconPosition === 'left' && React.cloneElement(icon, { key: 'icon-left' }),
      <Text key="label" style={[textStyle, { color: textColor, marginLeft: icon ? 8 : 0, marginRight: icon ? 8 : 0 }]}>
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
          backgroundColor: buttonColor,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: width,
          borderColor: buttonColor,
          borderWidth: type === 'outline' ? 1 : 0,
          paddingVertical: 8,
          paddingHorizontal: 24,
          borderRadius: 8,
          height: 48,
        },
        buttonStyle,
      ]}
      disabled={disabled ?? loading}
      {...props}>
      {loading ? <ActivityIndicator testID="ActivityIndicator" size={16} color={textColor} /> : renderContent()}
    </Pressable>
  );
};

export default Button;
