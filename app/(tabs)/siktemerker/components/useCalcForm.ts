import { useReducer } from 'react';

interface CalcFormState {
  opened: boolean;
  aimError: boolean;
  aimValue: string;
  distanceError: boolean;
  distanceValue: string;
}

export type Action =
  | { type: 'SET_OPENED'; payload: boolean }
  | { type: 'SET_AIM_ERROR'; payload: boolean }
  | { type: 'SET_AIM_VALUE'; payload: string }
  | { type: 'SET_DISTANCE_ERROR'; payload: boolean }
  | { type: 'SET_DISTANCE_VALUE'; payload: string };

function reducer(state: CalcFormState, action: Action): CalcFormState {
  switch (action.type) {
    case 'SET_OPENED':
      return { ...state, opened: action.payload };
    case 'SET_AIM_ERROR':
      return { ...state, aimError: action.payload };
    case 'SET_AIM_VALUE':
      return { ...state, aimValue: action.payload };
    case 'SET_DISTANCE_ERROR':
      return { ...state, distanceError: action.payload };
    case 'SET_DISTANCE_VALUE':
      return { ...state, distanceValue: action.payload };
    default:
      return state;
  }
}

export const useCalcForm = () => {
  const INITIAL_STATE: CalcFormState = {
    opened: false,
    aimError: false,
    aimValue: '',
    distanceError: false,
    distanceValue: '',
  };
  return useReducer(reducer, INITIAL_STATE);
};
