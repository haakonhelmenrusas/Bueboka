import React from 'react';
import { AccessibilityRole, AccessibilityState, Pressable, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { colors } from '@/styles/colors';
import { styles } from './CheckboxStyles';

interface CheckboxProps {
  value: boolean;
  onChange: (newValue: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Checkbox({ value, onChange, label, disabled }: CheckboxProps) {
  const accessibilityState: AccessibilityState = {
    checked: value,
    disabled,
  };

  return (
    <Pressable
      style={[styles.wrapper, disabled && { opacity: 0.5 }]}
      onPress={() => !disabled && onChange(!value)}
      accessibilityRole={'checkbox' as AccessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={label || 'Checkbox'}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <FontAwesomeIcon icon={faCheck} size={14} color={colors.white} />}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : <View />}
    </Pressable>
  );
}
