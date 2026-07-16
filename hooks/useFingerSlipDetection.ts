import { useRef, useCallback } from 'react';

interface TimedPoint {
  x: number;
  y: number;
  time: number;
}

const TIME_WINDOW_MS = 100; // Ignore last 100ms of movement (slip)
const MAX_HISTORY = 50; // Maximum number of points to keep in history

export interface FingerPosition {
  x: number;
  y: number;
}

export function useFingerSlipDetection() {
  const historyRef = useRef<TimedPoint[]>([]);

  const addPoint = useCallback((x: number, y: number) => {
    const now = Date.now();
    
    // Add new point to history
    historyRef.current.push({ x, y, time: now });
    
    // Keep history size reasonable
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    }
  }, []);

  const getFinalPosition = useCallback((): FingerPosition | null => {
    const now = Date.now();
    const cutoff = now - TIME_WINDOW_MS;
    
    // Find the most recent point that is at least 100ms old
    // This gives us the position from before the slip started
    for (let i = historyRef.current.length - 1; i >= 0; i--) {
      if (historyRef.current[i].time <= cutoff) {
        return {
          x: historyRef.current[i].x,
          y: historyRef.current[i].y,
        };
      }
    }
    
    // If all points are within the 100ms window, return the first one
    // (this happens with very quick taps)
    if (historyRef.current.length > 0) {
      return {
        x: historyRef.current[0].x,
        y: historyRef.current[0].y,
      };
    }
    
    return null;
  }, []);

  const reset = useCallback(() => {
    historyRef.current = [];
  }, []);

  return {
    addPoint,
    getFinalPosition,
    reset,
  };
}
