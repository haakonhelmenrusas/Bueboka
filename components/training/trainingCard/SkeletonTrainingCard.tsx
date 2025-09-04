import React from 'react';
import { Animated, Easing, View } from 'react-native';
import { styles } from './SkeletonTrainingCardStyles';

export default function SkeletonTrainingCard() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ).start();
    };
    startAnimation();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <View style={styles.trainingCard}>
      <View>
        <Animated.View style={[styles.dateSkeleton, { opacity }]} />
        <Animated.View style={[styles.arrowCountSkeleton, { opacity }]} />
      </View>
      <Animated.View style={[styles.iconSkeleton, { opacity }]} />
    </View>
  );
}
