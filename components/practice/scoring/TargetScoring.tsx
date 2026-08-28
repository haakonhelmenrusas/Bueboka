import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons/faRotateLeft';
import { useTranslation } from '@/contexts';
import { Button } from '@/components/common';
import { TargetFace } from './TargetFace';
import { clampToTarget, maturePosition, scoreAt, screenToTarget, SLIP_WINDOW_MS, TimedPosition } from './targetGeometry';
import { styles } from './TargetScoringStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TARGET_SIZE = Math.min(SCREEN_WIDTH - 48, 340);
const ZOOM_SCALE = 2.5;
const FINGER_OFFSET = 30;
const CROSSHAIR_SIZE = 30;
const LONG_PRESS_MS = 200;

/**
 * Position samples kept per gesture. At 60fps this covers ~330ms, comfortably
 * more than the slip window needs while keeping the per-frame copy cheap.
 */
const MAX_POSITION_HISTORY = 20;

interface ArrowPosition {
  x: number;
  y: number;
  score: number;
}

interface TargetScoringProps {
  onScorePress: (score: number) => void;
  onUndoLast: () => void;
  disabled?: boolean;
  /** Index of the arrow being edited within the current end, or null when adding. */
  editingIdx: number | null;
  targetType?: string;
  endComplete?: boolean;
  onNext?: () => void;
  /** Changes whenever a different end is shown; clears the arrows drawn on the face. */
  endKey?: string;
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
  endKey,
}: TargetScoringProps) {
  const { t } = useTranslation();
  const [arrows, setArrows] = useState<ArrowPosition[]>([]);
  const arrowsRef = useRef<ArrowPosition[]>([]);

  // Zoom and focus state. focusX/focusY are the point in target coordinates
  // (0..TARGET_SIZE) currently sitting under the crosshair.
  const scale = useSharedValue(1);
  const focusX = useSharedValue(TARGET_SIZE / 2);
  const focusY = useSharedValue(TARGET_SIZE / 2);
  const isZoomed = useSharedValue(false);
  const keepZoomActive = useSharedValue(endComplete);

  // Where the finger first landed, in wrapper coordinates, and the focus point
  // it mapped to, so drag deltas can be applied from a fixed origin.
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startFocusX = useSharedValue(0);
  const startFocusY = useSharedValue(0);

  // Slip-detection samples. Held in a shared value so the gesture worklets can
  // both write and read them on the UI thread; a React ref would only ever be
  // visible to the JS thread and the worklet would read a stale snapshot.
  const positionHistory = useSharedValue<TimedPosition[]>([]);

  // Arrows are drawn per end, so a different end starts from an empty face.
  useEffect(() => {
    arrowsRef.current = [];
    setArrows([]);
  }, [endKey]);

  useEffect(() => {
    keepZoomActive.value = endComplete;
  }, [endComplete, keepZoomActive]);

  const handlePlaceArrow = useCallback(
    (x: number, y: number) => {
      if (disabled && editingIdx === null) return;

      const arrow: ArrowPosition = { x, y, score: scoreAt(x, y, TARGET_SIZE, targetType) };

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

      onScorePress(arrow.score);
    },
    [onScorePress, disabled, editingIdx, targetType],
  );

  const handleUndo = useCallback(() => {
    if (arrowsRef.current.length === 0) return;
    const updated = arrowsRef.current.slice(0, -1);
    arrowsRef.current = updated;
    setArrows(updated);
    onUndoLast();
  }, [onUndoLast]);

  const resetZoom = useCallback(() => {
    'worklet';
    isZoomed.value = false;
    scale.value = withTiming(1, { duration: 200 });
    focusX.value = withTiming(TARGET_SIZE / 2, { duration: 200 });
    focusY.value = withTiming(TARGET_SIZE / 2, { duration: 200 });
  }, [isZoomed, scale, focusX, focusY]);

  /** Current view transform, for mapping a touch back into target coordinates. */
  const currentView = useCallback(() => {
    'worklet';
    const s = scale.value;
    const zoomProgress = Math.min(1, Math.max(0, (s - 1) / (ZOOM_SCALE - 1)));
    return {
      scale: s,
      focusX: focusX.value,
      focusY: focusY.value,
      offset: FINGER_OFFSET * zoomProgress,
      size: TARGET_SIZE,
    };
  }, [scale, focusX, focusY]);

  // Long-press to zoom, then drag to fine-tune. The crosshair starts on the
  // point that was pressed, so releasing without dragging places the arrow there.
  const pan = Gesture.Pan()
    .activateAfterLongPress(LONG_PRESS_MS)
    .onStart((event) => {
      'worklet';
      const touch = screenToTarget(event.x, event.y, currentView());
      const targetX = clampToTarget(touch.x, TARGET_SIZE);
      const targetY = clampToTarget(touch.y, TARGET_SIZE);

      startX.value = event.x;
      startY.value = event.y;
      startFocusX.value = targetX;
      startFocusY.value = targetY;

      focusX.value = targetX;
      focusY.value = targetY;

      positionHistory.value = [{ x: targetX, y: targetY, time: Date.now() }];

      isZoomed.value = true;
      scale.value = withSpring(ZOOM_SCALE, { damping: 15, stiffness: 150 });
    })
    .onUpdate((event) => {
      'worklet';
      // Finger travel is divided by the zoom so a screen pixel moves the
      // crosshair by less than a pixel on the face, which is what makes the
      // zoomed view worth having.
      const dx = event.x - startX.value;
      const dy = event.y - startY.value;

      const nextX = clampToTarget(startFocusX.value + dx / ZOOM_SCALE, TARGET_SIZE);
      const nextY = clampToTarget(startFocusY.value + dy / ZOOM_SCALE, TARGET_SIZE);

      focusX.value = nextX;
      focusY.value = nextY;

      const history = positionHistory.value;
      const next = [...history, { x: nextX, y: nextY, time: Date.now() }];
      positionHistory.value = next.length > MAX_POSITION_HISTORY ? next.slice(next.length - MAX_POSITION_HISTORY) : next;
    })
    .onEnd(() => {
      'worklet';
      const placement = maturePosition(positionHistory.value, Date.now(), SLIP_WINDOW_MS);
      if (placement) {
        runOnJS(handlePlaceArrow)(placement.x, placement.y);
      }
    })
    .onFinalize(() => {
      'worklet';
      positionHistory.value = [];
      if (!keepZoomActive.value) {
        resetZoom();
      }
    });

  // A quick tap places an arrow without zooming.
  const tap = Gesture.Tap()
    .maxDuration(LONG_PRESS_MS)
    .onEnd((event) => {
      'worklet';
      const touch = screenToTarget(event.x, event.y, currentView());
      runOnJS(handlePlaceArrow)(clampToTarget(touch.x, TARGET_SIZE), clampToTarget(touch.y, TARGET_SIZE));
    });

  const gesture = Gesture.Exclusive(pan, tap);

  const animatedTargetStyle = useAnimatedStyle(() => {
    const view = currentView();
    return {
      transform: [
        { translateX: TARGET_SIZE / 2 - view.focusX * view.scale },
        { translateY: TARGET_SIZE / 2 - view.offset - view.focusY * view.scale },
        { scale: view.scale },
      ],
    };
  });

  // The crosshair is fixed at the centre of the wrapper, lifted clear of the
  // fingertip; the face moves underneath it.
  const crosshairStyle = useAnimatedStyle(() => {
    const zoomProgress = Math.min(1, Math.max(0, (scale.value - 1) / (ZOOM_SCALE - 1)));
    const offset = FINGER_OFFSET * zoomProgress;
    return {
      opacity: isZoomed.value || keepZoomActive.value ? 1 : 0,
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
          <Animated.View style={[styles.crosshair, { width: CROSSHAIR_SIZE, height: CROSSHAIR_SIZE }, crosshairStyle]} pointerEvents="none">
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
              resetZoom();
              onNext?.();
            }}
            buttonStyle={{ width: '100%' }}
          />
        </View>
      )}
    </View>
  );
}
