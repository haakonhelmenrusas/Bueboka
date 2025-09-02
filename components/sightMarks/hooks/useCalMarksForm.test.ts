import { useCalcMarksForm } from './useCalcMarksForm';
import { act, renderHook } from '@testing-library/react-native';

describe('useCalcMarksForm', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    expect(result.current[0]).toEqual({
      distanceFrom: '10',
      distanceFromError: false,
      distanceTo: '90',
      distanceToError: false,
      interval: '10',
      intervalError: false,
      angles: [-30, 0, 30],
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

  it('sets angles correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    act(() => {
      result.current[1]({ type: 'SET_ANGLES', payload: [10, 20, 30] });
    });
    expect(result.current[0].angles).toEqual([10, 20, 30]);
  });

  it('loads form data correctly', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    const mockData = {
      distanceFrom: '15',
      distanceFromError: false,
      distanceTo: '100',
      distanceToError: false,
      interval: '5',
      intervalError: false,
      angles: [45, 0, -45],
    };

    act(() => {
      result.current[1]({ type: 'LOAD_FORM_DATA', payload: mockData });
    });

    expect(result.current[0]).toEqual(mockData);
  });

  it('handles unknown action type gracefully', () => {
    const { result } = renderHook(() => useCalcMarksForm());
    const initialState = result.current[0];

    act(() => {
      result.current[1]({ type: 'UNKNOWN_ACTION' as any, payload: true });
    });

    expect(result.current[0]).toEqual(initialState);
  });
});
