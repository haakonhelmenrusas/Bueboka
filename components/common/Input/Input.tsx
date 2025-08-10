import React, { useState } from 'react';
import { Platform, StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { defaultStyles } from './InputStyles';
import { colors } from '@/styles/colors';

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
const Input = React.forwardRef<TextInput, InputProps>((props, ref: React.Ref<TextInput>) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[defaultStyles.container, props.containerStyle]}
      accessibilityLabel={Platform.OS === 'android' ? props.label : `${props.label}${': Disabled!'}`}>
      <View style={[defaultStyles.labelContainer, props.labelStyle]}>
        {props.icon && <View style={defaultStyles.icon}>{props.icon}</View>}
        <Text style={defaultStyles.label}>{props.label}</Text>
      </View>
      <TextInput
        ref={ref}
        testID="input"
        style={[defaultStyles.input, props.inputStyle]}
        placeholder={isFocused ? '' : props.placeholderText}
        placeholderTextColor={colors.secondary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {props.error && <Text style={{ color: colors.error, fontSize: 12 }}>{props.errorMessage}</Text>}
    </View>
  );
});

export default Input;
