import React, { useEffect, useRef } from 'react';
import { AccessibilityRole, AccessibilityState, Animated, Text, TouchableWithoutFeedback, View } from 'react-native';
import { styles } from './ToggleStyles';
import { colors } from '@/styles/colors';

interface ToggleProps {
  value: boolean;
  onToggle: (newValue: boolean) => void;
  label?: string;
}

export default function Toggle({ value, onToggle, label }: ToggleProps) {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: value ? 1 : 0,
      friction: 8,
      tension: 120,
      useNativeDriver: false,
    }).start();
  }, [animation, value]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 16],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.dimmed, colors.primary],
  });

  const handleToggle = () => {
    onToggle(!value);
  };

  const accessibilityState: AccessibilityState = {
    checked: value,
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableWithoutFeedback
        onPress={handleToggle}
        accessible
        accessibilityRole={'switch' as AccessibilityRole}
        accessibilityState={accessibilityState}
        accessibilityLabel={label || 'Toggle'}>
        <Animated.View style={[styles.track, { backgroundColor }]}>
          <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}
