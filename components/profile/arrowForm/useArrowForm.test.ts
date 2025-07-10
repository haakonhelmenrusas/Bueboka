import { Material } from '@/types';
import { reducer } from '@/components/profile/arrowForm/useArrowForm';
import { ArrowSetState, Action } from '@/components/profile/arrowForm/useArrowForm';

const INITIAL_STATE: ArrowSetState = {
  name: '',
  weight: '',
  length: '',
  material: Material.Karbon,
  spine: '',
  diameter: '',
  numberOfArrows: '',
  isFavorite: false,
};

describe('arrowForm reducer', () => {
  it('sets arrow name', () => {
    const action: Action = { type: 'SET_ARROW_NAME', payload: 'Carbon Elite' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.name).toBe('Carbon Elite');
  });

  it('sets arrow weight', () => {
    const action: Action = { type: 'SET_ARROW_WEIGHT', payload: '27.4' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.weight).toBe('27.4');
  });

  it('sets arrow length', () => {
    const action: Action = { type: 'SET_ARROW_LENGTH', payload: '92' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.length).toBe('92');
  });

  it('sets material', () => {
    const action: Action = { type: 'SET_MATERIAL', payload: Material.Aluminum };
    const state = reducer(INITIAL_STATE, action);
    expect(state.material).toBe(Material.Aluminum);
  });

  it('sets diameter', () => {
    const action: Action = { type: 'SET_DIAMETER', payload: '6.5' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.diameter).toBe('6.5');
  });

  it('sets spine', () => {
    const action: Action = { type: 'SET_SPINE', payload: '350' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.spine).toBe('350');
  });

  it('sets number of arrows', () => {
    const action: Action = { type: 'SET_NUMBER_OF_ARROWS', payload: '12' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.numberOfArrows).toBe('12');
  });

  it('sets isFavorite to true', () => {
    const action: Action = { type: 'SET_FAVORITE', payload: true };
    const state = reducer(INITIAL_STATE, action);
    expect(state.isFavorite).toBe(true);
  });

});
