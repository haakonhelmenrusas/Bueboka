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

// Finger slip detection constants
const SLIP_TIME_WINDOW_MS = 100; // Ignore last 100ms of movement (finger slip)
const MAX_POSITION_HISTORY = 50; // Maximum number of positions to track

interface TimedPosition {
  x: number;
  y: number;
  time: number;
}

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

/**
 * Gets the mature position from the history, ignoring the last 100ms of movement (finger slip).
 * This prevents arrows from being placed at the slipped position when the user lifts their finger.
 * Note: This is designed to be called from a worklet, so it uses the last timestamp in history as reference.
 */
function getMaturePosition(history: TimedPosition[]): { x: number; y: number } | null {
  if (history.length === 0) {
    return null;
  }

  // Use the last recorded time as reference (when finger was lifted)
  const lastTime = history[history.length - 1].time;
  const cutoff = lastTime - SLIP_TIME_WINDOW_MS;

  // Find the most recent position that is at least 100ms old
  // This gives us the stable position before the slip started
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].time <= cutoff) {
      return { x: history[i].x, y: history[i].y };
    }
  }

  // If all positions are within the 100ms window (very quick tap),
  // return the first position which is the most stable
  if (history.length > 0) {
    return { x: history[0].x, y: history[0].y };
  }

  return null;
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

  // Finger slip detection: track position history during drag
  // This allows us to use the "mature" position (before slip) when placing the arrow
  const positionHistoryRef = useRef<TimedPosition[]>([]);

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

  // Helper to record position with timestamp (called from JS side)
  const recordPosition = useCallback((x: number, y: number) => {
    const now = Date.now();
    positionHistoryRef.current.push({ x, y, time: now });
    if (positionHistoryRef.current.length > MAX_POSITION_HISTORY) {
      positionHistoryRef.current.shift();
    }
  }, []);

  // Pan gesture for zoom and placement
  // Long press to activate, then drag to position the crosshair
  // Uses finger slip detection to place arrow at the stable position (before slip)
  const pan = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((event) => {
      'worklet';
      // Clear previous position history for new gesture
      runOnJS(() => {
        positionHistoryRef.current = [];
      })();
      
      // Store the starting positions
      // event.x/y are where the finger touched (in target wrapper coordinates)
      startX.value = event.x;
      startY.value = event.y;
      // Store the current focus point (in target coordinates)
      startFocusX.value = focusX.value;
      startFocusY.value = focusY.value;

      // Record initial position
      runOnJS(recordPosition)(focusX.value, focusY.value);

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

      // Record position for slip detection on JS thread
      runOnJS(recordPosition)(focusX.value, focusY.value);
    })
    .onEnd(() => {
      'worklet';
      // When finger is lifted, use the mature position (before slip) for placement
      // This prevents the arrow from being placed at the slipped position
      const maturePos = getMaturePosition(positionHistoryRef.current);
      if (maturePos) {
        runOnJS(handlePlaceArrow)(maturePos.x, maturePos.y);
      } else {
        // Fallback: use current focus position if no mature position available
        runOnJS(handlePlaceArrow)(focusX.value, focusY.value);
      }
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
      // Clear history since this is a new gesture
      positionHistoryRef.current = [];
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
