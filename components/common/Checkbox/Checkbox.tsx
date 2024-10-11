// this component is a checkbox that can be checked or unchecked built with react native

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export default function Checkbox({ label, checked, onPress }: CheckboxProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Feather name={checked ? 'check-square' : 'square'} size={24} color={checked ? '#007AFF' : '#000'} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
  },
});
