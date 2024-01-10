import React from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

const isAndroid = Platform.OS === 'android';
const editableTextInputColor = '#494949';

interface InputProps extends TextInputProps {
  label: string;
  error: boolean;
  errorMessage?: string;
  placeholderText?: string;
}

const Input = ({ label, error, errorMessage, placeholderText, ...props }: InputProps) => {
  const textInputColor = editableTextInputColor;

  const styles = StyleSheet.create({
    container: { marginBottom: 16, height: 54, marginRight: 8, width: '100%' },
    label: { color: textInputColor, fontWeight: '500', fontSize: 16, marginBottom: 4 },
    input: {
      backgroundColor: '#FFF',
      paddingHorizontal: 12,
      height: 48,
      width: '100%',
      borderColor: textInputColor,
      borderWidth: 1,
      borderRadius: 12,
    },
  });

  return (
    <View style={styles.container} accessibilityLabel={isAndroid ? label : `${label}${': Disabled!'}`}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        testID="input"
        style={styles.input}
        placeholder={placeholderText}
        placeholderTextColor={textInputColor}
        {...props}
      />
      {error && <Text style={{ color: 'red', fontSize: 13 }}>{errorMessage}</Text>}
    </View>
  );
};

export default Input;
