import { useCalcForm } from './useCalcForm';
import { renderHook, act } from '@testing-library/react-native';

describe('useCalcForm', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useCalcForm());
    expect(result.current[0]).toEqual({
      opened: false,
      aimError: false,
      aimValue: '',
      distanceError: false,
      distanceValue: '',
    });
  });

  it('sets opened state correctly', () => {
    const { result } = renderHook(() => useCalcForm());
    act(() => {
      result.current[1]({ type: 'SET_OPENED', payload: true });
    });
    expect(result.current[0].opened).toBe(true);
  });

  it('sets aim error state correctly', () => {
    const { result } = renderHook(() => useCalcForm());
    act(() => {
      result.current[1]({ type: 'SET_AIM_ERROR', payload: true });
    });
    expect(result.current[0].aimError).toBe(true);
  });

  it('sets aim value correctly', () => {
    const { result } = renderHook(() => useCalcForm());
    act(() => {
      result.current[1]({ type: 'SET_AIM_VALUE', payload: '10' });
    });
    expect(result.current[0].aimValue).toBe('10');
  });

  it('sets distance error state correctly', () => {
    const { result } = renderHook(() => useCalcForm());
    act(() => {
      result.current[1]({ type: 'SET_DISTANCE_ERROR', payload: true });
    });
    expect(result.current[0].distanceError).toBe(true);
  });

  it('sets distance value correctly', () => {
    const { result } = renderHook(() => useCalcForm());
    act(() => {
      result.current[1]({ type: 'SET_DISTANCE_VALUE', payload: '100' });
    });
    expect(result.current[0].distanceValue).toBe('100');
  });

  it('handles unknown action type gracefully', () => {
    const { result } = renderHook(() => useCalcForm());
    act(() => {
      result.current[1]({ type: 'UNKNOWN_ACTION' as any, payload: true });
    });
    expect(result.current[0]).toEqual({
      opened: false,
      aimError: false,
      aimValue: '',
      distanceError: false,
      distanceValue: '',
    });
  });
});
