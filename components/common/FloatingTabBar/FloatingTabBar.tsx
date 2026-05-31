import { useCallback, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { styles } from './FloatingTabBarStyles';

function TabButton({ onPress, children, isFocused }: { onPress: () => void; children: React.ReactNode; isFocused: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.85, useNativeDriver: true }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={styles.tab}>
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </Pressable>
  );
}

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { bottom: insets.bottom + 16 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        if ((options as any).href === null) return null;

        const isFocused = state.index === index;
        const icon = options.tabBarIcon?.({ focused: isFocused, color: '', size: 24 });

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabButton key={route.key} onPress={onPress} isFocused={isFocused}>
            {icon}
          </TabButton>
        );
      })}
    </View>
  );
}

