import { renderHook, act } from '@testing-library/react-native';
import { useFingerSlipDetection } from '../useFingerSlipDetection';

describe('useFingerSlipDetection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with null final position', () => {
    const { result } = renderHook(() => useFingerSlipDetection());

    expect(result.current.getFinalPosition()).toBeNull();
  });

  it('should track a single point', () => {
    const { result } = renderHook(() => useFingerSlipDetection());

    act(() => {
      result.current.addPoint(10, 20);
    });

    const finalPos = result.current.getFinalPosition();
    expect(finalPos).toEqual({ x: 10, y: 20 });
  });

  it('should return the position from 100ms ago when finger is lifted', () => {
    const { result } = renderHook(() => useFingerSlipDetection());

    act(() => {
      // Add first point at time 0
      result.current.addPoint(10, 20);
    });

    act(() => {
      // Add second point after 50ms
      jest.advanceTimersByTime(50);
      result.current.addPoint(15, 25);
    });

    // When we check immediately, all points are within 100ms, so return first
    let finalPos = result.current.getFinalPosition();
    expect(finalPos).toEqual({ x: 10, y: 20 });

    act(() => {
      // Add third point after another 60ms (110ms total from first)
      jest.advanceTimersByTime(60);
      result.current.addPoint(20, 30);
    });

    // Now when we check, the first point (10,20) is >100ms old
    // So it should return (10, 20) as it's the most recent point that's >= 100ms old
    finalPos = result.current.getFinalPosition();
    expect(finalPos).toEqual({ x: 10, y: 20 });

    act(() => {
      // Advance to 200ms from first point
      jest.advanceTimersByTime(50);
    });

    // Now the first point is 200ms old, second is 150ms old, third is 100ms old
    // The most recent point that's >= 100ms old is the second point (15,25)
    finalPos = result.current.getFinalPosition();
    expect(finalPos).toEqual({ x: 15, y: 25 });
  });

  it('should reset properly', () => {
    const { result } = renderHook(() => useFingerSlipDetection());

    act(() => {
      result.current.addPoint(10, 20);
      result.current.addPoint(15, 25);
    });

    expect(result.current.getFinalPosition()).toEqual({ x: 10, y: 20 });

    act(() => {
      result.current.reset();
    });

    expect(result.current.getFinalPosition()).toBeNull();
  });

  it('should return first point for very quick taps', () => {
    const { result } = renderHook(() => useFingerSlipDetection());

    // Simulate a very quick tap where all points are within 100ms
    act(() => {
      result.current.addPoint(10, 10);
      jest.advanceTimersByTime(10);
      result.current.addPoint(15, 15);
      jest.advanceTimersByTime(10);
      result.current.addPoint(20, 20);
    });

    // All points are within 100ms, so return the first one
    const finalPos = result.current.getFinalPosition();
    expect(finalPos).toEqual({ x: 10, y: 10 });
  });
});
