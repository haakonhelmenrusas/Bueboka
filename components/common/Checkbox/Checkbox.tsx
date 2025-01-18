import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

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
