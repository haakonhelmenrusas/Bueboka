import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  StyleProp,
  ViewStyle, Platform,
} from 'react-native';
import styles from './SelectStyles';
import { colors } from '@/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';

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
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    setOpen((prev) => !prev);

    Animated.timing(rotateAnim, {
      toValue: open ? 0 : 1,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (value: string) => {
    onValueChange(value);
    setOpen(false);
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || 'Velg et alternativ';

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectBox} onPress={toggleDropdown} activeOpacity={0.7}>
        <Text style={styles.selectText}>{selectedLabel}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <FontAwesomeIcon icon={faChevronDown} size={20} color={colors.primary} />
        </Animated.View>
      </TouchableOpacity>
      {open && (
        <>
          <Pressable style={styles.overlay} onPress={toggleDropdown} />
          <View style={styles.dropdown}>
              <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.optionsContainer}>
                  {options.map((item) => (
                    <Pressable
                      key={item.value}
                      style={[
                        styles.option,
                        item.value === selectedValue && { backgroundColor: colors.background }
                      ]}
                      onPress={() => handleSelect(item.value)}
                      android_ripple={{ color: colors.tertiary }}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                      {item.value === selectedValue && (
                        <FontAwesomeIcon icon={faCheck} size={16} color={colors.primary} />
                      )}
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
          </View>
          </>
      )}
    </View>
  );
};
