import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons/faRotateLeft';
import { useTranslation } from '@/contexts';
import { Button } from '@/components/common';
import { TargetFace } from './TargetFace';
import { styles } from './TargetScoringStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TARGET_SIZE = Math.min(SCREEN_WIDTH - 48, 340);
const ZOOM_SCALE = 2.5;
const FINGER_OFFSET = 30;
const CROSSHAIR_SIZE = 30;

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
  endComplete?: boolean;
  onNext?: () => void;
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

export function TargetScoring({
  onScorePress,
  onUndoLast,
  disabled,
  editingIdx,
  targetType,
  endComplete = false,
  onNext,
}: TargetScoringProps) {
  const { t } = useTranslation();
  const [arrows, setArrows] = useState<ArrowPosition[]>([]);
  const arrowsRef = useRef<ArrowPosition[]>([]);

  // Zoom and position state
  // focusX and focusY represent the point in the target coordinate system (0-TARGET_SIZE)
  // that is currently at the center of the screen when zoomed
  const scale = useSharedValue(1);
  const focusX = useSharedValue(TARGET_SIZE / 2);
  const focusY = useSharedValue(TARGET_SIZE / 2);
  const isZoomed = useSharedValue(false);
  const keepZoomActive = useSharedValue(endComplete);

  // Track the starting touch position for drag calculations
  // startX/Y are in screen coordinates (relative to target wrapper)
  // startFocusX/Y are in target coordinates
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startFocusX = useSharedValue(0);
  const startFocusY = useSharedValue(0);

  // Update keepZoomActive when endComplete prop changes
  useEffect(() => {
    keepZoomActive.value = endComplete;
  }, [endComplete, keepZoomActive]);

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

  // Pan gesture for zoom and placement
  // Long press to activate, then drag to position the crosshair
  const pan = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((event) => {
      'worklet';
      // Store the starting positions
      // event.x/y are where the finger touched (in target wrapper coordinates)
      startX.value = event.x;
      startY.value = event.y;
      // Store the current focus point (in target coordinates)
      startFocusX.value = focusX.value;
      startFocusY.value = focusY.value;

      // Zoom in
      isZoomed.value = true;
      scale.value = withSpring(ZOOM_SCALE, { damping: 15, stiffness: 150 });
    })
    .onUpdate((event) => {
      'worklet';
      // Calculate how much the finger has moved in screen coordinates
      const dx = event.x - startX.value;
      const dy = event.y - startY.value;

      // Update focus position based on drag
      // We divide by ZOOM_SCALE because the target is zoomed in,
      // so finger movement translates to smaller movement in target coordinates
      focusX.value = Math.max(0, Math.min(TARGET_SIZE, startFocusX.value + dx / ZOOM_SCALE));
      focusY.value = Math.max(0, Math.min(TARGET_SIZE, startFocusY.value + dy / ZOOM_SCALE));
    })
    .onEnd(() => {
      'worklet';
      // When finger is lifted, place the arrow at the current focus position
      // focusX and focusY are in target coordinates (0-TARGET_SIZE)
      // This is exactly where the crosshair is pointing
      runOnJS(handlePlaceArrow)(focusX.value, focusY.value);
    })
    .onFinalize(() => {
      'worklet';
      if (!keepZoomActive.value) {
        // Reset zoom if not keeping it active (when endComplete is false)
        isZoomed.value = false;
        scale.value = withTiming(1, { duration: 200 });
        focusX.value = withTiming(TARGET_SIZE / 2, { duration: 200 });
        focusY.value = withTiming(TARGET_SIZE / 2, { duration: 200 });
      }
    });

  // Tap gesture for quick placement without zoom
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => {
      // For quick taps, place arrow directly at tap position
      handlePlaceArrow(event.x, event.y);
    });

  const gesture = Gesture.Exclusive(pan, tap);

  // Animated style for the target during zoom
  const animatedTargetStyle = useAnimatedStyle(() => {
    const s = scale.value;
    const zoomProgress = Math.min(1, Math.max(0, (s - 1) / (ZOOM_SCALE - 1)));
    const offset = FINGER_OFFSET * zoomProgress;

    // Calculate translation to center the zoom on the focus point
    // When zoomed in, we want the focus point to be at the center of the screen
    const tx = TARGET_SIZE / 2 - focusX.value * s;
    const ty = TARGET_SIZE / 2 - offset - focusY.value * s;

    return {
      transform: [{ translateX: tx }, { translateY: ty }, { scale: s }],
    };
  });

  // Animated style for crosshair
  // Crosshair is always at the center when visible
  const crosshairStyle = useAnimatedStyle(() => {
    const zoomProgress = Math.min(1, Math.max(0, (scale.value - 1) / (ZOOM_SCALE - 1)));
    const offset = FINGER_OFFSET * zoomProgress;
    return {
      opacity: (isZoomed.value || keepZoomActive.value) ? 1 : 0,
      top: TARGET_SIZE / 2 - offset - CROSSHAIR_SIZE / 2,
      left: TARGET_SIZE / 2 - CROSSHAIR_SIZE / 2,
    };
  });

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
            </Animated.View>
          </GestureDetector>
          {/* Crosshair shows where the arrow will be placed (center of screen when zoomed) */}
          <Animated.View
            style={[
              styles.crosshair,
              {
                width: CROSSHAIR_SIZE,
                height: CROSSHAIR_SIZE,
              },
              crosshairStyle,
            ]}
            pointerEvents="none">
            <View style={styles.crosshairShadowH} />
            <View style={styles.crosshairShadowV} />
            <View style={styles.crosshairLineH} />
            <View style={styles.crosshairLineV} />
            <View style={styles.crosshairDot} />
          </Animated.View>
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

      {endComplete && (
        <View style={styles.nextRow}>
          <Button
            label={t['scoring.nextEnd']}
            onPress={() => {
              keepZoomActive.value = false;
              isZoomed.value = false;
              scale.value = withTiming(1, { duration: 200 });
              focusX.value = withTiming(TARGET_SIZE / 2, { duration: 200 });
              focusY.value = withTiming(TARGET_SIZE / 2, { duration: 200 });
              onNext?.();
            }}
            buttonStyle={{ width: '100%' }}
          />
        </View>
      )}
    </View>
  );
}
