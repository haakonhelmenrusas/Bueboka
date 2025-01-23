import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './CheckboxStyles';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export default function Checkbox({ label, checked, onPress }: Readonly<CheckboxProps>) {
  return (
    <TouchableOpacity onPress={onPress} testID="TouchableOpacity">
      <View style={styles.container}>
        <Feather
          name={checked ? 'check-square' : 'square'}
          size={24}
          color={checked ? '#007AFF' : '#000'}
          testID={checked ? 'Feather__check-square' : 'Feather__square'}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
