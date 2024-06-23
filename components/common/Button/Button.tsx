import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text, TextStyle, ViewStyle } from 'react-native';

interface ButtonProps extends PressableProps {
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  label: string;
  width?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'filled' | 'outline';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  buttonStyle,
  textStyle,
  label,
  icon,
  width,
  disabled,
  type = 'filled',
  loading = false,
  ...props
}) => {
  const buttonColor = type === 'outline' ? 'transparent' : '#053546';
  const textColor = type === 'outline' ? '#053546' : 'white';

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: disabled || loading ? 0.6 : pressed ? 0.8 : 1,
          backgroundColor: buttonColor,
          justifyContent: 'center',
          alignItems: 'center',
          width: width,
          borderColor: buttonColor,
          borderWidth: type === 'outline' ? 1 : 0,
          paddingVertical: 8,
          paddingHorizontal: 24,
          borderRadius: 8,
          height: 40,
        },
        buttonStyle,
      ]}
      disabled={disabled || loading}
      {...props}>
      {loading ? (
        <ActivityIndicator testID="ActivityIndicator" size={16} color={textColor} />
      ) : (
        icon || <Text style={[textStyle, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
};

export default Button;
