import { useReducer } from 'react';

interface BowTypeState {
  bowName: string;
  bowNameError: boolean;
  bowType: string;
  placement: string;
  eyeToNock: string;
  eyeToAim: string;
  arrowWeight: string;
  arrowDiameter: string;
  interval_sight_real: string;
  intervalSightMeasure: string;
}

export type Action =
  | { type: 'SET_BOW_NAME'; payload: string }
  | { type: 'SET_BOW_NAME_ERROR'; payload: boolean }
  | { type: 'SET_BOW_TYPE'; payload: string }
  | { type: 'SET_PLACEMENT'; payload: string }
  | { type: 'SET_EYE_TO_NOCK'; payload: string }
  | { type: 'SET_EYE_TO_AIM'; payload: string }
  | { type: 'SET_ARROW_WEIGHT'; payload: string }
  | { type: 'SET_ARROW_DIAMETER'; payload: string }
  | { type: 'SET_INTERVAL_SIGHT_REAL'; payload: string }
  | { type: 'SET_INTERVAL_SIGHT_MEASURE'; payload: string };

function reducer(state: BowTypeState, action: Action): BowTypeState {
  switch (action.type) {
    case 'SET_BOW_NAME':
      return { ...state, bowName: action.payload };
    case 'SET_BOW_NAME_ERROR':
      return { ...state, bowNameError: action.payload };
    case 'SET_BOW_TYPE':
      return { ...state, bowType: action.payload };
    case 'SET_PLACEMENT':
      return { ...state, placement: action.payload };
    case 'SET_EYE_TO_NOCK':
      return { ...state, eyeToNock: action.payload };
    case 'SET_EYE_TO_AIM':
      return { ...state, eyeToAim: action.payload };
    case 'SET_ARROW_WEIGHT':
      return { ...state, arrowWeight: action.payload };
    case 'SET_ARROW_DIAMETER':
      return { ...state, arrowDiameter: action.payload };
    case 'SET_INTERVAL_SIGHT_REAL':
      return { ...state, interval_sight_real: action.payload };
    case 'SET_INTERVAL_SIGHT_MEASURE':
      return { ...state, intervalSightMeasure: action.payload };
    default:
      return state;
  }
}

export const useBowForm = () => {
  const INITIAL_STATE: BowTypeState = {
    bowName: '',
    bowNameError: false,
    bowType: 'recurve',
    placement: 'behind',
    eyeToNock: '',
    eyeToAim: '',
    arrowWeight: '',
    arrowDiameter: '',
    interval_sight_real: '',
    intervalSightMeasure: '',
  };
  return useReducer(reducer, INITIAL_STATE);
};
