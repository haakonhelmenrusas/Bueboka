import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

const isAndroid = Platform.OS === 'android';

interface InputProps extends TextInputProps {
  label: string;
  error?: boolean;
  errorMessage?: string;
  placeholderText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const Input = ({
  label,
  error,
  errorMessage,
  placeholderText,
  containerStyle,
  labelStyle,
  inputStyle,
  ...props
}: InputProps) => {
  const defaultStyles = StyleSheet.create({
    container: { marginBottom: 16, height: 40, marginRight: 8 },
    label: { color: '#053546', fontWeight: '500', fontSize: 14, marginBottom: 4 },
    input: {
      backgroundColor: '#FFF',
      paddingHorizontal: 12,
      height: 40,
      width: '100%',
      borderColor: '#053546',
      borderWidth: 1,
      borderRadius: 8,
    },
  });

  return (
    <View
      style={[defaultStyles.container, containerStyle]}
      accessibilityLabel={isAndroid ? label : `${label}${': Disabled!'}`}>
      <Text style={[defaultStyles.label, labelStyle]}>{label}</Text>
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
