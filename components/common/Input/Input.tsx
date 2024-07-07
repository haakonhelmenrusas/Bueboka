import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
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
  const defaultStyles = StyleSheet.create({
    container: { marginBottom: 16, height: 40 },
    labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
    label: { color: '#053546', fontWeight: '500', fontSize: 14 },
    input: {
      backgroundColor: '#FFF',
      paddingHorizontal: 12,
      height: 40,
      width: '100%',
      borderColor: '#053546',
      borderWidth: 1,
      borderRadius: 8,
    },
    icon: { marginRight: 8 },
  });

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
