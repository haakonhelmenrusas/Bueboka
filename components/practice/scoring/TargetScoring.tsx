import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons/faRotateLeft';
import { useTranslation } from '@/contexts';
import { TargetFace } from './TargetFace';
import { styles } from './TargetScoringStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TARGET_SIZE = Math.min(SCREEN_WIDTH - 48, 340);

interface ArrowPosition {
  x: number;
  y: number;
  score: number;
}

interface TargetScoringProps {
  onScorePress: (score: number) => void;
  onUndoLast: () => void;
  disabled?: boolean;
  editingIdx: number | null;
  targetType?: string;
}

function calculateScore(x: number, y: number): number {
  const center = TARGET_SIZE / 2;
  const dx = x - center;
  const dy = y - center;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const unit = TARGET_SIZE / 22;
  const score = Math.max(0, 11 - Math.ceil(distance / unit));
  return Math.min(score, 10);
}

function getArrowColor(score: number): string {
  if (score >= 9) return '#F5C542';
  if (score >= 7) return '#E74C3C';
  if (score >= 5) return '#3DA9D4';
  if (score >= 3) return '#1a1a1a';
  if (score >= 1) return '#FFFFFF';
  return '#999';
}

export function TargetScoring({ onScorePress, onUndoLast, disabled, editingIdx, targetType }: TargetScoringProps) {
  const { t } = useTranslation();
  const [arrows, setArrows] = useState<ArrowPosition[]>([]);
  const arrowsRef = useRef<ArrowPosition[]>([]);

  const scale = useSharedValue(1);
  const focusX = useSharedValue(TARGET_SIZE / 2);
  const focusY = useSharedValue(TARGET_SIZE / 2);
  const isZoomed = useSharedValue(false);

  const handlePlaceArrow = useCallback(
    (x: number, y: number) => {
      if (disabled && editingIdx === null) return;
      const score = calculateScore(x, y);
      const arrow: ArrowPosition = { x, y, score };

      if (editingIdx !== null) {
        const updated = [...arrowsRef.current];
        if (editingIdx < updated.length) {
          updated[editingIdx] = arrow;
        }
        arrowsRef.current = updated;
        setArrows(updated);
      } else {
        const updated = [...arrowsRef.current, arrow];
        arrowsRef.current = updated;
        setArrows(updated);
      }

      onScorePress(score);
    },
    [onScorePress, disabled, editingIdx],
  );

  const handleUndo = useCallback(() => {
    if (arrowsRef.current.length === 0) return;
    const updated = arrowsRef.current.slice(0, -1);
    arrowsRef.current = updated;
    setArrows(updated);
    onUndoLast();
  }, [onUndoLast]);

  const ZOOM_SCALE = 2.5;

  const pan = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((event) => {
      'worklet';
      isZoomed.value = true;
      focusX.value = event.x;
      focusY.value = event.y;
      scale.value = withSpring(ZOOM_SCALE, { damping: 15, stiffness: 150 });
    })
    .onUpdate((event) => {
      'worklet';
      focusX.value = event.x;
      focusY.value = event.y;
    })
    .onEnd((event) => {
      'worklet';
      runOnJS(handlePlaceArrow)(event.x, event.y);
    })
    .onFinalize(() => {
      'worklet';
      isZoomed.value = false;
      scale.value = withTiming(1, { duration: 200 });
      focusX.value = withTiming(TARGET_SIZE / 2, { duration: 200 });
      focusY.value = withTiming(TARGET_SIZE / 2, { duration: 200 });
    });

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => {
      handlePlaceArrow(event.x, event.y);
    });

  const gesture = Gesture.Exclusive(pan, tap);

  const animatedTargetStyle = useAnimatedStyle(() => {
    const s = scale.value;
    const tx = TARGET_SIZE / 2 - focusX.value * s;
    const ty = TARGET_SIZE / 2 - focusY.value * s;
    return {
      transform: [{ translateX: tx }, { translateY: ty }, { scale: s }],
    };
  });

  const previewStyle = useAnimatedStyle(() => ({
    opacity: isZoomed.value ? 1 : 0,
    left: focusX.value - 6,
    top: focusY.value - 6,
  }));

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <View style={[styles.targetWrapper, { width: TARGET_SIZE, height: TARGET_SIZE }]}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.targetContent, { width: TARGET_SIZE, height: TARGET_SIZE }, animatedTargetStyle]}>
              <TargetFace size={TARGET_SIZE} targetType={targetType} />
              {arrows.map((arrow, index) => (
                <View
                  key={index}
                  style={[
                    styles.arrowHit,
                    {
                      left: arrow.x - 5,
                      top: arrow.y - 5,
                      backgroundColor: getArrowColor(arrow.score),
                    },
                    editingIdx === index && styles.arrowHitEditing,
                  ]}
                />
              ))}
              <Animated.View style={[styles.previewDot, previewStyle]} />
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>

      <Text style={styles.hint}>{t['scoring.targetHint']}</Text>

      {arrows.length > 0 && (
        <View style={styles.undoRow}>
          <Pressable style={styles.undoButton} onPress={handleUndo}>
            <FontAwesomeIcon icon={faRotateLeft} size={14} color="#DD0000" />
            <Text style={styles.undoText}>{t['scoring.undoLast']}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
