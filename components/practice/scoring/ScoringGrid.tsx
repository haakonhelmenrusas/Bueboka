import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
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
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => {
      onAddHit({ x: event.x, y: event.y });
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={tap}>
        <View style={styles.targetWrapper}>
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
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  targetWrapper: {
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
  },
});
