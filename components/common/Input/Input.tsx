import React, { useState } from 'react';
import { Platform, StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { defaultStyles } from './InputStyles';
import { colors } from '@/styles/colors';

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

/**
 * Input component with label, optional icon and error message.
 *
 *
 * @param label - label text
 * @param error - if true, error message will be displayed
 * @param errorMessage - error message to be displayed
 * @param placeholderText - placeholder text for the input
 * @param containerStyle - custom style of the container
 * @param labelStyle - custom style of the label
 * @param inputStyle - custom style of the input
 * @param icon - icon to be displayed on the left side of the input
 * @param props - other TextInput props
 * @returns Input component
 */
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
  const [isFocused, setIsFocused] = useState(false);

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
        placeholder={isFocused ? '' : placeholderText}
        placeholderTextColor={colors.secondary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={{ color: colors.error, fontSize: 12 }}>{errorMessage}</Text>}
    </View>
  );
};

export default Input;
