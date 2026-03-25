import React, { useState } from 'react';
import { Platform, StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { defaultStyles } from './TextareaStyles';
import { colors } from '@/styles/colors';

interface TextareaProps extends TextInputProps {
  label: string;
  info?: string;
  optional?: boolean;
  helpText?: string;
  /** Legacy convenience prop – maps to the native placeholder prop */
  placeholderText?: string;
  error?: boolean;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

const Textarea = React.forwardRef<TextInput, TextareaProps>(
  (
    {
      label,
      info,
      optional,
      helpText,
      placeholderText,
      error,
      errorMessage,
      containerStyle,
      labelStyle,
      inputStyle,
      icon,
      placeholder,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // placeholderText takes precedence; fall back to native placeholder prop
    const resolvedPlaceholder = placeholderText ?? placeholder;

    return (
      <View
        style={[defaultStyles.container, containerStyle]}
        accessibilityLabel={Platform.OS === 'android' ? label : `${label}${': Disabled!'}`}>
        <View style={defaultStyles.labelContainer}>
          {icon && <View style={defaultStyles.icon}>{icon}</View>}
          <Text style={[defaultStyles.label, labelStyle]}>
            {label}
            {optional && <Text style={defaultStyles.optional}> (valgfritt)</Text>}
          </Text>
          {info ? <Text style={defaultStyles.infoText}>{info}</Text> : null}
        </View>

        {helpText ? <Text style={defaultStyles.help}>{helpText}</Text> : null}

        <TextInput
          ref={ref}
          testID="textarea"
          style={[defaultStyles.textarea, isFocused && defaultStyles.textareaFocused, inputStyle]}
          placeholder={isFocused ? '' : resolvedPlaceholder}
          placeholderTextColor={colors.secondary}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {error && errorMessage ? <Text style={defaultStyles.errorMessage}>{errorMessage}</Text> : null}
      </View>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
