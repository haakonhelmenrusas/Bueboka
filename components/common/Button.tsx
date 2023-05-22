import React from 'react';
import { FlexStyle, Pressable, StyleProp, StyleSheet, Text } from 'react-native';

interface Props {
  label?: string;
  type?: 'filled' | 'outlined';
  style?: StyleProp<FlexStyle>;
  disabled?: boolean;

  onPress(): void;
}

export default function Button(props: Props) {
  const { onPress, label, style, type, disabled } = props;

  function getStyles() {
    switch (type) {
      case 'filled':
        return styles.filled;
      case 'outlined':
        return styles.outlined;
      default:
        return styles.button;
    }
  }

  function getTextStyles() {
    switch (type) {
      case 'filled':
        return styles.textFilled;
      case 'outlined':
        return styles.textOutlined;
      default:
        return styles.text;
    }
  }

  return (
    <Pressable disabled={disabled} style={[style, styles.button, getStyles()]} onPress={onPress}>
      <Text style={[styles.text, getTextStyles()]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  filled: {
    backgroundColor: 'darkblue',
  },
  outlined: {
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  textFilled: {
    color: 'white',
  },
  textOutlined: {
    color: 'darkblue',
  },
});
