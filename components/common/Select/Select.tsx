import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable, StyleProp, ViewStyle,
} from 'react-native';
import styles from './SelectStyles';

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  options: Option[];
  selectedValue?: string;
  onValueChange: (value: any) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export const Select: React.FC<Props> = ({ label, options, selectedValue, onValueChange, containerStyle }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<View>(null);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || 'Velg et alternativ';

  const handleSelect = (value: string) => {
    onValueChange(value);
    setOpen(false);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setOpen((prev) => !prev)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectText}>{selectedLabel}</Text>
      </TouchableOpacity>
      {open && (
        <>
          <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
          <View ref={dropdownRef} style={styles.dropdown}>
            <ScrollView nestedScrollEnabled style={styles.scrollList}>
              {options.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.option}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};
