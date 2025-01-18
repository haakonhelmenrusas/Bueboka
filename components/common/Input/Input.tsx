import React from 'react';
import { Platform, StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { defaultStyles } from './InputStyles';

const isAndroid = Platform.OS === 'android';

interface InputProps extends TextInputProps {
  label: string;
  error?: boolean;
  errorMessage?: string;
  placeholderText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

const Input = ({
  label,
  error,
  errorMessage,
  placeholderText,
  containerStyle,
  labelStyle,
  inputStyle,
  icon,
  ...props
}: InputProps) => {
  return (
    <View
      style={[defaultStyles.container, containerStyle]}
      accessibilityLabel={isAndroid ? label : `${label}${': Disabled!'}`}>
      <View style={defaultStyles.labelContainer}>
        {icon && <View style={defaultStyles.icon}>{icon}</View>}
        <Text style={[defaultStyles.label, labelStyle]}>{label}</Text>
      </View>
      <TextInput
        testID="input"
        style={[defaultStyles.input, inputStyle]}
        placeholder={placeholderText}
        placeholderTextColor="#494949"
        {...props}
      />
      {error && <Text style={{ color: 'red', fontSize: 12 }}>{errorMessage}</Text>}
    </View>
  );
};

export default Input;
