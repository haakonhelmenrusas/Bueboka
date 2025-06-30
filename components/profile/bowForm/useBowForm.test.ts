import { act, renderHook } from '@testing-library/react-native';
import { useBowForm } from './useBowForm';

describe('useBowForm', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useBowForm());
    expect(result.current[0]).toEqual({
      bowName: '',
      bowNameError: false,
      bowType: 'recurve',
      placement: 'behind',
      eyeToNock: '',
      eyeToAim: '',
      interval_sight_real: '',
      intervalSightMeasure: '',
    });
  });

  it('sets bow name', () => {
    const { result } = renderHook(() => useBowForm());
    act(() => {
      result.current[1]({ type: 'SET_BOW_NAME', payload: 'Longbow' });
    });
    expect(result.current[0].bowName).toBe('Longbow');
  });

  it('sets bow name error', () => {
    const { result } = renderHook(() => useBowForm());
    act(() => {
      result.current[1]({ type: 'SET_BOW_NAME_ERROR', payload: true });
    });
    expect(result.current[0].bowNameError).toBe(true);
  });

  it('sets bow type', () => {
    const { result } = renderHook(() => useBowForm());
    act(() => {
      result.current[1]({ type: 'SET_BOW_TYPE', payload: 'compound' });
    });
    expect(result.current[0].bowType).toBe('compound');
  });

  it('sets placement', () => {
    const { result } = renderHook(() => useBowForm());
    act(() => {
      result.current[1]({ type: 'SET_PLACEMENT', payload: 'front' });
    });
    expect(result.current[0].placement).toBe('front');
  });

  it('sets eye to nock', () => {
    const { result } = renderHook(() => useBowForm());
    act(() => {
      result.current[1]({ type: 'SET_EYE_TO_NOCK', payload: '30' });
    });
    expect(result.current[0].eyeToNock).toBe('30');
  });

  it('sets eye to aim', () => {
    const { result } = renderHook(() => useBowForm());
    act(() => {
      result.current[1]({ type: 'SET_EYE_TO_AIM', payload: '25' });
    });
    expect(result.current[0].eyeToAim).toBe('25');
  });
});
