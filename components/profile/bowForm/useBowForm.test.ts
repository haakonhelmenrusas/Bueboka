import { act, renderHook } from '@testing-library/react-native';
import { useBowForm } from './useBowForm';

describe('useBowForm', () => {
  // Helper function to setup the hook
  const setupHook = () => {
    return renderHook(() => useBowForm());
  };

  describe('initial state', () => {
    it('initializes with correct default values', () => {
      const { result } = setupHook();
      expect(result.current[0]).toEqual({
        bowName: '',
        bowNameError: false,
        bowType: 'recurve',
        placement: 'behind',
        eyeToNock: '',
        eyeToAim: '',
        interval_sight_real: '',
        intervalSightMeasure: '',
        isFavorite: false,
      });
    });
  });

  describe('form actions', () => {
    it('handles bow name changes', () => {
      const { result } = setupHook();
      act(() => {
        result.current[1]({ type: 'SET_BOW_NAME', payload: 'Longbow' });
      });
      expect(result.current[0].bowName).toBe('Longbow');
      expect(result.current[0].bowNameError).toBe(false);
    });

    it('handles empty bow name', () => {
      const { result } = setupHook();
      act(() => {
        result.current[1]({ type: 'SET_BOW_NAME', payload: '' });
      });
      expect(result.current[0].bowName).toBe('');
    });

    it('handles bow type changes for all valid types', () => {
      const { result } = setupHook();
      const bowTypes = ['recurve', 'compound', 'traditional'] as const;

      bowTypes.forEach((type) => {
        act(() => {
          result.current[1]({ type: 'SET_BOW_TYPE', payload: type });
        });
        expect(result.current[0].bowType).toBe(type);
      });
    });

    it('handles placement changes correctly', () => {
      const { result } = setupHook();
      const placements = ['front', 'behind', 'center'] as const;

      placements.forEach((placement) => {
        act(() => {
          result.current[1]({ type: 'SET_PLACEMENT', payload: placement });
        });
        expect(result.current[0].placement).toBe(placement);
      });
    });

    describe('measurement inputs', () => {
      it('handles eye to nock measurements', () => {
        const { result } = setupHook();
        const testValues = ['30', '30.5', '0', '100'];

        testValues.forEach((value) => {
          act(() => {
            result.current[1]({ type: 'SET_EYE_TO_NOCK', payload: value });
          });
          expect(result.current[0].eyeToNock).toBe(value);
        });
      });

      it('handles eye to aim measurements', () => {
        const { result } = setupHook();
        const testValues = ['25', '25.5', '0', '100'];

        testValues.forEach((value) => {
          act(() => {
            result.current[1]({ type: 'SET_EYE_TO_AIM', payload: value });
          });
          expect(result.current[0].eyeToAim).toBe(value);
        });
      });

      it('handles interval sight measurements', () => {
        const { result } = setupHook();
        act(() => {
          result.current[1]({ type: 'SET_INTERVAL_SIGHT_MEASURE', payload: '5' });
        });
        expect(result.current[0].intervalSightMeasure).toBe('5');
      });
    });

    it('handles favorite status changes', () => {
      const { result } = setupHook();
      act(() => {
        result.current[1]({ type: 'SET_IS_FAVORITE', payload: true });
      });
      expect(result.current[0].isFavorite).toBe(true);

      act(() => {
        result.current[1]({ type: 'SET_IS_FAVORITE', payload: false });
      });
      expect(result.current[0].isFavorite).toBe(false);
    });

    it('maintains state consistency across multiple actions', () => {
      const { result } = setupHook();

      act(() => {
        result.current[1]({ type: 'SET_BOW_NAME', payload: 'My Bow' });
        result.current[1]({ type: 'SET_BOW_TYPE', payload: 'compound' });
        result.current[1]({ type: 'SET_EYE_TO_NOCK', payload: '30' });
        result.current[1]({ type: 'SET_IS_FAVORITE', payload: true });
      });

      expect(result.current[0]).toEqual(
        expect.objectContaining({
          bowName: 'My Bow',
          bowType: 'compound',
          eyeToNock: '30',
          isFavorite: true,
        }),
      );
    });
  });
});
