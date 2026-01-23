import { act, renderHook } from '@testing-library/react-native';
import { BowType } from '@/types';
import { useBowForm } from './useBowForm';

describe('useBowForm', () => {
  const setupHook = () => renderHook(() => useBowForm());

  describe('initial state', () => {
    it('initializes with correct default values', () => {
      const { result } = setupHook();
      expect(result.current[0]).toEqual({
        name: '',
        nameError: false,
        type: BowType.RECURVE,
        eyeToNock: '',
        aimMeasure: '',
        eyeToSight: '',
        notes: '',
        isFavorite: false,
      });
    });
  });

  describe('form actions', () => {
    it('handles name changes and clears error', () => {
      const { result } = setupHook();
      act(() => {
        result.current[1]({ type: 'SET_NAME_ERROR', payload: true });
        result.current[1]({ type: 'SET_NAME', payload: 'Longbow' });
        result.current[1]({ type: 'SET_NAME_ERROR', payload: false });
      });
      expect(result.current[0].name).toBe('Longbow');
      expect(result.current[0].nameError).toBe(false);
    });

    it('handles bow type changes for valid types', () => {
      const { result } = setupHook();
      const bowTypes = [BowType.RECURVE, BowType.COMPOUND, BowType.TRADITIONAL];

      bowTypes.forEach((type) => {
        act(() => {
          result.current[1]({ type: 'SET_TYPE', payload: type });
        });
        expect(result.current[0].type).toBe(type);
      });
    });

    it('handles measurements and notes', () => {
      const { result } = setupHook();
      act(() => {
        result.current[1]({ type: 'SET_EYE_TO_NOCK', payload: '30' });
        result.current[1]({ type: 'SET_AIM_MEASURE', payload: '95' });
        result.current[1]({ type: 'SET_EYE_TO_SIGHT', payload: '12' });
        result.current[1]({ type: 'SET_NOTES', payload: 'Test notes' });
      });
      expect(result.current[0].eyeToNock).toBe('30');
      expect(result.current[0].aimMeasure).toBe('95');
      expect(result.current[0].eyeToSight).toBe('12');
      expect(result.current[0].notes).toBe('Test notes');
    });

    it('handles favorite status changes', () => {
      const { result } = setupHook();
      act(() => {
        result.current[1]({ type: 'SET_IS_FAVORITE', payload: true });
      });
      expect(result.current[0].isFavorite).toBe(true);
    });

    it('maintains state consistency across multiple actions', () => {
      const { result } = setupHook();

      act(() => {
        result.current[1]({ type: 'SET_NAME', payload: 'My Bow' });
        result.current[1]({ type: 'SET_TYPE', payload: BowType.COMPOUND });
        result.current[1]({ type: 'SET_EYE_TO_NOCK', payload: '30' });
        result.current[1]({ type: 'SET_IS_FAVORITE', payload: true });
      });

      expect(result.current[0]).toEqual(
        expect.objectContaining({
          name: 'My Bow',
          type: BowType.COMPOUND,
          eyeToNock: '30',
          isFavorite: true,
        }),
      );
    });
  });
});
