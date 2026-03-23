import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { TargetFace } from './TargetFace';

const { width } = Dimensions.get('window');
const TARGET_SIZE = width - 40;

export interface ArrowHit {
  x: number;
  y: number;
}

interface ScoringGridProps {
  hits: ArrowHit[];
  onAddHit: (hit: ArrowHit) => void;
}

export const ScoringGrid: React.FC<ScoringGridProps> = ({ hits, onAddHit }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const isZoomed = useSharedValue(false);

  const pan = Gesture.Pan()
    .activateAfterLongPress(100)
    .onStart((event) => {
      isZoomed.value = true;
      touchX.value = event.x;
      touchY.value = event.y;
      
      // Set initial translation immediately without animation to prevent jumping
      translateX.value = TARGET_SIZE / 2 - event.x;
      translateY.value = TARGET_SIZE / 2 - event.y;
      
      // Then animate scale
      scale.value = withSpring(2.5, { damping: 15, stiffness: 150 });
    })
    .onUpdate((event) => {
      touchX.value = event.x;
      touchY.value = event.y;
      translateX.value = TARGET_SIZE / 2 - event.x;
      translateY.value = TARGET_SIZE / 2 - event.y;
    })
    .onEnd((event) => {
      runOnJS(onAddHit)({ x: event.x, y: event.y });
    })
    .onFinalize(() => {
      isZoomed.value = false;
      scale.value = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => {
      onAddHit({ x: event.x, y: event.y });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const combinedGesture = Gesture.Exclusive(tap, pan);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.targetWrapper}>
        <GestureDetector gesture={combinedGesture}>
          <Animated.View style={[styles.targetContent, animatedStyle]}>
            <TargetFace size={TARGET_SIZE} />
            {hits.map((hit, index) => (
              <View
                key={index}
                style={[
                  styles.arrowHit,
                  {
                    left: hit.x - 4,
                    top: hit.y - 4,
                  },
                ]}
              />
            ))}
            <Animated.View 
              style={[
                styles.previewHit,
                useAnimatedStyle(() => ({
                  opacity: isZoomed.value ? 1 : 0,
                  left: touchX.value - 5,
                  top: touchY.value - 5,
                  transform: [
                    { scale: 1.5 }
                  ]
                }))
              ]} 
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  targetWrapper: {
    width: TARGET_SIZE,
    height: TARGET_SIZE,
    overflow: 'hidden',
    borderRadius: TARGET_SIZE / 2,
    backgroundColor: '#ddd',
  },
  targetContent: {
    width: TARGET_SIZE,
    height: TARGET_SIZE,
    position: 'relative',
  },
  arrowHit: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'white',
    zIndex: 10,
  },
  previewHit: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 20,
  },
});
