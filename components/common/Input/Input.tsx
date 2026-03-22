import React, { useState } from 'react';
import { Platform, StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { defaultStyles } from './InputStyles';
import { colors } from '@/styles/colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: boolean;
  errorMessage?: string;
  helpText?: string;
  optional?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

/**
 * Input component matching web version design.
 * Supports label, help text, optional hint, icons/addons and error message.
 */
const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      errorMessage,
      helpText,
      optional,
      containerStyle,
      labelStyle,
      inputStyle,
      icon,
      leftAddon,
      rightAddon,
      placeholder,
      onFocus,
      onBlur,
      editable = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const showError = Boolean(errorMessage) || Boolean(error);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <View style={[defaultStyles.container, containerStyle]}>
        <View style={defaultStyles.labelContainer}>
          <Text style={[defaultStyles.label, labelStyle]}>
            {label}
            {optional && <Text style={defaultStyles.optional}> (valgfritt)</Text>}
          </Text>
        </View>

        {helpText ? <Text style={defaultStyles.help}>{helpText}</Text> : null}

        <View
          style={[
            defaultStyles.control,
            isFocused && defaultStyles.controlFocused,
            showError && defaultStyles.controlError,
            !editable && defaultStyles.controlDisabled,
          ]}>
          {icon || leftAddon ? <View style={defaultStyles.left}>{icon ?? leftAddon}</View> : null}

          <TextInput
            ref={ref}
            testID="input"
            style={[defaultStyles.input, inputStyle]}
            placeholder={isFocused ? '' : placeholder}
            placeholderTextColor={colors.secondary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={editable}
            {...props}
          />

          {rightAddon ? <View style={defaultStyles.right}>{rightAddon}</View> : null}
        </View>

        {showError && errorMessage ? <Text style={defaultStyles.errorMessage}>{errorMessage}</Text> : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;
