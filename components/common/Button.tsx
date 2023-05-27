import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text, TextStyle, ViewStyle } from 'react-native';

interface ButtonProps extends PressableProps {
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  label: string;
  disabled?: boolean;
  type?: 'filled' | 'outline';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  buttonStyle,
  textStyle,
  label,
  disabled,
  type = 'filled',
  loading = false,
  ...props
}) => {
  const buttonColor = type === 'outline' ? 'transparent' : 'blue';
  const textColor = type === 'outline' ? 'blue' : 'white';

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: disabled || loading ? 0.6 : pressed ? 0.8 : 1,
          backgroundColor: buttonColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 4,
          //elevation: 1,
          height: 48,
        },
        buttonStyle,
      ]}
      disabled={disabled || loading}
      {...props}>
      {loading ? (
        <ActivityIndicator size={16} color={textColor} />
      ) : (
        <Text style={[textStyle, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
};

export default Button;
