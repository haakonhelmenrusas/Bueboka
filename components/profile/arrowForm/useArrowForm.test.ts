import { Material } from '@/types';
import { Action, ArrowSetState, reducer } from '@/components/profile/arrowForm/useArrowForm';

const INITIAL_STATE: ArrowSetState = {
  name: '',
  weight: '',
  length: '',
  material: Material.KARBON,
  spine: '',
  diameter: '',
  arrowsCount: '',
  pointType: '',
  pointWeight: '',
  vanes: '',
  nock: '',
  notes: '',
  isFavorite: false,
};

describe('arrowForm reducer', () => {
  it('sets arrow name', () => {
    const action: Action = { type: 'SET_NAME', payload: 'Carbon Elite' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.name).toBe('Carbon Elite');
  });

  it('sets arrow weight', () => {
    const action: Action = { type: 'SET_WEIGHT', payload: '27.4' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.weight).toBe('27.4');
  });

  it('sets arrow length', () => {
    const action: Action = { type: 'SET_LENGTH', payload: '92' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.length).toBe('92');
  });

  it('sets material', () => {
    const action: Action = { type: 'SET_MATERIAL', payload: Material.ALUMINIUM };
    const state = reducer(INITIAL_STATE, action);
    expect(state.material).toBe(Material.ALUMINIUM);
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
    const action: Action = { type: 'SET_ARROWS_COUNT', payload: '12' };
    const state = reducer(INITIAL_STATE, action);
    expect(state.arrowsCount).toBe('12');
  });

  it('sets point details', () => {
    const pointTypeAction: Action = { type: 'SET_POINT_TYPE', payload: 'bullet' };
    const pointWeightAction: Action = { type: 'SET_POINT_WEIGHT', payload: '100' };
    const stateAfterType = reducer(INITIAL_STATE, pointTypeAction);
    const stateAfterWeight = reducer(stateAfterType, pointWeightAction);
    expect(stateAfterWeight.pointType).toBe('bullet');
    expect(stateAfterWeight.pointWeight).toBe('100');
  });

  it('sets vanes, nock and notes', () => {
    const stateWithVanes = reducer(INITIAL_STATE, { type: 'SET_VANES', payload: 'Spin Wing' });
    const stateWithNock = reducer(stateWithVanes, { type: 'SET_NOCK', payload: 'Beiter' });
    const finalState = reducer(stateWithNock, { type: 'SET_NOTES', payload: 'Practice set' });
    expect(finalState.vanes).toBe('Spin Wing');
    expect(finalState.nock).toBe('Beiter');
    expect(finalState.notes).toBe('Practice set');
  });

  it('sets isFavorite to true', () => {
    const action: Action = { type: 'SET_FAVORITE', payload: true };
    const state = reducer(INITIAL_STATE, action);
    expect(state.isFavorite).toBe(true);
  });
});
