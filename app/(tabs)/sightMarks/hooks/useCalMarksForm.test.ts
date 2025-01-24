import { useCalcMarksForm } from './useCalcMarksForm';
import { renderHook, act } from '@testing-library/react-native';

describe('useCalcMarksForm', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    expect(result.current[0]).toEqual({
      distanceFrom: '',
      distanceFromError: false,
      distanceTo: '',
      distanceToError: false,
      interval: '',
      intervalError: false,
      anglesVisible: false,
      angles: [],
    });
  });

  it('sets distance from correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_DISTANCE_FROM', payload: '100' });
    });
    expect(result.current[0].distanceFrom).toBe('100');
  });

  it('sets distance from error correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_DISTANCE_FROM_ERROR', payload: true });
    });
    expect(result.current[0].distanceFromError).toBe(true);
  });

  it('sets distance to correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_DISTANCE_TO', payload: '200' });
    });
    expect(result.current[0].distanceTo).toBe('200');
  });

  it('sets distance to error correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_DISTANCE_TO_ERROR', payload: true });
    });
    expect(result.current[0].distanceToError).toBe(true);
  });

  it('sets interval correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_INTERVAL', payload: '50' });
    });
    expect(result.current[0].interval).toBe('50');
  });

  it('sets interval error correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_INTERVAL_ERROR', payload: true });
    });
    expect(result.current[0].intervalError).toBe(true);
  });

  it('sets angles visible correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_ANGLES_VISIBLE', payload: true });
    });
    expect(result.current[0].anglesVisible).toBe(true);
  });

  it('sets angles correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_ANGLES', payload: [10, 20, 30] });
    });
    expect(result.current[0].angles).toEqual([10, 20, 30]);
  });

  it('handles unknown action type gracefully', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'UNKNOWN_ACTION' as any, payload: true });
    });
    expect(result.current[0]).toEqual({
      distanceFrom: '',
      distanceFromError: false,
      distanceTo: '',
      distanceToError: false,
      interval: '',
      intervalError: false,
      anglesVisible: false,
      angles: [],
    });
  });
});
